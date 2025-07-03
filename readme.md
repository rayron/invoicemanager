# Invoice Manager App - Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For mobile testing: Expo Go app on your device

## Setup Steps

1. **Create a new Expo project:**

   ```bash
   npx create-expo-app InvoiceManager --template blank-typescript
   cd InvoiceManager
   ```

2. **Install dependencies:**

   ```bash
   npm install expo-mail-composer expo-print expo-sharing expo-font
   ```

3. **Replace the default App.tsx with the provided code**

4. **Update package.json with the provided configuration**

5. **Create app.json configuration:**

   ```json
   {
     "expo": {
       "name": "Invoice Manager",
       "slug": "invoice-manager",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "userInterfaceStyle": "light",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#2196F3"
       },
       "assetBundlePatterns": ["**/*"],
       "ios": {
         "supportsTablet": true
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#2196F3"
         }
       },
       "web": {
         "favicon": "./assets/favicon.png",
         "bundler": "metro"
       },
       "plugins": ["expo-mail-composer"]
     }
   }
   ```

6. **Start the development server:**
   ```bash
   npm start
   ```

## Features Included

### ✅ Client Management

- Add, edit, and delete clients
- Store client information (name, email, company, address, phone)
- Client list view with search capabilities

### ✅ Invoice Creation & Management

- Create detailed invoices with multiple line items
- Automatic calculations (subtotal, tax, total)
- Invoice status tracking (draft, sent, paid, overdue)
- Edit and delete invoices
- Generate invoice numbers automatically

### ✅ Email Integration

- Send invoices via email (uses device's email app)
- Professional invoice formatting
- Client email integration

### ✅ Payment Tracking

- Record payments against invoices
- Multiple payment methods support
- Automatic invoice status updates when fully paid
- Payment history and reporting

### ✅ Dashboard Analytics

- Revenue overview
- Payment status tracking
- Recent invoices display
- Key performance metrics

### ✅ Cross-Platform Support

- Works on iOS, Android, and Web
- Responsive design for different screen sizes
- Native platform integrations

## Usage Guide

### Adding Clients

1. Navigate to the "Clients" tab
2. Tap "Add Client"
3. Fill in the client information
4. Save the client

### Creating Invoices

1. Go to the "Invoices" tab
2. Tap "Create Invoice"
3. Select a client
4. Add invoice items with descriptions, quantities, and rates
5. Review totals and add notes if needed
6. Save as draft or send immediately

### Sending Invoices

1. Find the invoice in the invoices list
2. Tap "Send" button
3. The device's email app will open with the invoice details
4. Send the email to the client

### Recording Payments

1. Find a sent invoice
2. Tap "Add Payment"
3. Enter payment details
4. The invoice status will automatically update

## Customization Options

### Business Information

Update the company details in the invoice template by modifying the invoice generation function.

### Tax Rates

Modify the tax calculation in the `InvoiceModal` component (currently set to 10%).

### Invoice Numbering

Customize the invoice number format in the `InvoiceModal` component.

### Styling

All styles are defined in the `styles` object at the bottom of App.tsx. Modify colors, fonts, and layouts as needed.

## Future Enhancements

### Planned Features

- [ ] PDF invoice generation
- [ ] Cloud storage integration
- [ ] Recurring invoices
- [ ] Multi-currency support
- [ ] Advanced reporting and analytics
- [ ] Client portal access
- [ ] Integration with payment processors
- [ ] Expense tracking
- [ ] Time tracking integration
- [ ] Invoice templates

### Technical Improvements

- [ ] Data persistence with SQLite
- [ ] Offline support
- [ ] Data backup and sync
- [ ] Advanced search and filtering
- [ ] Performance optimizations

## Troubleshooting

### Common Issues

**Email not working on device:**

- Ensure your device has a configured email account
- For iOS: Check that Mail app is set up
- For Android: Ensure you have a default email app

**App not starting:**

- Clear Expo cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Styling issues on web:**

- Web styling may differ slightly from mobile
- Consider using `Platform.select()` for platform-specific styles

### Performance Tips

- The app stores data in memory, so it will reset when closed
- For production use, implement persistent storage
- Consider pagination for large lists of invoices/clients

## Development Notes

This app is built with:

- **Expo SDK 51** for cross-platform development
- **TypeScript** for type safety
- **React Native** for native mobile experience
- **React Native Web** for web compatibility

The app uses local state management with React hooks. For production applications, consider implementing:

- Redux or Zustand for state management
- AsyncStorage or SQLite for data persistence
- Authentication and user management
- Cloud backup and synchronization
