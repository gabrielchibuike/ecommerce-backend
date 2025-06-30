# E-Commerce Node.js API

A RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- User registration and login (JWT authentication)
- Product CRUD operations
- Cart and checkout system
- Order tracking
- Admin dashboard routes
- Payment integration

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for auth
- Paystack for payments

## 📁 Folder Structure

├── controllers/ # Handles logic for each route
├── routes/ # Express route files
├── models/ # Mongoose models
├── middleware/ # Auth & error handling
├── config/ # DB and 3rd-party configs
├── utils/ # Helper functions
├── uploads/ # Uploaded product images
├── .env.example # Sample env variables
├── README.md # Project documentation

## 🧪 Getting Started

1. Clone this repo
2. Run `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the server:

````bash
npm run dev

The API will be available at http://localhost:5000/api/

```markdown
## 📚 API Documentation

- [Auth](./docs/auth.md)
````
