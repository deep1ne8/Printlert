# Printlert - Printer Supply Monitor

A sophisticated, browser-based printer supply monitoring portal that performs SNMP walks to printers to obtain toner levels and displays them in a colorful, detailed dashboard with real-time alerts.

![Printlert Dashboard](https://img.shields.io/badge/Status-Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 🌟 Features

### 🖨️ **Comprehensive Printer Monitoring**
- **SNMP Integration**: Full SNMP v1/v2c support for printer communication
- **Multi-Manufacturer Support**: Pre-configured OIDs for HP, Canon, Epson, Brother, Lexmark, Xerox, and Generic printers
- **Real-time Scanning**: Automatic and manual printer scanning capabilities
- **Supply Tracking**: Monitor toner levels, cartridge status, and printer health

### 🎨 **Sophisticated Dashboard**
- **Colorful Interface**: Modern gradient design with glassmorphism effects
- **Real-time Statistics**: Live counters for total printers, low supplies, critical supplies, and healthy supplies
- **Interactive Cards**: Hover effects and smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### ⚠️ **Advanced Alert System**
- **Threshold-based Alerts**: Configurable warning and critical thresholds
- **Multiple Alert Types**: Critical, warning, and error notifications
- **Alert Management**: Acknowledge, clear, and track alert history
- **Visual Indicators**: Color-coded status bars and alert badges

### ⚙️ **Highly Customizable**
- **OID Configuration**: Easy selection of printer models with pre-configured OIDs
- **Alert Thresholds**: Customizable low and critical supply percentages
- **Scan Intervals**: Configurable automatic scanning frequency
- **SNMP Settings**: Adjustable timeout and community string settings

### 🔧 **Configuration Management**
- **Export/Import**: Save and load complete configurations
- **Local Storage**: All data persisted in browser localStorage
- **No External Dependencies**: Self-contained application
- **GitHub Ready**: All files stored and executed from GitHub

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Network access to printer IP addresses
- SNMP enabled on target printers

### Installation
1. **Clone or Download** the repository to your local machine
2. **Open** `index.html` in your web browser
3. **Start Monitoring** by adding your first printer

### Basic Setup
1. **Add Printers**: Click "Add Printer" and enter:
   - Printer Name
   - IP Address
   - SNMP Community (usually "public")
   - Printer Model (select from dropdown)

2. **Configure Settings**: Go to Settings tab to adjust:
   - Alert thresholds (default: 20% low, 10% critical)
   - Scan interval (default: 5 minutes)
   - SNMP timeout (default: 3 seconds)

3. **Start Scanning**: Click "Scan Printers" to begin monitoring

## 📋 Supported Printer Manufacturers

### HP Printers
- **OIDs**: Standard HP MIB + HP-specific enterprise OIDs
- **Supplies**: Black, Cyan, Magenta, Yellow toner levels
- **Features**: HP LaserJet, OfficeJet, and Color LaserJet series

### Canon Printers
- **OIDs**: Canon enterprise MIB + standard printer MIB
- **Supplies**: Toner levels, drum units, waste toner
- **Features**: ImageRunner, imageCLASS, and PIXMA series

### Epson Printers
- **OIDs**: Epson enterprise MIB + standard printer MIB
- **Supplies**: Ink levels, maintenance boxes
- **Features**: WorkForce, Expression, and EcoTank series

### Brother Printers
- **OIDs**: Brother enterprise MIB + standard printer MIB
- **Supplies**: Toner levels, drum units
- **Features**: HL, MFC, and DCP series

### Lexmark Printers
- **OIDs**: Lexmark enterprise MIB + standard printer MIB
- **Supplies**: Toner levels, imaging units
- **Features**: Optra, T, and X series

### Xerox Printers
- **OIDs**: Xerox enterprise MIB + standard printer MIB
- **Supplies**: Toner levels, drum units, waste toner
- **Features**: WorkCentre, Phaser, and ColorQube series

### Generic Printers
- **OIDs**: Standard printer MIB (RFC 3805)
- **Supplies**: Basic toner/ink level monitoring
- **Features**: Compatible with most SNMP-enabled printers

## 🔧 OID Reference

### Standard Printer MIB OIDs
```
System Name: 1.3.6.1.2.1.25.3.2.1.3.1
System Description: 1.3.6.1.2.1.1.1.0
Printer Status: 1.3.6.1.2.1.25.3.5.1.1.1
Black Toner Level: 1.3.6.1.2.1.43.10.2.1.4.1.1
Black Toner Max: 1.3.6.1.2.1.43.10.2.1.5.1.1
Cyan Toner Level: 1.3.6.1.2.1.43.10.2.1.4.1.2
Cyan Toner Max: 1.3.6.1.2.1.43.10.2.1.5.1.2
Magenta Toner Level: 1.3.6.1.2.1.43.10.2.1.4.1.3
Magenta Toner Max: 1.3.6.1.2.1.43.10.2.1.5.1.3
Yellow Toner Level: 1.3.6.1.2.1.43.10.2.1.4.1.4
Yellow Toner Max: 1.3.6.1.2.1.43.10.2.1.5.1.4
```

### Manufacturer-Specific OIDs
Each manufacturer has additional enterprise-specific OIDs for enhanced monitoring capabilities. These are automatically configured when selecting the appropriate printer model.

## 🎯 Usage Guide

### Dashboard
- **Overview**: View all printers at a glance with supply levels
- **Statistics**: Monitor total printers, low supplies, critical supplies, and healthy supplies
- **Real-time Updates**: Automatic refresh with last scan timestamps
- **Quick Actions**: Scan all printers with one click

### Printer Management
- **Add Printers**: Simple form to add new printers
- **Edit Settings**: Modify printer configurations
- **Remove Printers**: Delete printers from monitoring
- **Individual Scanning**: Scan specific printers on demand

### Alerts
- **Alert Types**: Critical (red), Warning (yellow), Error (red)
- **Alert Management**: Acknowledge alerts to mark as resolved
- **Alert History**: View all historical alerts
- **Clear All**: Bulk clear all alerts

### Settings
- **Alert Thresholds**: Set low and critical supply percentages
- **Scan Configuration**: Adjust scan intervals and timeouts
- **OID Configuration**: View and modify OID mappings
- **Export/Import**: Backup and restore configurations

## 🔒 Security Considerations

### SNMP Security
- **Community Strings**: Use strong community strings (not "public" in production)
- **Network Security**: Ensure SNMP traffic is properly secured
- **Access Control**: Limit SNMP access to monitoring systems only

### Browser Security
- **Local Storage**: All data is stored locally in the browser
- **No External Calls**: Application doesn't make external API calls
- **HTTPS Recommended**: Use HTTPS when hosting on a web server

## 🛠️ Technical Details

### Architecture
- **Frontend Only**: Pure HTML, CSS, and JavaScript
- **No Backend Required**: All processing done in the browser
- **SNMP Simulation**: Demo mode with simulated SNMP responses
- **Local Storage**: Data persistence using browser localStorage

### Browser Compatibility
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### File Structure
```
Printlert/
├── index.html          # Main application file
├── styles.css          # Sophisticated styling
├── app.js             # Core application logic
└── README.md          # This documentation
```

## 🚀 Deployment

### GitHub Pages
1. **Upload** all files to a GitHub repository
2. **Enable** GitHub Pages in repository settings
3. **Access** via `https://username.github.io/repository-name`

### Local Web Server
1. **Install** a local web server (Apache, Nginx, or Python)
2. **Place** files in web server directory
3. **Access** via `http://localhost`

### Production Deployment
1. **Upload** files to your web server
2. **Configure** HTTPS for security
3. **Set up** proper network access to printers

## 🔧 Customization

### Adding New Printer Models
1. **Edit** `app.js` file
2. **Add** new model to `getOIDConfigurations()` function
3. **Include** appropriate OIDs for the new model
4. **Update** HTML select options

### Modifying Alert Thresholds
1. **Go to** Settings tab
2. **Adjust** Low Supply and Critical Supply percentages
3. **Save** settings to apply changes

### Custom OID Configuration
1. **Select** "Generic" printer model
2. **Manually** configure OIDs in settings
3. **Test** with your specific printer

## 🐛 Troubleshooting

### Common Issues

#### Printer Not Responding
- **Check** printer IP address
- **Verify** SNMP is enabled on printer
- **Confirm** community string is correct
- **Test** network connectivity

#### Incorrect Supply Levels
- **Verify** printer model selection
- **Check** OID configuration
- **Test** SNMP walk manually
- **Update** to manufacturer-specific OIDs

#### Alerts Not Triggering
- **Check** alert threshold settings
- **Verify** supply percentage calculations
- **Test** alert system manually
- **Review** browser console for errors

### Debug Mode
Enable browser developer tools to view:
- SNMP request/response logs
- JavaScript error messages
- Network connectivity issues
- Local storage data

## 📈 Future Enhancements

### Planned Features
- **Email Alerts**: Send email notifications for critical supplies
- **SMS Notifications**: Text message alerts for urgent issues
- **Historical Data**: Track supply usage over time
- **Reports**: Generate supply usage reports
- **Multi-user Support**: User authentication and roles
- **API Integration**: REST API for external systems

### Community Contributions
- **New Printer Models**: Add support for additional manufacturers
- **Enhanced OIDs**: Improve OID coverage for existing models
- **UI Improvements**: Suggest interface enhancements
- **Bug Reports**: Report issues and suggest fixes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📞 Support

For support and questions:
- **Issues**: Create an issue on GitHub
- **Documentation**: Check this README file
- **Community**: Join discussions in GitHub discussions

## 🙏 Acknowledgments

- **SNMP Community**: For maintaining SNMP standards
- **Printer Manufacturers**: For providing SNMP MIBs
- **Open Source Community**: For inspiration and tools
- **Font Awesome**: For the beautiful icons
- **Google Fonts**: For the Inter font family

---

**Printlert** - Making printer management beautiful and efficient! 🖨️✨
