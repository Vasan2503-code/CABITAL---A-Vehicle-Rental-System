# CABITAL Vehicle Rental System - Complete Setup Guide

A full-stack vehicle rental platform with Spring Boot 3.1 backend (Java 17), JWT authentication, MySQL database, and a responsive HTML/CSS/JavaScript frontend.

## 📋 Overview

**CABITAL** allows users to:
1. Register and login with email/password
2. Search available vehicles by type, location, and dates
3. Book a vehicle and receive a booking confirmation with pricing
4. Generate a payment QR code for secure payment processing
5. View booking history and confirm payments

---

## 🔧 Prerequisites

- **Java 17+** (or later)
- **Maven 3.9+**
- **MySQL 8.0+** (running locally)
- **Web Server** (VS Code Live Server, Python's http.server, or any local server on port 5500+)

---

## 📦 Setup Instructions

### 1. Database Setup

Ensure MySQL is running and create the database:

```bash
# Start MySQL service (Windows)
net start MySQL80
# or (Mac/Linux)
brew services start mysql

# Connect to MySQL
mysql -u root -p
```

Inside MySQL prompt:
```sql
CREATE DATABASE IF NOT EXISTS cabital;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'Shinu@2503';
GRANT ALL PRIVILEGES ON cabital.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Backend Setup

#### Navigate to the backend directory:
```bash
cd "VEHICLE RENTAL SYSTEM\CabitalBackend\CabitalBackend"
```

#### Verify database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cabital
spring.datasource.username=root
spring.datasource.password=Shinu@2503
```

#### Build and run:
```bash
# Clean build
mvn clean package

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Expected output:**
```
Started CabitalBackendApplication in X.XXX seconds
Seeded vehicle: Car Maruti Dzire @Chennai
Seeded vehicle: Van Toyota Innova Crysta @Hyderabad
Seeded vehicle: Car Tata Nexon @Bangalore
... (more vehicles)
```

### 3. Frontend Setup

The frontend files are in the project root directory.

#### Option A: Using VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click on `home.html` → **Open with Live Server**
3. It will open on `http://127.0.0.1:5500`

#### Option B: Using Python's built-in server
```bash
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```
Then navigate to `http://localhost:5500`

---

## 🚀 Using the Application

### Complete User Journey

#### 1. **Landing Page** (`home.html`)
- View the CABITAL branding and vehicle categories
- See testimonials and company statistics
- Click "Book with confidence" or navigate to vehicle pages

#### 2. **Login/Registration** (`login.html`)
- **Register**: 
  - Enter name, email, and password
  - Click "Signup"
  - JWT token is automatically saved to localStorage
- **Login**: 
  - Enter email and password
  - Click "Login"
  - Token is automatically saved to localStorage

#### 3. **Booking Page** (`bookvehicle.html`)
- **Fill Booking Form**:
  - Vehicle Type: Select Car, Van, Bikes, or Commercial vehicles
  - Vehicle Model: Auto-populated based on type selection
  - Pickup Location: Enter city/location name
  - Drop Location: Enter city/location name
  - Pickup Date: Select date (YYYY-MM-DD format)
  - Pickup Time: Select time (default: 07:00)
  - Return Date: Select date (must be after pickup date)
  - Return Time: Select time (default: 10:00)
  - Contact Name: Enter your full name
  - Contact Phone: Enter 10-digit phone number

- **Search Availability**:
  - Click "Check availability" button
  - The system searches for vehicles matching your criteria
  - Available vehicles appear in the "Available vehicles" section

#### 4. **Select and Book Vehicle**
- Click "Book Now" on any available vehicle
- Pricing summary appears showing:
  - Booking ID
  - Vehicle details (make, model)
  - Pickup and drop locations
  - Start and end dates/times
  - Total price for rental period

#### 5. **Payment Process**
- Click "Proceed to Pay"
- A QR code is generated for payment
- Message displays: "Booking successful! Please pay ₹[amount] using the QR code below."
- Scan the QR code with UPI/payment app
- After payment, click "Payment done? Confirm & continue"

#### 6. **Booking Confirmation** (`booking-success.html`)
- View complete booking details:
  - Booking ID
  - Vehicle information (make, model, type)
  - Pickup and drop locations
  - Rental period (start and end dates)
  - Total amount paid
  - Payment reference
  - Booking status (CONFIRMED)
- Option to "Book another ride"

---

## 📡 API Endpoints Reference

### Authentication (Public - No JWT Required)

#### Register
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Vehicles (Public - No JWT Required)

#### Search Available Vehicles
```
GET /api/vehicles/search?type=Car&startDate=2025-12-11&startTime=07:00&endDate=2025-12-12&endTime=10:00&location=Chennai

Query Parameters:
- type: Car|Van|Bikes|carrier vehicles (optional)
- startDate: YYYY-MM-DD (required)
- startTime: HH:MM (required)
- endDate: YYYY-MM-DD (required)
- endTime: HH:MM (required)
- location: City name (optional)

Response:
[
  {
    "id": 1,
    "make": "Maruti",
    "model": "Dzire",
    "type": "Car",
    "basePricePerDay": 1800.0,
    "thumbnailUrl": "...",
    "location": "Chennai"
  },
  ...
]
```

### Bookings (Protected - Requires JWT)

#### Create Booking
```
POST /api/bookings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "vehicleId": 1,
  "pickupLocation": "Chennai",
  "dropLocation": "Airport",
  "startDateTime": "2025-12-11T07:00:00",
  "endDateTime": "2025-12-12T10:00:00",
  "contactName": "John Doe",
  "contactPhone": "9876543210"
}

Response:
{
  "id": 101,
  "vehicleMake": "Maruti",
  "vehicleModel": "Dzire",
  "vehicleType": "Car",
  "pickupLocation": "Chennai",
  "dropLocation": "Airport",
  "startDateTime": "2025-12-11T07:00:00",
  "endDateTime": "2025-12-12T10:00:00",
  "totalPrice": 1800.0,
  "status": "PENDING_PAYMENT",
  "paymentReference": null
}
```

#### Get Booking Details
```
GET /api/bookings/{bookingId}
Authorization: Bearer <JWT_TOKEN>

Response: Same as Create Booking response
```

#### Confirm Payment
```
POST /api/bookings/{bookingId}/confirm-payment
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "paymentReference": "QR-1733918400000"
}

Response: Updated booking with status="CONFIRMED"
```

### Payments (Protected - Requires JWT)

#### Generate Payment QR Code
```
POST /api/payments/qr
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "bookingId": 101,
  "amount": 1800.0
}

Response:
{
  "paymentPayload": "upi://pay?pa=cabital@upi&pn=CABITAL&am=1800.00&cu=INR&tn=Cabital booking 101",
  "qrBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
}
```

---

## 🔐 Security Features

- **JWT Authentication**: All booking endpoints require valid JWT token
- **Password Hashing**: Passwords are hashed with BCrypt
- **CORS Configuration**: Frontend on `http://localhost:5500` can communicate with backend
- **Session Management**: Tokens stored in localStorage, sent as `Authorization: Bearer <token>`
- **Input Validation**: All endpoints validate request data
- **Automatic Authorization**: Token automatically sent with all protected requests

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(100),
    model VARCHAR(100),
    type VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    base_price_per_day DOUBLE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    thumbnail_url VARCHAR(500),
    location VARCHAR(100)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255) NOT NULL,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    total_price DOUBLE,
    status VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(255),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
