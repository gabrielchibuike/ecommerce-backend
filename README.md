# 🛒 E-Commerce Backend API

A production-ready RESTful API for an e-commerce platform built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**. Supports authentication, product management, cart & checkout, order tracking, payment processing, and real-time features.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Payment Integration](#-payment-integration)
- [Rate Limiting & Security](#-rate-limiting--security)
- [Logging](#-logging)
- [Scripts](#-scripts)

---

## ✨ Features

- **Authentication & Authorization** — JWT-based auth with secure password hashing via Argon2
- **Product Management** — Full CRUD operations with Cloudinary image uploads
- **Cart & Checkout** — Session-managed shopping cart with order creation
- **Order Tracking** — Track order status from placement to delivery
- **Admin Dashboard** — Protected routes for managing products, orders, and users
- **Payment Integration** — Paystack payment gateway support
- **Real-time Support** — Socket.IO for live order status updates
- **AI Features** — Integrated Google Generative AI and OpenAI APIs
- **Web Scraping** — Cheerio-powered product data enrichment
- **Redis Caching** — ioredis-backed rate limiting and caching layer
- **Input Validation** — Joi and Zod schema validation on all endpoints
- **Security Hardening** — Helmet, CORS, rate limiting, and request sanitization

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Argon2 |
| Cache | Redis (ioredis) |
| Storage | Cloudinary |
| Payments | Paystack |
| Real-time | Socket.IO |
| Emails | Nodemailer |
| AI | Google Generative AI, OpenAI |
| Logging | Winston + Morgan |
| Validation | Joi, Zod |
| Security | Helmet, express-rate-limit, rate-limiter-flexible |

---

## 🏗️ Architecture

```
Client Request
     │
     ▼
┌─────────────────┐
│   Rate Limiter  │  ← Redis-backed (express-rate-limit + rate-limiter-flexible)
│   + Helmet      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware│  ← JWT verification
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Router       │  ← /api/auth, /api/products, /api/cart, /api/orders, /api/admin
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│   Controller    │─────►│   Service Layer  │
└─────────────────┘      └────────┬─────────┘
                                  │
              ┌───────────────────┼────────────────────┐
              ▼                   ▼                    ▼
     ┌──────────────┐   ┌──────────────────┐  ┌─────────────────┐
     │   MongoDB    │   │     Redis        │  │  Cloudinary /   │
     │  (Mongoose)  │   │   (ioredis)      │  │  Paystack / AI  │
     └──────────────┘   └──────────────────┘  └─────────────────┘
```

---

## 📁 Project Structure

```
ecommerce-backend/
├── src/
│   ├── controllers/       # Route handler logic
│   ├── routes/            # Express route definitions
│   ├── models/            # Mongoose data models
│   ├── middleware/        # Auth, error handling, validation
│   ├── config/            # DB connection, third-party configs
│   └── utils/             # Helper functions & utilities
├── dist/                  # Compiled JavaScript output
├── docs/                  # API documentation (auth.md, etc.)
├── logs/                  # Runtime log files (Winston)
├── .env.example           # Environment variable template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Redis Cloud)
- Cloudinary account
- Paystack account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gabrielchibuike/ecommerce-backend.git
cd ecommerce-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in the values in .env (see Environment Variables section below)

# 4. Start the development server
npm run dev
```

The API will be available at: `http://localhost:5000/api/`

---

## 🔐 Environment Variables

Create a `.env` file in the project root based on `.env.example`. Below are the required variables:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Paystack
PAYSTACK_SECRET_KEY=sk_test_...

# Nodemailer
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# AI (optional)
OPENAI_API_KEY=sk-...
GOOGLE_GENAI_API_KEY=...
```

---

## 📚 API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| POST | `/api/auth/logout` | Invalidate session | Yes |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/me` | Update profile | Yes |
| POST | `/api/auth/forgot-password` | Send password reset email | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |

### Products

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/products` | List all products (paginated) | No |
| GET | `/api/products/:id` | Get a single product | No |
| POST | `/api/products` | Create a product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |
| POST | `/api/products/:id/images` | Upload product images | Admin |

### Cart

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/cart` | Get current user's cart | Yes |
| POST | `/api/cart/add` | Add item to cart | Yes |
| PUT | `/api/cart/update` | Update item quantity | Yes |
| DELETE | `/api/cart/remove/:itemId` | Remove item from cart | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |

### Orders

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/orders` | Place an order | Yes |
| GET | `/api/orders` | List user's orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |
| PUT | `/api/orders/:id/cancel` | Cancel an order | Yes |

### Admin

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/orders` | List all orders | Admin |
| PUT | `/api/admin/orders/:id/status` | Update order status | Admin |
| DELETE | `/api/admin/users/:id` | Delete a user | Admin |

### Payments

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/payments/initialize` | Initialize a Paystack payment | Yes |
| GET | `/api/payments/verify/:reference` | Verify payment status | Yes |

---

## 🔑 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. Passwords are hashed using **Argon2** (more secure than bcrypt).

**How to authenticate:**

1. Register or login to receive a JWT token.
2. Include the token in the `Authorization` header on protected requests:

```http
Authorization: Bearer <your_token_here>
```

Tokens expire based on the `JWT_EXPIRES_IN` env variable (default: 7 days).

---

## 💳 Payment Integration

Payments are handled via **Paystack**. The flow is:

1. Client calls `POST /api/payments/initialize` with order amount.
2. API returns a Paystack authorization URL.
3. User completes payment on Paystack's hosted page.
4. Client calls `GET /api/payments/verify/:reference` to confirm payment.
5. On success, the order status is updated to `paid`.

---

## 🛡️ Rate Limiting & Security

Security measures applied globally:

- **Helmet** — Sets secure HTTP headers
- **CORS** — Configured for allowed origins
- **express-rate-limit** — Limits requests per IP (general)
- **rate-limiter-flexible + Redis** — Fine-grained rate limiting (e.g. login attempts)
- **Joi / Zod validation** — Rejects malformed payloads before reaching controllers
- **Argon2** — Password hashing (winner of the Password Hashing Competition)

---

## 📝 Logging

Logging is handled by **Winston** (persistent log files) and **Morgan** (HTTP request logs in development).

Log files are written to the `/logs` directory:

- `logs/error.log` — Error-level logs
- `logs/combined.log` — All log levels

In development, logs are also printed to the console with colorized output.

---

## 🧪 Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start with nodemon (hot reload) |
| Build | `npm run build` | Compile TypeScript to `/dist` |
| Production | `npm start` | Run compiled output |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

*Built by [gabrielchibuike](https://github.com/gabrielchibuike)*
