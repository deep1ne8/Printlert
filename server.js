const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const snmp = require('net-snmp');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Winston logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'printlert' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
});

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// SNMP Configuration
const SNMP_TIMEOUT = 3000;
const SNMP_RETRIES = 3;

// SNMP Session Pool
const snmpSessions = new Map();

function getSnmpSession(ip, community) {
    const key = `${ip}-${community}`;
    if (!snmpSessions.has(key)) {
        const session = snmp.createSession(ip, community, {
            timeout: SNMP_TIMEOUT,
            retries: SNMP_RETRIES,
            transport: "udp4"
        });
        snmpSessions.set(key, session);
    }
    return snmpSessions.get(key);
}

// SNMP API Endpoints
app.post('/api/snmp', async (req, res) => {
    try {
        const { ip, community, oid, timeout = SNMP_TIMEOUT } = req.body;
        
        // Input validation
        if (!ip || !community || !oid) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // IP validation
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(ip)) {
            return res.status(400).json({ error: 'Invalid IP address' });
        }

        logger.info(`SNMP GET request for ${ip}:${oid}`);

        const session = getSnmpSession(ip, community);
        
        return new Promise((resolve, reject) => {
            session.get([oid], (error, varbinds) => {
                if (error) {
                    logger.error(`SNMP error for ${ip}: ${error.message}`);
                    resolve(res.status(500).json({ error: error.message }));
                } else {
                    const varbind = varbinds[0];
                    if (snmp.isVarbindError(varbind)) {
                        logger.error(`SNMP varbind error for ${ip}: ${snmp.varbindError(varbind)}`);
                        resolve(res.status(500).json({ error: snmp.varbindError(varbind) }));
                    } else {
                        logger.info(`SNMP success for ${ip}:${oid} = ${varbind.value}`);
                        resolve(res.json({ value: varbind.value }));
                    }
                }
            });
        });

    } catch (error) {
        logger.error(`SNMP API error: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/snmp/walk', async (req, res) => {
    try {
        const { ip, community, baseOid, maxRepetitions = 10 } = req.body;
        
        if (!ip || !community || !baseOid) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        logger.info(`SNMP WALK request for ${ip}:${baseOid}`);

        const session = getSnmpSession(ip, community);
        const results = [];

        return new Promise((resolve, reject) => {
            session.tableColumns(baseOid, maxRepetitions, (error, table) => {
                if (error) {
                    logger.error(`SNMP WALK error for ${ip}: ${error.message}`);
                    resolve(res.status(500).json({ error: error.message }));
                } else {
                    logger.info(`SNMP WALK success for ${ip}:${baseOid} - ${Object.keys(table).length} results`);
                    resolve(res.json({ results: table }));
                }
            });
        });

    } catch (error) {
        logger.error(`SNMP WALK API error: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Notification API Endpoints
app.post('/api/notifications/email', async (req, res) => {
    try {
        const { to, subject, body, severity } = req.body;
        
        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Email configuration
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_FROM || 'printlert@yourdomain.com',
            to: to,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: ${severity === 'critical' ? '#e74c3c' : '#f39c12'};">${subject}</h2>
                    <p>${body}</p>
                    <hr>
                    <p style="font-size: 12px; color: #666;">
                        This alert was generated by Printlert at ${new Date().toISOString()}
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email notification sent to ${to}`);
        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        logger.error(`Email notification error: ${error.message}`);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/api/notifications/sms', async (req, res) => {
    try {
        const { to, message, severity } = req.body;
        
        if (!to || !message) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Twilio configuration
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const twilioMessage = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        logger.info(`SMS notification sent to ${to}: ${twilioMessage.sid}`);
        res.json({ success: true, message: 'SMS sent successfully', sid: twilioMessage.sid });

    } catch (error) {
        logger.error(`SMS notification error: ${error.message}`);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
});

// Logs API
app.post('/api/logs', (req, res) => {
    try {
        const { level, message, data, timestamp } = req.body;
        logger.log(level || 'info', message, data);
        res.json({ success: true });
    } catch (error) {
        logger.error(`Log API error: ${error.message}`);
        res.status(500).json({ error: 'Failed to log message' });
    }
});

app.get('/api/logs', (req, res) => {
    try {
        const { level, limit = 100 } = req.query;
        // In production, you'd fetch logs from a database
        res.json({ logs: [], message: 'Logs endpoint - implement database integration' });
    } catch (error) {
        logger.error(`Get logs error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve logs' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Performance metrics endpoint
app.get('/api/metrics', (req, res) => {
    const metrics = {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
        activeConnections: snmpSessions.size
    };
    res.json(metrics);
});

// Serve the main application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error(`Unhandled error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    
    // Close SNMP sessions
    for (const [key, session] of snmpSessions) {
        session.close();
    }
    snmpSessions.clear();
    
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    
    // Close SNMP sessions
    for (const [key, session] of snmpSessions) {
        session.close();
    }
    snmpSessions.clear();
    
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    logger.info(`Printlert server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