```

---

## 🧪 Testing Checklist

- [ ] Backend starts on port 8080
- [ ] Frontend loads on port 5500
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] Can search vehicles with valid dates
- [ ] Can book available vehicle
- [ ] Price is calculated correctly (ceil(days) * basePricePerDay)
- [ ] Can proceed to payment and see QR code
- [ ] Can confirm payment
- [ ] Redirects to booking success page
- [ ] Can view booking details on success page
- [ ] Status shows "CONFIRMED" after payment
- [ ] Can book another vehicle from success page

---

## 🐛 Troubleshooting

### Backend Issues

#### "Port 8080 is already in use"
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use a different port in application.properties
server.port=8081
```

#### "Connection refused" to database
```bash
# Check if MySQL is running
mysql -u root -p
# If not, start it:
net start MySQL80  # Windows
brew services start mysql  # Mac
sudo systemctl start mysql  # Linux
```

#### "User not found" or "Access denied"
- Verify username/password in application.properties
- Check user exists: `SELECT * FROM mysql.user WHERE User='root';`
- Grant permissions: `GRANT ALL PRIVILEGES ON cabital.* TO 'root'@'localhost';`

### Frontend Issues

#### "Failed to fetch" or CORS errors
- Ensure backend is running on `http://localhost:8080`
- Check CORS origins in `application.properties`
- Look at browser console (F12) for detailed error messages

