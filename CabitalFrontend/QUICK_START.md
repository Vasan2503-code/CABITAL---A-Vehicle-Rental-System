# CABITAL Vehicle Rental System - Quick Start Checklist

## Pre-Flight Checks

- [ ] Java 17+ installed: `java -version`
- [ ] Maven 3.9+ installed: `mvn -version`
- [ ] MySQL 8.0+ installed and running
- [ ] MySQL credentials: username=`root`, password=`Shinu@2503`
- [ ] Database created: `CREATE DATABASE IF NOT EXISTS cabital;`

## Backend Setup

- [ ] Navigate to: `VEHICLE RENTAL SYSTEM\CabitalBackend\CabitalBackend`
- [ ] Verify `application.properties` has correct database credentials
- [ ] Run: `mvn clean package` (first time, takes 2-3 minutes)
- [ ] Run: `mvn spring-boot:run`
- [ ] ✅ Backend running on `http://localhost:8080`
- [ ] ✅ See "Started CabitalBackendApplication" in console
- [ ] ✅ Database tables auto-created
- [ ] ✅ Test vehicles seeded

## Frontend Setup

- [ ] Option A: Install VS Code "Live Server" extension
  - [ ] Right-click `home.html` → "Open with Live Server"
  - [ ] ✅ Frontend opens on `http://127.0.0.1:5500`

- OR Option B: Use Python
  - [ ] Run: `python -m http.server 5500`
  - [ ] Navigate to: `http://localhost:5500`

## Test the Complete Flow

### 1. Register & Login
- [ ] Go to `http://127.0.0.1:5500/login.html`
- [ ] Click "Signup"
- [ ] Fill in:
  - Name: `Test User`
  - Email: `test@example.com`
  - Password: `test123456`
- [ ] Click "Signup" button
- [ ] ✅ Redirects to booking page automatically

### 2. Search Vehicles
- [ ] On booking page (`http://127.0.0.1:5500/bookvehicle.html`)
- [ ] Vehicle Type: Select "Car"
- [ ] Vehicle Model: Should auto-fill (e.g., Maruti 800)
- [ ] Pickup Location: Enter "Chennai"
- [ ] Drop Location: Enter "Airport"
- [ ] Pickup Date: Select today or tomorrow (YYYY-MM-DD)
- [ ] Return Date: Select 1 day after pickup date
- [ ] Contact Name: Enter "Test User"
- [ ] Contact Phone: Enter "9876543210"
- [ ] Click "Check availability"
- [ ] ✅ Available vehicles list appears (should see 2-3 cars)

### 3. Book a Vehicle
- [ ] Click "Book Now" on any available vehicle
- [ ] ✅ Price panel appears showing:
  - Booking ID (e.g., #101)
  - Vehicle details (Maruti Dzire)
  - Pickup/drop locations
  - Dates
  - Total price (should be ₹1800 or more)
- [ ] Click "Proceed to Pay"
- [ ] ✅ Loading message appears
- [ ] ✅ QR code image loads and displays
- [ ] ✅ Message shows: "Booking successful! Please pay ₹XXXX using the QR code below."

### 4. Confirm Payment
- [ ] Click "Payment done? Confirm & continue"
- [ ] ✅ Redirects to booking success page
- [ ] ✅ Success page shows:
  - "All set! Your CABITAL booking is confirmed"
  - Booking ID and vehicle details
  - Status badge showing "CONFIRMED"
  - Message: "Payment received. Your vehicle is reserved."

### 5. Test Login After Logout
- [ ] Close browser or clear localStorage
- [ ] Go to `login.html`
- [ ] Click "Login"
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `test123456`
- [ ] Click "Login"
- [ ] ✅ Redirects to booking page

## Verify All Features

- [ ] Home page loads and displays correctly
- [ ] Navigation header with dropdowns works
- [ ] Booking form validation shows errors for empty fields
- [ ] Search results show available vehicles
- [ ] Price is calculated correctly
- [ ] QR code appears for payment
- [ ] Booking success page displays complete details
- [ ] Can book multiple vehicles

## Common Issues & Solutions

### Backend won't start
```
1. Check MySQL: mysql -u root -p (password: Shinu@2503)
2. Check Java: java -version (should be 17+)
3. Check Maven: mvn -version (should be 3.9+)
4. Delete target folder: rmdir /s /q target
5. Rebuild: mvn clean package
```

### Frontend can't reach backend
```
1. Verify backend is running on port 8080
2. Check browser console (F12) for CORS errors
3. Clear localStorage: localStorage.clear() in console
4. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

### Login fails
```
1. Make sure you registered first
2. Check email and password are exactly correct
3. Verify backend is running
4. Check browser console for error details
```

### QR code not showing
```
1. Ensure "Proceed to Pay" was clicked successfully
2. Check browser console for errors
3. Verify network tab shows successful payment API call
4. Make sure JWT token is valid
```

## Performance Notes

- First Maven build: 2-3 minutes (downloading dependencies)
- Subsequent builds: 30 seconds - 1 minute
- Database operations: Should be fast (<100ms)
- Frontend should load in <2 seconds

## File Locations

```
VEHICLE RENTAL SYSTEM/
├── SETUP_GUIDE.md          # Detailed documentation
├── START_BACKEND.bat       # Quick start script
├── home.html               # Landing page
├── bookvehicle.html        # Booking page
├── booking-success.html    # Confirmation page
├── login.html              # Auth page
├── script.js               # Main app logic
├── booking.css             # Styles
├── CabitalBackend/         # Backend source
│   └── CabitalBackend/
│       ├── pom.xml         # Maven config
│       ├── src/
│       └── target/         # Build output
└── images/                 # Assets
```

## Next Steps After Successful Test

1. **Change database password** in application.properties (for production)
2. **Update CORS origins** to match your deployment server
3. **Implement real payment gateway** (replace QR code generation)
4. **Add email notifications** for bookings
5. **Deploy backend** to cloud (AWS, Azure, etc.)
6. **Deploy frontend** to web server or CDN

---

**Total Setup Time**: 10-15 minutes (including Maven build)
**Total Test Time**: 5-10 minutes

Good luck! 🚀
