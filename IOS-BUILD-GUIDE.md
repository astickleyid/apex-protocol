# iOS App Build Guide - Apex Protocol

## ✅ Setup Complete

Your Apex Protocol has been packaged as an iOS app using Capacitor!

### What's Been Done:
1. ✅ Icon cropped (white border removed)
2. ✅ iOS platform added with Capacitor
3. ✅ Xcode project created
4. ✅ App configured to connect to local server

## 📱 How to Build & Run

### Option 1: Xcode (Already Opened)
The Xcode project is now open. To run on simulator or device:

1. **Select Target Device:**
   - Click device dropdown in Xcode toolbar
   - Choose iPhone simulator (e.g., "iPhone 15 Pro")
   - Or connect physical iPhone and select it

2. **Run the App:**
   - Press ▶️ (Play) button in Xcode
   - Or press `Cmd + R`

3. **Important:** Make sure your backend server is running first!
   ```bash
   cd /Users/austinstickley/apex-protocol
   npm run dev
   ```

### Option 2: Command Line
```bash
# Make sure you're in the project directory
cd /Users/austinstickley/apex-protocol

# Rebuild web assets if you made changes
npm run build

# Sync changes to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

## 🔧 Configuration

**Server Connection:**
- The app is configured to connect to `http://localhost:3001`
- This works in simulator but NOT on physical device
- For physical device testing, see below

### For Physical iPhone Testing:

1. Find your Mac's IP address:
   ```bash
   ipconfig getifaddr en0
   ```

2. Update `capacitor.config.json`:
   ```json
   "server": {
     "url": "http://YOUR_MAC_IP:3001",
     "cleartext": true
   }
   ```

3. Run server:
   ```bash
   npm run dev
   ```

4. Resync and rebuild:
   ```bash
   npx cap sync ios
   ```

## 📝 Build for Distribution

### TestFlight / App Store:

1. **In Xcode:**
   - Select `Product` → `Archive`
   - Once archived, click `Distribute App`
   - Choose `App Store Connect`
   - Follow prompts to upload

2. **Requirements:**
   - Apple Developer account ($99/year)
   - Signing certificates set up
   - App Store Connect configured

## 🎨 Icon

- Icon located at: `/Users/austinstickley/apex-protocol/apex-icon.png`
- Already configured in iOS app
- Original (with white border): `/Users/austinstickley/Desktop/unnamed.jpg`
- Cropped version: `/Users/austinstickley/Desktop/apex-icon.png`

## 🔄 Making Changes

After modifying web code:
```bash
npm run build
npx cap sync ios
```

Then rebuild in Xcode.

## 📂 Project Structure

```
apex-protocol/
├── ios/                    # iOS native project
│   └── App/
│       └── App.xcodeproj   # Xcode project
├── dist/                   # Built web assets
├── client/                 # Source web code
└── capacitor.config.json   # Capacitor configuration
```

## 🚀 Current Status

- ✅ App configured
- ✅ Icon set
- ✅ Xcode project ready
- ✅ Backend server functional
- 🔄 Xcode is now open - ready to run!

## Next Steps:

1. In Xcode, select a simulator
2. Click Run (▶️)
3. App will launch and connect to your local server
4. Generate amazing startup ideas on iOS!

---

**Repository:** https://github.com/astickleyid/apex-protocol
**Version:** 5.1.0