#### "Login required" keeps appearing
- Clear localStorage: Open DevTools → Console → `localStorage.clear()`
- Try registering a new account
- Check network tab to see if login API call succeeds

#### Blank page when accessing `bookvehicle.html`
- Check browser console for JavaScript errors
- Ensure script.js is loaded correctly
- Verify API_BASE in script.js matches backend URL

### Database Issues

#### "Unknown database 'cabital'"
```sql
CREATE DATABASE cabital;
```

#### Tables don't exist after running backend
- Check `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Tables should auto-create on first run
- If not, check backend logs for errors

---

## 📝 Sample Test Data

The application auto-seeds the following vehicles at startup:

| ID | Make | Model | Type | Price/Day | Location |
|----|------|-------|------|-----------|----------|
| 1 | Maruti | Dzire | Car | ₹1800 | Chennai |
| 2 | Tata | Nexon | Car | ₹2200 | Bangalore |
| 3 | Toyota | Innova Crysta | Van | ₹3200 | Hyderabad |
| 4 | Royal Enfield | Classic 350 | Bikes | ₹900 | Chennai |
| 5 | Tata | Ace Gold | Carrier | ₹1500 | Chennai |
| 6 | Kia | Seltos | Car | ₹2400 | Chennai |

### Sample Test Credentials
- Email: `test@example.com`
- Password: `test123456` (register via UI first)

---

## 🎨 Frontend File Structure

```
VEHICLE RENTAL SYSTEM/
├── home.html                    # Landing page
├── bookvehicle.html            # Main booking interface
├── booking-success.html        # Confirmation page
├── login.html                  # Login/Registration
├── cars.html                   # Car listings
├── bikes.html                  # Bike listings
├── commercialvehicles.html     # Commercial vehicle listings
├── booking.css                 # Booking page styles
├── style.css                   # General styles
├── style1.css                  # Additional styles
├── script.js                   # Main application logic
├── images/                     # Images and assets
│   └── bg_imgcar.png          # Background image
└── README.md                   # This file
```

---

## 🚀 Key Features Implemented

### Frontend
- ✅ Responsive HTML/CSS design
- ✅ Vehicle search and filtering
- ✅ Dynamic vehicle model selection
- ✅ Form validation
- ✅ JWT token management
- ✅ Real-time price calculation
- ✅ QR code display for payment
- ✅ Booking confirmation page

### Backend
- ✅ Spring Boot 3.1 REST API
- ✅ JWT authentication
- ✅ MySQL database with JPA
- ✅ Vehicle search with availability checks
- ✅ Booking creation and management
- ✅ Payment QR code generation (ZXing)
- ✅ Price calculation
- ✅ CORS configuration
- ✅ Data seeding for test vehicles
- ✅ Comprehensive error handling

---

## 📄 API Response Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid input or validation failed
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Backend error

---

## 🔄 Data Flow Diagram

```
User
  ├── Register/Login → Auth API → JWT Token → LocalStorage
  ├── Search Vehicles → Vehicle Search API → Available Vehicles
  ├── Book Vehicle → Booking API → Booking Confirmation
  ├── Generate QR → Payment API → QR Code Image
  ├── Confirm Payment → Payment Confirm API → Booking Status Updated
  └── View Booking → Booking Details API → Success Page
```

---

## 📞 Support

If you encounter any issues:
1. Check the Troubleshooting section above
2. Review backend logs for errors
3. Check browser console (F12) for frontend errors
4. Verify all services are running (MySQL, Backend, Frontend server)
5. Check network tab in DevTools to see API responses

---

## 📄 License

This project is open source and available under the MIT License.
