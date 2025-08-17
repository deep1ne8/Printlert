# Printlert Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying Printlert in a production environment with enterprise-grade features including security, monitoring, and scalability.

## Prerequisites

- Node.js 16+ and npm 8+
- Docker and Docker Compose (for containerized deployment)
- SMTP server credentials (for email notifications)
- Twilio account (for SMS notifications)
- SSL certificate (for HTTPS)
- Domain name (optional but recommended)

## Quick Start (Docker)

### 1. Clone and Setup

```bash
git clone https://github.com/deep1ne8/Printlert.git
cd Printlert
```

### 2. Configure Environment

```bash
cp env.example .env
# Edit .env with your production values
```

### 3. Deploy with Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

## Manual Deployment

### 1. Install Dependencies

```bash
npm ci --only=production
```

### 2. Configure Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Required
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Start the Application

```bash
npm start
```

## Production Features

### Security Features

- **Helmet.js**: Security headers and CSP
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Sanitizes all inputs
- **CORS Protection**: Configurable origins
- **Non-root Docker User**: Enhanced container security

### Monitoring & Logging

- **Winston Logging**: Structured logging with file rotation
- **Health Checks**: Docker health monitoring
- **Performance Metrics**: Real-time system metrics
- **Error Tracking**: Comprehensive error handling

### Notification System

- **Email Alerts**: SMTP-based notifications
- **SMS Alerts**: Twilio integration
- **Configurable Thresholds**: Custom alert levels
- **Multiple Recipients**: Comma-separated lists

### SNMP Capabilities

- **Real SNMP**: Production-grade SNMP implementation
- **Session Pooling**: Efficient connection management
- **Timeout Handling**: Configurable timeouts
- **Error Recovery**: Automatic retry mechanisms

## Configuration Options

### Email Configuration

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=printlert@yourdomain.com
```

### SMS Configuration (Twilio)

```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### SNMP Configuration

```env
SNMP_TIMEOUT=3000
SNMP_RETRIES=3
SNMP_COMMUNITY=public
```

## SSL/HTTPS Setup

### Using Nginx (Recommended)

1. Create SSL certificate:
```bash
mkdir ssl
# Add your SSL certificate files to ssl/ directory
```

2. Configure nginx.conf:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://printlert:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Deploy with SSL:
```bash
docker-compose -f docker-compose.yml up -d
```

## Monitoring & Maintenance

### Health Monitoring

- **Health Check Endpoint**: `GET /api/health`
- **Metrics Endpoint**: `GET /api/metrics`
- **Docker Health Checks**: Automatic container monitoring

### Log Management

```bash
# View application logs
docker-compose logs -f printlert

# View nginx logs
docker-compose logs -f nginx

# View all logs
docker-compose logs -f
```

### Backup Strategy

```bash
# Backup configuration
docker-compose exec printlert tar -czf /backup/config-$(date +%Y%m%d).tar.gz /app/data

# Backup logs
docker-compose exec printlert tar -czf /backup/logs-$(date +%Y%m%d).tar.gz /app/logs
```

## Performance Optimization

### Scaling

```bash
# Scale the application
docker-compose up -d --scale printlert=3

# Load balancer configuration
# Add nginx load balancer configuration
```

### Resource Limits

```yaml
# In docker-compose.yml
services:
  printlert:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

## Troubleshooting

### Common Issues

1. **SNMP Connection Failed**
   - Check firewall settings
   - Verify SNMP community string
   - Ensure printer is accessible

2. **Email Notifications Not Working**
   - Verify SMTP credentials
   - Check spam folder
   - Test SMTP connection

3. **High Memory Usage**
   - Monitor with `docker stats`
   - Check for memory leaks
   - Adjust resource limits

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug docker-compose up

# View detailed logs
docker-compose logs -f --tail=100 printlert
```

## Security Best Practices

1. **Change Default Passwords**: Update all default credentials
2. **Use Strong JWT Secrets**: Generate cryptographically secure secrets
3. **Enable HTTPS**: Always use SSL in production
4. **Regular Updates**: Keep dependencies updated
5. **Network Security**: Restrict access to necessary ports only
6. **Backup Encryption**: Encrypt backup files
7. **Access Control**: Implement proper authentication

## Support

For issues and questions:
- GitHub Issues: https://github.com/deep1ne8/Printlert/issues
- Documentation: https://github.com/deep1ne8/Printlert#readme

## License

MIT License - see LICENSE file for details.
