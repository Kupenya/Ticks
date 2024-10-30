# Ticks

# Event Ticket Booking System

## Overview
This is a Node.js server that provides a RESTful API for an event ticket booking system. The system allows users to manage event tickets efficiently, handling bookings, cancellations, and waitlists while ensuring user authentication.

### Features
- Initialize events with a specified number of available tickets.
- Concurrent ticket booking for users.
- Waitlist functionality for sold-out events.
- View available tickets and waitlist status.
- Handle ticket cancellations with automatic assignment to waitlisted users.
- Save all booking details to a MySQL relational database.
- User authentication and management using JWT.

## Technologies Used
- Node.js
- TypeScript
- Sequelize ORM
- MySQL
- JWT for authentication
- Mocha chai for testing

## API Endpoints

### Authentication Endpoints

1. **User Registration**
   - **URL:** `/api/v1/auth/register`
   - **Method:** `POST`
   - **Request Body:**
     ```json
     {
       "username": "divinealph",
       "email": "divinealph@example.com",
       "password": "securePassword123"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "User registered successfully.",
       "data": {
         "id": 1,
         "username": "divinealph",
         "email": "divinealph@example.com"
       },
       "error": false
     }
     ```

2. **User Login**
   - **URL:** `/api/v1/auth/login`
   - **Method:** `POST`
   - **Request Body:**
     ```json
     {
       "email": "divinealph@example.com",
       "password": "securePassword123"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Login successful.",
       "data": {
         "token": "jwt.token.here"
       },
       "error": false
     }
     ```

3. **Get Current User**
   - **URL:** `/api/v1/auth/me`
   - **Method:** `GET`
   - **Headers:**
     - `Authorization: Bearer <token>`
   - **Response:**
     ```json
     {
       "message": "User retrieved successfully.",
       "data": {
         "id": 1,
         "username": "divinealph",
         "email": "divinealph@example.com"
       },
       "error": false
     }
     ```
### Event Management Endpoints

1. **Create an Event**
   - **URL:** `/api/v1/event`
   - **Method:** `POST`
   - **Authorization:** Bearer token required
   - **Request Body:**
     ```json
     {
       "name": "Concert",
       "date": "2024-12-01",
       "totalTickets": 100,
       "availableTickets": 100,
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Event created successfully.",
       "data": {
         "id": 1,
         "name": "Concert",
         "date": "2024-12-01T00:00:00.000Z",
         "totalTickets": 100,
         "availableTickets": 100,
         "createdBy": 1,
         "createdAt": "2024-10-30T17:22:02.444Z",
         "updatedAt": "2024-10-30T17:22:02.444Z"
       },
       "error": false
     }
     ```

2. **Get All Events**
   - **URL:** `/api/v1/event`
   - **Method:** `GET`
   - **Authorization:** Bearer token required
   - **Response:**
     ```json
     {
       "message": "Events retrieved successfully.",
       "data": [
         {
           "id": 1,
           "name": "Concert",
           "date": "2024-12-01T00:00:00.000Z",
           "totalTickets": 100,
           "availableTickets": 100,
           "createdBy": 1,
           "createdAt": "2024-10-30T17:22:02.444Z",
           "updatedAt": "2024-10-30T17:22:02.444Z"
         }
       ],
       "error": false
     }
     ```

3. **Delete an Event**
   - **URL:** `/api/v1/event/{eventId}`
   - **Method:** `DELETE`
   - **Authorization:** Bearer token required
   - **Response:**
     ```json
     {
       "message": "Event deleted successfully.",
       "error": false
     }
     ```


### Booking Endpoints

1. **Create a Booking**
   - **URL:** `/api/v1/booking`
   - **Method:** `POST`
   - **Request Body:**
     ```json
     {
       "eventId": "3",
       "firstName": "Divine",
       "lastName": "Alphonsus",
       "email": "divinealph@example.com",
       "ticketsReserved": "10"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Booking created successfully.",
       "data": {
         "id": 19,
         "eventId": "1",
         "userId": null,
         "firstName": "Divine",
         "lastName": "Alphonsus",
         "email": "divinealph@example.com",
         "ticketsReserved": "1",
         "bookingStatus": "completed",
         "updatedAt": "2024-10-30T17:22:02.444Z",
         "createdAt": "2024-10-30T17:22:02.444Z"
       },
       "error": false
     }
     ```

2. **Cancel a Booking**
   - **URL:** `/api/v1/booking/{bookingId}`
   - **Method:** `DELETE`
   - **Request Body:**
     ```json
     {
       "bookingId": 12,
       "ticketsToCancel": 10
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Booking cancelled successfully.",
       "error": false
     }
     ```

3. **Get Booking Status**
   - **URL:** `/api/v1/booking/status/{eventId}`
   - **Method:** `GET`
   - **Response:**
     ```json
     {
       "message": "Event status retrieved successfully.",
       "error": false,
       "data": {
         "availableTickets": 10,
         "waitlistedCount": 3
       }
     }
     ```



## Setup and Running Instructions

### Prerequisites
- Node.js and npm installed on your machine.
- MySQL server running.

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>
2. Set up your database configuration in the .env file:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
3. Run migrations to create necessary tables:

   ```bash
   npm run migrate
4. Seed the database with initial data:
   ```bash
   npm run seed
5. Start the server:
    ```bash
    npm run dev
    
### Testing
  ```bash
    npm run test



   


   
