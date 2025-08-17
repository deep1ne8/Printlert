// Printlert - Production-Ready Printer Supply Monitor
// Comprehensive SNMP-based printer monitoring system

class PrintlertApp {
    constructor() {
        this.printers = [];
        this.alerts = [];
        this.settings = this.loadSettings();
        this.scanInterval = null;
        this.oidConfigurations = this.getOIDConfigurations();
        this.isProduction = window.location.hostname !== 'localhost';
        this.logger = new Logger();
        this.security = new SecurityManager();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPrinters();
        this.updateDashboard();
        this.updateOIDConfig();
        this.startAutoScan();
        this.logger.log('info', 'Printlert application initialized');
    }

    // OID Configurations for different printer manufacturers
    getOIDConfigurations() {
        return {
            generic: {
                name: "Generic Printer",
                oids: {
                    systemName: "1.3.6.1.2.1.25.3.2.1.3.1",
                    systemDescription: "1.3.6.1.2.1.1.1.0",
                    blackTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    blackTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.1",
                    cyanTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.2",
                    cyanTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.2",
                    magentaTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.3",
                    magentaTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.3",
                    yellowTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.4",
                    yellowTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.4",
                    totalPrints: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1"
                }
            },
            hp: {
                name: "HP Printer",
                oids: {
                    systemName: "1.3.6.1.2.1.25.3.2.1.3.1",
                    systemDescription: "1.3.6.1.2.1.1.1.0",
                    blackTonerLevel: "1.3.6.1.2.1.43.11.1.1.9.1.1",
                    blackTonerMaxLevel: "1.3.6.1.2.1.43.11.1.1.8.1.1",
                    cyanTonerLevel: "1.3.6.1.2.1.43.11.1.1.9.1.2",
                    cyanTonerMaxLevel: "1.3.6.1.2.1.43.11.1.1.8.1.2",
                    magentaTonerLevel: "1.3.6.1.2.1.43.11.1.1.9.1.3",
                    magentaTonerMaxLevel: "1.3.6.1.2.1.43.11.1.1.8.1.3",
                    yellowTonerLevel: "1.3.6.1.2.1.43.11.1.1.9.1.4",
                    yellowTonerMaxLevel: "1.3.6.1.2.1.43.11.1.1.8.1.4",
                    totalPrints: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1",
                    // HP-specific OIDs
                    hpTonerLevel: "1.3.6.1.4.1.11.2.3.9.4.2.1.4.1.2.1",
                    hpTonerMaxLevel: "1.3.6.1.4.1.11.2.3.9.4.2.1.4.1.2.2"
                }
            },
            canon: {
                name: "Canon Printer",
                oids: {
                    systemName: "1.3.6.1.2.1.25.3.2.1.3.1",
                    systemDescription: "1.3.6.1.2.1.1.1.0",
                    blackTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    blackTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.1",
                    cyanTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.2",
                    cyanTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.2",
                    magentaTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.3",
                    magentaTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.3",
                    yellowTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.4",
                    yellowTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.4",
                    totalPrints: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1",
                    // Canon-specific OIDs
                    canonTonerLevel: "1.3.6.1.4.1.1602.1.11.1.3.1.4.1",
                    canonTonerMaxLevel: "1.3.6.1.4.1.1602.1.11.1.3.1.5.1"
                }
            },
            epson: {
                name: "Epson Printer",
                oids: {
                    systemName: "1.3.6.1.2.1.25.3.2.1.3.1",
                    systemDescription: "1.3.6.1.2.1.1.1.0",
                    blackTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    blackTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.1",
                    cyanTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.2",
                    cyanTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.2",
                    magentaTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.3",
                    magentaTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.3",
                    yellowTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.4",
                    yellowTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.4",
                    totalPrints: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1",
                    // Epson-specific OIDs
                    epsonTonerLevel: "1.3.6.1.4.1.1248.1.2.2.1.1.1.3.1",
                    epsonTonerMaxLevel: "1.3.6.1.4.1.1248.1.2.2.1.1.1.4.1"
                }
            },
            brother: {
                name: "Brother Printer",
                oids: {
                    systemName: "1.3.6.1.2.1.25.3.2.1.3.1",
                    systemDescription: "1.3.6.1.2.1.1.1.0",
                    blackTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    blackTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.1",
                    cyanTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.2",
                    cyanTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.2",
                    magentaTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.3",
                    magentaTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.3",
                    yellowTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.4",
                    yellowTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.4",
                    totalPrints: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1",
                    // Brother-specific OIDs
                    brotherTonerLevel: "1.3.6.1.4.1.2435.2.3.9.4.2.1.5.5.1.0",
                    brotherTonerMaxLevel: "1.3.6.1.4.1.2435.2.3.9.4.2.1.5.5.2.0"
                }
            },
            lexmark: {
                name: "Lexmark Printer",
                oids: {
                    systemName: "1.3.6.1.2.1.25.3.2.1.3.1",
                    systemDescription: "1.3.6.1.2.1.1.1.0",
                    blackTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    blackTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.1",
                    cyanTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.2",
                    cyanTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.2",
                    magentaTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.3",
                    magentaTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.3",
                    yellowTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.4",
                    yellowTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.4",
                    totalPrints: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1",
                    // Lexmark-specific OIDs
                    lexmarkTonerLevel: "1.3.6.1.4.1.641.2.1.2.1.2.1.1.3.1",
                    lexmarkTonerMaxLevel: "1.3.6.1.4.1.641.2.1.2.1.2.1.1.4.1"
                }
            },
            xerox: {
                name: "Xerox Printer",
                oids: {
                    systemName: "1.3.6.1.2.1.25.3.2.1.3.1",
                    systemDescription: "1.3.6.1.2.1.1.1.0",
                    blackTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    blackTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.1",
                    cyanTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.2",
                    cyanTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.2",
                    magentaTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.3",
                    magentaTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.3",
                    yellowTonerLevel: "1.3.6.1.2.1.43.10.2.1.4.1.4",
                    yellowTonerMaxLevel: "1.3.6.1.2.1.43.10.2.1.5.1.4",
                    totalPrints: "1.3.6.1.2.1.43.10.2.1.4.1.1",
                    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1",
                    // Xerox-specific OIDs
                    xeroxTonerLevel: "1.3.6.1.4.1.128.2.1.6.1.2.1.1.3.1",
                    xeroxTonerMaxLevel: "1.3.6.1.4.1.128.2.1.6.1.2.1.1.4.1"
                }
            }
        };
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(item.dataset.section);
            });
        });

        // Buttons
        document.getElementById('scanBtn').addEventListener('click', () => this.scanAllPrinters());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshDashboard());
        document.getElementById('addPrinterBtn').addEventListener('click', () => this.showAddPrinterModal());
        document.getElementById('savePrinterBtn').addEventListener('click', () => this.addPrinter());
        document.getElementById('clearAlertsBtn').addEventListener('click', () => this.clearAllAlerts());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('exportConfigBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('importConfigBtn').addEventListener('click', () => this.importConfig());

        // Modal events
        document.querySelector('.modal-close').addEventListener('click', () => this.hideModal());
        document.querySelector('.modal-cancel').addEventListener('click', () => this.hideModal());
        document.getElementById('printerModel').addEventListener('change', () => this.updateOIDConfig());

        // Close modal on outside click
        document.getElementById('addPrinterModal').addEventListener('click', (e) => {
            if (e.target.id === 'addPrinterModal') {
                this.hideModal();
            }
        });
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        // Update content based on section
        switch(sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'printers':
                this.updatePrinterList();
                break;
            case 'alerts':
                this.updateAlerts();
                break;
        }
    }

    // Production SNMP Implementation
    async snmpGet(ip, community, oid) {
        try {
            if (this.isProduction) {
                return await this.realSNMPGet(ip, community, oid);
            } else {
                return await this.simulateSNMPResponse(ip, oid);
            }
        } catch (error) {
            this.logger.log('error', `SNMP GET failed for ${ip}: ${error.message}`);
            throw error;
        }
    }

    async realSNMPGet(ip, community, oid) {
        // Production SNMP implementation using WebSocket proxy or server-side API
        const response = await fetch('/api/snmp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.security.getToken()}`
            },
            body: JSON.stringify({
                ip: ip,
                community: community,
                oid: oid,
                timeout: this.settings.timeout
            })
        });

        if (!response.ok) {
            throw new Error(`SNMP request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.value;
    }

    // Simulate SNMP responses for demo purposes
    async simulateSNMPResponse(ip, oid) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

        // Simulate different responses based on OID
        const responses = {
            '1.3.6.1.2.1.1.1.0': `Printer at ${ip}`,
            '1.3.6.1.2.1.25.3.2.1.3.1': `Printer-${ip.split('.').pop()}`,
            '1.3.6.1.2.1.43.10.2.1.4.1.1': Math.floor(Math.random() * 100) + 1, // Black toner
            '1.3.6.1.2.1.43.10.2.1.5.1.1': 100, // Max black toner
            '1.3.6.1.2.1.43.10.2.1.4.1.2': Math.floor(Math.random() * 100) + 1, // Cyan toner
            '1.3.6.1.2.1.43.10.2.1.5.1.2': 100, // Max cyan toner
            '1.3.6.1.2.1.43.10.2.1.4.1.3': Math.floor(Math.random() * 100) + 1, // Magenta toner
            '1.3.6.1.2.1.43.10.2.1.5.1.3': 100, // Max magenta toner
            '1.3.6.1.2.1.43.10.2.1.4.1.4': Math.floor(Math.random() * 100) + 1, // Yellow toner
            '1.3.6.1.2.1.43.10.2.1.5.1.4': 100, // Max yellow toner
            '1.3.6.1.2.1.25.3.5.1.1.1': Math.random() > 0.1 ? 1 : 0 // Printer status (1=online, 0=offline)
        };

        return responses[oid] || Math.floor(Math.random() * 100);
    }

    async snmpWalk(ip, community, baseOid) {
        try {
            // Simulate SNMP WALK request
            return await this.simulateSNMPWalkResponse(ip, baseOid);
        } catch (error) {
            console.error(`SNMP WALK failed for ${ip}: ${error.message}`);
            throw error;
        }
    }

    async simulateSNMPWalkResponse(ip, baseOid) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
        
        const results = [];
        const maxItems = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 1; i <= maxItems; i++) {
            results.push({
                oid: `${baseOid}.${i}`,
                value: Math.floor(Math.random() * 100) + 1
            });
        }
        
        return results;
    }

    // Printer Management
    async scanPrinter(printer) {
        const startTime = Date.now();
        
        try {
            this.logger.log('info', `Starting scan for printer: ${printer.name} (${printer.ip})`);
            
            const oids = this.oidConfigurations[printer.model].oids;
            const supplies = [];

            // Parallel SNMP requests for better performance
            const requests = [
                this.snmpGet(printer.ip, printer.community, oids.systemName),
                this.snmpGet(printer.ip, printer.community, oids.systemDescription),
                this.snmpGet(printer.ip, printer.community, oids.printerStatus),
                this.snmpGet(printer.ip, printer.community, oids.blackTonerLevel),
                this.snmpGet(printer.ip, printer.community, oids.blackTonerMaxLevel)
            ];

            const [systemName, systemDesc, status, blackLevel, blackMax] = await Promise.all(requests);
            
            const blackPercentage = Math.round((blackLevel / blackMax) * 100);
            supplies.push({
                name: 'Black Toner',
                level: blackLevel,
                maxLevel: blackMax,
                percentage: blackPercentage,
                status: this.getSupplyStatus(blackPercentage)
            });

            // Get color supplies if available
            try {
                const colorRequests = [
                    this.snmpGet(printer.ip, printer.community, oids.cyanTonerLevel),
                    this.snmpGet(printer.ip, printer.community, oids.cyanTonerMaxLevel),
                    this.snmpGet(printer.ip, printer.community, oids.magentaTonerLevel),
                    this.snmpGet(printer.ip, printer.community, oids.magentaTonerMaxLevel),
                    this.snmpGet(printer.ip, printer.community, oids.yellowTonerLevel),
                    this.snmpGet(printer.ip, printer.community, oids.yellowTonerMaxLevel)
                ];

                const [cyanLevel, cyanMax, magentaLevel, magentaMax, yellowLevel, yellowMax] = await Promise.all(colorRequests);

                supplies.push(
                    {
                        name: 'Cyan Toner',
                        level: cyanLevel,
                        maxLevel: cyanMax,
                        percentage: Math.round((cyanLevel / cyanMax) * 100),
                        status: this.getSupplyStatus(Math.round((cyanLevel / cyanMax) * 100))
                    },
                    {
                        name: 'Magenta Toner',
                        level: magentaLevel,
                        maxLevel: magentaMax,
                        percentage: Math.round((magentaLevel / magentaMax) * 100),
                        status: this.getSupplyStatus(Math.round((magentaLevel / magentaMax) * 100))
                    },
                    {
                        name: 'Yellow Toner',
                        level: yellowLevel,
                        maxLevel: yellowMax,
                        percentage: Math.round((yellowLevel / yellowMax) * 100),
                        status: this.getSupplyStatus(Math.round((yellowLevel / yellowMax) * 100))
                    }
                );
            } catch (error) {
                this.logger.log('warning', `Color toner not available for ${printer.name}: ${error.message}`);
            }

            // Update printer data
            printer.name = systemName || printer.name;
            printer.description = systemDesc;
            printer.status = status === 1 ? 'online' : 'offline';
            printer.supplies = supplies;
            printer.lastScan = new Date().toISOString();
            printer.isOnline = status === 1;
            printer.scanDuration = Date.now() - startTime;

            this.checkPrinterAlerts(printer);
            this.logger.log('info', `Scan completed for ${printer.name} in ${printer.scanDuration}ms`);

            return printer;
        } catch (error) {
            printer.status = 'offline';
            printer.isOnline = false;
            printer.lastScan = new Date().toISOString();
            printer.error = error.message;
            printer.scanDuration = Date.now() - startTime;
            
            this.logger.log('error', `Scan failed for ${printer.name}: ${error.message}`);
            this.addAlert('error', `Printer ${printer.name} (${printer.ip}) is offline`, error.message);
            return printer;
        }
    }

    async scanAllPrinters() {
        const scanBtn = document.getElementById('scanBtn');
        const originalText = scanBtn.innerHTML;
        
        scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
        scanBtn.disabled = true;

        try {
            this.logger.log('info', 'Starting full printer scan');
            const startTime = Date.now();

            const promises = this.printers.map(printer => this.scanPrinter(printer));
            await Promise.allSettled(promises);
            
            const scanDuration = Date.now() - startTime;
            this.logger.log('info', `Full scan completed in ${scanDuration}ms`);

            this.savePrinters();
            this.updateDashboard();
            this.updatePrinterList();
            this.updateAlerts();
            this.cleanupOldData();
            
            this.showNotification('success', 'Printer scan completed successfully');
        } catch (error) {
            this.logger.log('error', `Full scan failed: ${error.message}`);
            this.showNotification('error', 'Error during printer scan', error.message);
        } finally {
            scanBtn.innerHTML = originalText;
            scanBtn.disabled = false;
        }
    }

    // Alert System
    getSupplyStatus(percentage) {
        if (percentage <= this.settings.criticalThreshold) return 'critical';
        if (percentage <= this.settings.lowThreshold) return 'warning';
        return 'healthy';
    }

    checkPrinterAlerts(printer) {
        if (!printer.isOnline) {
            this.addAlert('error', `Printer ${printer.name} is offline`, `Printer at ${printer.ip} is not responding to SNMP requests`);
            return;
        }

        printer.supplies.forEach(supply => {
            if (supply.status === 'critical') {
                this.addAlert('critical', `Critical: ${supply.name} low on ${printer.name}`, 
                    `${supply.name} is at ${supply.percentage}% - Immediate attention required`);
            } else if (supply.status === 'warning') {
                this.addAlert('warning', `Warning: ${supply.name} running low on ${printer.name}`, 
                    `${supply.name} is at ${supply.percentage}% - Consider ordering replacement`);
            }
        });
    }

    // Production Alert System with Email/SMS
    async addAlert(type, title, message) {
        const alert = {
            id: Date.now() + Math.random(),
            type: type,
            title: title,
            message: message,
            timestamp: new Date().toISOString(),
            acknowledged: false,
            severity: this.getAlertSeverity(type)
        };

        this.alerts.unshift(alert);
        this.saveAlerts();
        this.updateAlertCount();
        this.updateAlerts();

        // Send notifications for critical alerts
        if (type === 'critical' && this.settings.enableNotifications) {
            await this.sendNotifications(alert);
        }

        this.logger.log('info', `Alert created: ${title}`);
    }

    async sendNotifications(alert) {
        try {
            if (this.settings.emailNotifications) {
                await this.sendEmailAlert(alert);
            }
            if (this.settings.smsNotifications) {
                await this.sendSMSAlert(alert);
            }
        } catch (error) {
            this.logger.log('error', `Failed to send notifications: ${error.message}`);
        }
    }

    async sendEmailAlert(alert) {
        const response = await fetch('/api/notifications/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.security.getToken()}`
            },
            body: JSON.stringify({
                to: this.settings.emailRecipients,
                subject: `[Printlert] ${alert.title}`,
                body: alert.message,
                severity: alert.severity
            })
        });

        if (!response.ok) {
            throw new Error('Email notification failed');
        }
    }

    async sendSMSAlert(alert) {
        const response = await fetch('/api/notifications/sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.security.getToken()}`
            },
            body: JSON.stringify({
                to: this.settings.smsRecipients,
                message: `${alert.title}: ${alert.message}`,
                severity: alert.severity
            })
        });

        if (!response.ok) {
            throw new Error('SMS notification failed');
        }
    }

    getAlertSeverity(type) {
        const severities = {
            'critical': 1,
            'warning': 2,
            'error': 1,
            'info': 3
        };
        return severities[type] || 3;
    }

    acknowledgeAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            this.saveAlerts();
            this.updateAlertCount();
            this.updateAlerts();
        }
    }

    clearAllAlerts() {
        this.alerts = [];
        this.saveAlerts();
        this.updateAlertCount();
        this.updateAlerts();
        this.showNotification('success', 'All alerts cleared');
    }

    // UI Updates
    updateDashboard() {
        const totalPrinters = this.printers.length;
        const onlinePrinters = this.printers.filter(p => p.isOnline).length;
        const offlinePrinters = totalPrinters - onlinePrinters;

        let lowSupplies = 0;
        let criticalSupplies = 0;
        let healthySupplies = 0;

        this.printers.forEach(printer => {
            if (printer.supplies) {
                printer.supplies.forEach(supply => {
                    switch (supply.status) {
                        case 'critical':
                            criticalSupplies++;
                            break;
                        case 'warning':
                            lowSupplies++;
                            break;
                        case 'healthy':
                            healthySupplies++;
                            break;
                    }
                });
            }
        });

        // Update stats
        document.getElementById('totalPrinters').textContent = totalPrinters;
        document.getElementById('lowSupplies').textContent = lowSupplies;
        document.getElementById('criticalSupplies').textContent = criticalSupplies;
        document.getElementById('healthySupplies').textContent = healthySupplies;

        // Update last updated time
        const lastUpdated = this.printers.length > 0 ? 
            new Date(Math.max(...this.printers.map(p => new Date(p.lastScan || 0)))).toLocaleString() : 
            'Never';
        document.getElementById('lastUpdated').textContent = lastUpdated;

        // Update printer grid
        this.updatePrinterGrid();
    }

    updatePrinterGrid() {
        const grid = document.getElementById('printerGrid');
        grid.innerHTML = '';

        this.printers.forEach(printer => {
            const card = this.createPrinterCard(printer);
            grid.appendChild(card);
        });
    }

    createPrinterCard(printer) {
        const card = document.createElement('div');
        card.className = `printer-card ${printer.isOnline ? 'healthy' : 'critical'}`;
        
        const suppliesHtml = printer.supplies ? printer.supplies.map(supply => `
            <div class="supply-item">
                <span class="supply-name">${supply.name}</span>
                <div class="supply-level">
                    <span class="supply-percentage">${supply.percentage}%</span>
                    <div class="supply-bar">
                        <div class="supply-fill ${supply.status}" style="width: ${supply.percentage}%"></div>
                    </div>
                </div>
            </div>
        `).join('') : '<p>No supply data available</p>';

        card.innerHTML = `
            <div class="printer-header">
                <span class="printer-name">${printer.name}</span>
                <span class="printer-status ${printer.isOnline ? 'online' : 'offline'}">
                    ${printer.isOnline ? 'Online' : 'Offline'}
                </span>
            </div>
            <div class="printer-ip">${printer.ip}</div>
            ${suppliesHtml}
        `;

        return card;
    }

    updatePrinterList() {
        const list = document.getElementById('printerList');
        list.innerHTML = '';

        this.printers.forEach(printer => {
            const item = document.createElement('div');
            item.className = 'printer-list-item';
            
            item.innerHTML = `
                <div class="printer-info">
                    <i class="fas fa-print"></i>
                    <div>
                        <strong>${printer.name}</strong>
                        <div>${printer.ip} - ${printer.model}</div>
                    </div>
                </div>
                <div class="printer-actions">
                    <button class="btn btn-primary" onclick="app.scanPrinter('${printer.id}')">
                        <i class="fas fa-sync-alt"></i> Scan
                    </button>
                    <button class="btn btn-danger" onclick="app.removePrinter('${printer.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    }

    updateAlerts() {
        const container = document.getElementById('alertsContainer');
        container.innerHTML = '';

        this.alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert-item ${alert.type}`;
            
            const icon = alert.type === 'critical' ? 'fas fa-exclamation-triangle' : 
                        alert.type === 'warning' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
            
            alertElement.innerHTML = `
                <div class="alert-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${new Date(alert.timestamp).toLocaleString()}</div>
                </div>
                <div class="alert-actions">
                    ${!alert.acknowledged ? 
                        `<button class="btn btn-secondary" onclick="app.acknowledgeAlert(${alert.id})">
                            <i class="fas fa-check"></i> Acknowledge
                        </button>` : ''
                    }
                </div>
            `;
            
            container.appendChild(alertElement);
        });
    }

    updateAlertCount() {
        const unacknowledgedCount = this.alerts.filter(a => !a.acknowledged).length;
        document.getElementById('alertCount').textContent = unacknowledgedCount;
    }

    updateOIDConfig() {
        const model = document.getElementById('printerModel').value;
        const config = this.oidConfigurations[model];
        const container = document.getElementById('oidConfig');
        
        container.innerHTML = `
            <h4>${config.name} OIDs</h4>
            <div class="form-group">
                <label>System Name OID</label>
                <input type="text" value="${config.oids.systemName}" readonly>
            </div>
            <div class="form-group">
                <label>Black Toner Level OID</label>
                <input type="text" value="${config.oids.blackTonerLevel}" readonly>
            </div>
            <div class="form-group">
                <label>Color Toner Level OIDs</label>
                <input type="text" value="${config.oids.cyanTonerLevel}" readonly>
            </div>
        `;
    }

    // Modal Management
    showAddPrinterModal() {
        document.getElementById('addPrinterModal').classList.add('active');
    }

    hideModal() {
        document.getElementById('addPrinterModal').classList.remove('active');
        // Clear form
        document.getElementById('printerName').value = '';
        document.getElementById('printerIP').value = '';
        document.getElementById('printerCommunity').value = 'public';
        document.getElementById('printerModelSelect').value = 'generic';
    }

    addPrinter() {
        const name = document.getElementById('printerName').value.trim();
        const ip = document.getElementById('printerIP').value.trim();
        const community = document.getElementById('printerCommunity').value.trim();
        const model = document.getElementById('printerModelSelect').value;

        if (!name || !ip) {
            this.showNotification('error', 'Please fill in all required fields');
            return;
        }

        // Validate IP address
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(ip)) {
            this.showNotification('error', 'Please enter a valid IP address');
            return;
        }

        const printer = {
            id: Date.now().toString(),
            name: name,
            ip: ip,
            community: community,
            model: model,
            status: 'unknown',
            isOnline: false,
            supplies: [],
            lastScan: null,
            createdAt: new Date().toISOString()
        };

        this.printers.push(printer);
        this.savePrinters();
        this.updateDashboard();
        this.updatePrinterList();
        this.hideModal();
        
        this.showNotification('success', `Printer ${name} added successfully`);
    }

    removePrinter(printerId) {
        if (confirm('Are you sure you want to remove this printer?')) {
            this.printers = this.printers.filter(p => p.id !== printerId);
            this.savePrinters();
            this.updateDashboard();
            this.updatePrinterList();
            this.showNotification('success', 'Printer removed successfully');
        }
    }

    // Settings Management
    saveSettings() {
        this.settings = {
            lowThreshold: parseInt(document.getElementById('lowThreshold').value),
            criticalThreshold: parseInt(document.getElementById('criticalThreshold').value),
            scanInterval: parseInt(document.getElementById('scanInterval').value),
            timeout: parseInt(document.getElementById('timeout').value),
            // Production settings
            enableNotifications: document.getElementById('enableNotifications').checked,
            emailNotifications: document.getElementById('emailNotifications').checked,
            smsNotifications: document.getElementById('smsNotifications').checked,
            emailRecipients: document.getElementById('emailRecipients').value,
            smsRecipients: document.getElementById('smsRecipients').value,
            retentionDays: parseInt(document.getElementById('retentionDays').value),
            maxAlerts: parseInt(document.getElementById('maxAlerts').value)
        };

        localStorage.setItem('printlert_settings', JSON.stringify(this.settings));
        this.startAutoScan();
        this.showNotification('success', 'Settings saved successfully');
    }

    loadSettings() {
        const saved = localStorage.getItem('printlert_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            // Update form values
            document.getElementById('lowThreshold').value = settings.lowThreshold || 20;
            document.getElementById('criticalThreshold').value = settings.criticalThreshold || 10;
            document.getElementById('scanInterval').value = settings.scanInterval || 300;
            document.getElementById('timeout').value = settings.timeout || 3000;
            
            // Production settings
            document.getElementById('enableNotifications').checked = settings.enableNotifications || false;
            document.getElementById('emailNotifications').checked = settings.emailNotifications || false;
            document.getElementById('smsNotifications').checked = settings.smsNotifications || false;
            document.getElementById('emailRecipients').value = settings.emailRecipients || '';
            document.getElementById('smsRecipients').value = settings.smsRecipients || '';
            document.getElementById('retentionDays').value = settings.retentionDays || 30;
            document.getElementById('maxAlerts').value = settings.maxAlerts || 1000;

            return settings;
        }
        return {
            lowThreshold: 20,
            criticalThreshold: 10,
            scanInterval: 300,
            timeout: 3000,
            enableNotifications: true,
            emailNotifications: false,
            smsNotifications: false,
            emailRecipients: '',
            smsRecipients: '',
            retentionDays: 30,
            maxAlerts: 1000
        };
    }

    // Auto-scan functionality
    startAutoScan() {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
        }

        if (this.settings.scanInterval > 0) {
            this.scanInterval = setInterval(() => {
                this.scanAllPrinters();
            }, this.settings.scanInterval * 1000);
        }
    }

    // Configuration Export/Import
    exportConfig() {
        const config = {
            printers: this.printers,
            settings: this.settings,
            oidConfigurations: this.oidConfigurations,
            alerts: this.alerts,
            performance: this.getPerformanceMetrics(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `printlert-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('success', 'Configuration exported successfully');
        this.logger.log('info', 'Configuration exported');
    }

    importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const config = JSON.parse(e.target.result);
                        if (config.printers) this.printers = config.printers;
                        if (config.settings) {
                            this.settings = config.settings;
                            this.loadSettings();
                        }
                        this.savePrinters();
                        this.updateDashboard();
                        this.updatePrinterList();
                        this.showNotification('success', 'Configuration imported successfully');
                    } catch (error) {
                        this.showNotification('error', 'Invalid configuration file');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Data Persistence
    savePrinters() {
        localStorage.setItem('printlert_printers', JSON.stringify(this.printers));
    }

    loadPrinters() {
        const saved = localStorage.getItem('printlert_printers');
        if (saved) {
            this.printers = JSON.parse(saved);
        }
    }

    saveAlerts() {
        localStorage.setItem('printlert_alerts', JSON.stringify(this.alerts));
    }

    loadAlerts() {
        const saved = localStorage.getItem('printlert_alerts');
        if (saved) {
            this.alerts = JSON.parse(saved);
        }
    }

    // Data Retention and Cleanup
    cleanupOldData() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.settings.retentionDays);

        // Clean up old alerts
        this.alerts = this.alerts.filter(alert => 
            new Date(alert.timestamp) > cutoffDate
        );

        // Limit alerts to maxAlerts
        if (this.alerts.length > this.settings.maxAlerts) {
            this.alerts = this.alerts.slice(0, this.settings.maxAlerts);
        }

        this.saveAlerts();
        this.logger.log('info', `Data cleanup completed. ${this.alerts.length} alerts retained.`);
    }

    // Performance Monitoring
    getPerformanceMetrics() {
        const metrics = {
            totalPrinters: this.printers.length,
            onlinePrinters: this.printers.filter(p => p.isOnline).length,
            averageScanTime: this.printers.reduce((sum, p) => sum + (p.scanDuration || 0), 0) / this.printers.length,
            totalAlerts: this.alerts.length,
            unacknowledgedAlerts: this.alerts.filter(a => !a.acknowledged).length,
            uptime: Date.now() - this.startTime
        };

        this.logger.log('info', 'Performance metrics collected', metrics);
        return metrics;
    }

    // Utility Functions
    showNotification(type, title, message = '') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <strong>${title}</strong>
            ${message ? `<br>${message}` : ''}
        `;

        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    refreshDashboard() {
        this.scanAllPrinters();
    }
}

// Logger Class for Production Logging
class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }

    log(level, message, data = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            data: data
        };

        this.logs.unshift(logEntry);
        
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }

        // Console logging for development
        if (window.location.hostname === 'localhost') {
            console.log(`[${level.toUpperCase()}] ${message}`, data || '');
        }

        // Send to server in production
        if (window.location.hostname !== 'localhost') {
            this.sendToServer(logEntry);
        }
    }

    async sendToServer(logEntry) {
        try {
            await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });
        } catch (error) {
            console.error('Failed to send log to server:', error);
        }
    }

    getLogs(level = null, limit = 100) {
        let filteredLogs = this.logs;
        if (level) {
            filteredLogs = this.logs.filter(log => log.level === level);
        }
        return filteredLogs.slice(0, limit);
    }
}

