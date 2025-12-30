# CABITAL Vehicle Rental System

Full-stack vehicle rental for **CABITAL** with Spring Boot 3.1 (Java 17), JWT security, MySQL, and a matching frontend booking flow.

## Backend (CabitalBackend)
Location: `CabitalBackend/CabitalBackend`

### Requirements
- Java 17
- Maven 3.9+
- MySQL running with a database named `cabital`

### Configure
Update `src/main/resources/application.properties`:
```
spring.datasource.url=jdbc:mysql://localhost:3306/cabital?createDatabaseIfNotExist=true
spring.datasource.username=<your-mysql-user>
spring.datasource.password=<your-mysql-password>
```
The app uses `spring.jpa.hibernate.ddl-auto=update` so tables auto-create. JWT secret and CORS pattern are also set there.

### Run
```
cd CabitalBackend/CabitalBackend
mvn spring-boot:run
```
Backend listens on `http://localhost:8080`.

### Security & Auth
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
  - Response includes `token` (JWT). Send as `Authorization: Bearer <token>` for protected endpoints.

### Booking & Payment APIs
- Search vehicles (public): `GET /api/vehicles/search?type=Car&startDate=2025-12-11&startTime=07:00&endDate=2025-12-12&endTime=07:00&location=Chennai`
- Create booking (JWT): `POST /api/bookings`
- Get booking (JWT): `GET /api/bookings/{id}`
- Confirm payment (JWT): `POST /api/bookings/{id}/confirm-payment`
- Generate payment QR (JWT): `POST /api/payments/qr`

Business rules:
- Price = `ceil(hoursBetween(start,end)/24) * basePricePerDay`, minimum 1 day.
- Overlapping confirmed bookings are rejected.
- Status flow: `PENDING_PAYMENT` → `CONFIRMED` after confirm-payment.

Sample seed vehicles load at startup if the table is empty.

## Frontend
Key files in project root:
- `home.html` (landing)
- `bookvehicle.html` (new booking page)
- `booking-success.html`
- `cars.html`, `bikes.html`, `commercialvehicles.html`
- `style.css`, `booking.css`, `script.js`

Open `home.html` or `bookvehicle.html` in a browser. The frontend expects the backend at `http://localhost:8080` (configured in `script.js` as `API_BASE`).

### Booking flows
1. **Home booking box** → click “Find a Vehicle” → redirects with pre-filled params to `bookvehicle.html`.
2. **Direct Book Vehicle page** → edit details, search availability, book, pay via QR, confirm.
3. **Vehicle list pages** (`cars.html`, `bikes.html`, `commercialvehicles.html`) → “Book Now” redirects to `bookvehicle.html` with the chosen model/type.

### Payment UI
- After “Book Now” on results, price is shown with “Proceed to Pay”.
- “Proceed to Pay” calls `/api/payments/qr` and shows a QR with the message  
  `Booking successful! Please pay ₹<amount> using the QR code below.`
- After confirming payment, redirects to `booking-success.html` showing booking ID, vehicle details, pickup/drop, dates, total price, and payment status.

### Authentication handling
- Protected calls automatically show “Login required to continue booking” and redirect to `login.html` if no JWT is present.
- Store the JWT from login in `localStorage` under `cabital_jwt` (handled in `script.js` when you wire your login form).

## Testing the APIs quickly
Use curl or Postman:
```
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# Search
curl "http://localhost:8080/api/vehicles/search?type=Car&startDate=2025-12-11&startTime=07:00&endDate=2025-12-12&endTime=07:00"

# Book (replace TOKEN)
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"vehicleId":1,"pickupLocation":"Chennai","dropLocation":"Airport","startDateTime":"2025-12-11T07:00:00","endDateTime":"2025-12-12T07:00:00","contactName":"vasan","contactPhone":"9876543210"}'
```

## Notes
- Color palette and layout on new pages match `home.html` (teal/white, rounded cards, header).
- If you change the backend host/port, update `API_BASE` in `script.js`.
- Default MySQL credentials are placeholders; set your own before running.


