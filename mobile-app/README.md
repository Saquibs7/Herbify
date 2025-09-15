# Herbify

## Project Structure

- **src/assets/** – App images, icons, and other media assets.
- **src/screens/** – React Native screens for key actors:
  - `LoginScreen.js` — Role-based secure login with OTP.
  - `FarmerDashboard.js` — Harvest data entry and quality checks.
  - `TransporterDashboard.js` — Shipment scanning and condition tracking.
  - `LabDashboard.js` — Quality test reports and batch verification.
  - `ConsumerDashboard.js` — Product scan & verification view.
  - `ProcessorDashboard.js` — Batch processing logs, smart contract validations, and live processing stages.
  - `RetailerDashboard.js` — Generate Serialized Tgs and Link Packaging.
  - `SplashScreen.js` — Initial loading screen.
  - `ScanScreen.js`— Requests to access camera and scan QR.
- **src/services/AppNavigator.js** — Stack navigator defining screen flow.

## Current Features

- Role selection and OTP-based login.
- Dashboard views tailored for Farmers, Transporters, Labs, and Consumers.
- Scan handlers for pickup and drop-off with success/error alerts.
- Batch quality reports and blockchain validation placeholders.
- Active batch progress tracking and detailed process timelines in Processor Dashboard
- Offline-ready UI and placeholder images supporting future GPS tracking.