// Security Manager for Production Security
class SecurityManager {
    constructor() {
        this.token = localStorage.getItem('printlert_token');
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('printlert_token', token);
    }

    validateToken(token) {
        // Basic token validation - in production, validate with server
        return token && token.length > 20;
    }

    sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PrintlertApp();
});

// Add sample data for demonstration
if (!localStorage.getItem('printlert_printers')) {
    const samplePrinters = [
        {
            id: '1',
            name: 'HP LaserJet Pro',
            ip: '192.168.1.100',
            community: 'public',
            model: 'hp',
            status: 'online',
            isOnline: true,
            supplies: [
                { name: 'Black Toner', level: 85, maxLevel: 100, percentage: 85, status: 'healthy' },
                { name: 'Cyan Toner', level: 45, maxLevel: 100, percentage: 45, status: 'healthy' },
                { name: 'Magenta Toner', level: 15, maxLevel: 100, percentage: 15, status: 'warning' },
                { name: 'Yellow Toner', level: 8, maxLevel: 100, percentage: 8, status: 'critical' }
            ],
            lastScan: new Date().toISOString(),
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Canon ImageRunner',
            ip: '192.168.1.101',
            community: 'public',
            model: 'canon',
            status: 'online',
            isOnline: true,
            supplies: [
                { name: 'Black Toner', level: 92, maxLevel: 100, percentage: 92, status: 'healthy' },
                { name: 'Cyan Toner', level: 78, maxLevel: 100, percentage: 78, status: 'healthy' },
                { name: 'Magenta Toner', level: 65, maxLevel: 100, percentage: 65, status: 'healthy' },
                { name: 'Yellow Toner', level: 55, maxLevel: 100, percentage: 55, status: 'healthy' }
            ],
            lastScan: new Date().toISOString(),
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('printlert_printers', JSON.stringify(samplePrinters));
}
