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
2. Install packages:
    ```bash
       npm install
3. Set up your database configuration in the .env file:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
4. Run migrations to create necessary tables:

   ```bash
   npm run migrate
5. Seed the database with initial data:
   ```bash
   npm run seed
6. Start the server:
    ```bash
       npm run dev
### Testing
    ```bash
       npm run test

# Design Choices for Ticks: Event Ticket Booking System

## Architecture & Structure
Ticks is built on a RESTful API architecture using Node.js and TypeScript, with an MVC (Model-View-Controller) structure. This setup helps keep things organized by separating different parts of the application, which makes managing, testing, and scaling easier. To manage database interactions, I chose Sequelize ORM with MySQL. This combo offers both flexibility and efficiency in handling data relationships and running queries.

## Authentication & Authorization
For secure access across the app, I used JWT for user authentication, which supports a stateless access model. The API also enforces role-based access so that actions like creating or deleting events are limited to users with admin privileges. This approach balances user experience with robust data security and access control.

## Concurrency & Booking Management
One of the main challenges with Ticks is handling ticket availability for popular events. To prevent booking conflicts, I use database constraints and locking mechanisms, making sure that race conditions don’t interfere with ticket availability. For sold-out events, a waitlisting system keeps things organized. Additionally, I use Sequelize transactions to keep booking operations atomic and consistent—meaning any issue in the booking process triggers a rollback to avoid overbooking. This setup supports reliable ticket reservations and a smoother booking experience.

## Technology Choices
- **Node.js**: Handles non-blocking, asynchronous requests, ideal for a high-traffic application like Ticks.
- **TypeScript**: Brings in type safety, helping reduce errors and making the code easier to maintain.
- **Sequelize ORM**: Simplifies MySQL database management, allowing for complex queries, migrations, and transactional control.
- **MySQL**: A robust choice for handling relational data such as tickets, users, and events, ensuring strong data integrity.

## Security & Environment Management
For data security, I store sensitive info like `JWT_SECRET` in environment variables, and access to critical endpoints is restricted by user roles. Using `.gitignore` to exclude sensitive files like `node_modules` and `.env` from version control adds an extra layer of protection, preventing unintended exposure.

## User Experience & Testing
To ensure everything runs smoothly, I use Mocha for unit tests on core functions, particularly booking and cancellation processes. Testing helps maintain reliability, quickly identifies issues, and ensures that users have a positive, hassle-free experience.

This approach combines robust technology choices with a thoughtful design structure, prioritizing user experience, scalability, and reliability in managing event tickets.

 


   


   
