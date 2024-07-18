# Train Booking System

A web application for booking train tickets. This project uses Node.js, Express, Prisma, and MongoDB for the backend, with JWT for authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)


## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (version 14 or higher)
- [npm](https://www.npmjs.com/get-npm) (version 6 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/train-booking-system.git
    cd train-booking-system
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

DATABASE_URL="mongodb+srv://"username":"password"@cluster0.mongodb.net/"dbname"?retryWrites=true&w=majority"

Make sure to replace `<username>`, `<password>`, and `<dbname>` with your MongoDB credentials.

## Running the Application

1. Start the MongoDB server if it is not running.

2. Run the application:
    ```bash
    node server.js
    ```

3. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

### User Endpoints

- **POST** `/users/signup`
  - Create a new user.
  - Request Body: `{ "email": "string", "password": "string", "name": "string", "age": "number", "mobile": "string", "role": "string" }`

- **POST** `/users/login`
  - Authenticate a user.
  - Request Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "message": "Login successful" }`

- **GET** `/users/details`
  - Get the details of the authenticated user.
  - Response: `{ "id": "string", "email": "string", "name": "string", "age": "number", "mobile": "string", "role": "string" }`

### Admin Endpoints

- **POST** `/admins/login`
  - Authenticate an admin.
  - Request Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "message": "Login successful" }`

- **POST** `/admins/add`
  - Add a new admin.
  - Request Body: `{ "email": "string", "password": "string", "role": "string", "name": "string", "age": "number", "mobile": "string" }`

### Train Endpoints

- **GET** `/trains`
  - Get all trains.
  - Response: Array of train objects.

- **POST** `/trains/add`
  - Add a new train. (Admin only)
  - Request Body: `{ "trainName": "string", "trainNumber": "string", "dateOfAvailability": "string", "routePoints": Array, "fare": Array }`

### Booking Endpoints

- **POST** `/trains/confirm-ticket`
  - Book a ticket.
  - Request Body: `{ "train_number": "string", "passengers": Array }`

- **GET** `/trains/bookings`
  - Get all bookings.

- **DELETE** `/trains/bookings/:bookingId`
  - Delete a booking by ID.



