# 🏥 MediStore Backend API

<!-- <p align="center">
  <img src="https://placehold.co/1200x300?text=MediStore+Backend" alt="MediStore Backend Banner" width="100%" />
</p> -->

> A modern, scalable, and role-based REST API for an online medicine marketplace built with **Node.js, Express, TypeScript, and Prisma ORM**.

**Status:** ✅ Production Ready | **License:** MIT | **Maintainer:** [Your Name]

---

## 📌 Project Overview

**MediStore Backend** is a robust, production-grade REST API that powers an e-commerce-style medicine marketplace. It provides a secure, modular, and scalable foundation for:

- 👥 **Users** to browse medicines, place orders, write reviews, and manage profiles
- 🏥 **Admins** to manage categories, medicines, orders, and system-wide operations
- 🔐 **Role-based access control** ensuring data security and operational integrity

### Problem It Solves

Managing an online medicine store requires careful handling of:

- **Authentication & Authorization** – Secure role-based access (USER/ADMIN)
- **Data Consistency** – Managing medicines, orders, reviews with proper relationships
- **Email Verification** – Admin-only routes require verified email addresses
- **Scalability** – Modular architecture supporting growth

---

## 🛠 Tech Stack

| Technology      | Purpose              | Why Chosen                                                         |
| --------------- | -------------------- | ------------------------------------------------------------------ |
| **Node.js**     | Server runtime       | Lightweight, event-driven, perfect for I/O-heavy APIs              |
| **Express.js**  | Web framework        | Minimal, flexible, industry-standard for REST APIs                 |
| **TypeScript**  | Programming language | Type safety, better developer experience, fewer runtime errors     |
| **Prisma ORM**  | Database access      | Type-safe queries, auto-generated migrations, excellent DX         |
| **PostgreSQL**  | Database             | Reliable relational DB, ACID compliance, great for structured data |
| **Better-Auth** | Authentication       | Modern session & token management with built-in email verification |
| **Postman**     | API testing          | Comprehensive API testing, collection management, collaboration    |

---

## 🏗️ Project Architecture & Data Flow

The API follows a **layered, modular architecture**:

```
┌─────────────────────────────────────────────────────┐
│  Client Request (Web/Mobile/Postman)                │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Express Routes                                     │
│  (Route handlers, request delegation)               │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Middleware Stack                                   │
│  ├─ Auth Middleware (Better-Auth verification)     │
│  ├─ Error Handler (Prisma-aware)                   │
│  └─ Not Found Handler                              │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Controllers                                        │
│  (Request validation, parameter extraction)         │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Services (Business Logic)                          │
│  (Processing, calculations, decisions)              │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Prisma ORM                                         │
│  (Type-safe database queries)                       │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  PostgreSQL Database                                │
└─────────────────────────────────────────────────────┘
```

### Key Architecture Features

✨ **Modular Structure** – Each feature (users, medicines, orders, etc.) is self-contained  
✨ **Separation of Concerns** – Routes → Controllers → Services → Database  
✨ **Middleware Pipeline** – Centralized auth, error handling, and logging  
✨ **Slug Support** – Categories support URL-friendly slugs for SEO  
✨ **Type Safety** – Full TypeScript + Prisma integration  
✨ **Pagination** – Efficient data retrieval with pagination & sorting

---

## 📚 API Endpoints & Data Flow

### Authentication Endpoints

| Method | Endpoint             | Customer | Seller | Admin | Description                        |
| ------ | -------------------- | :------: | :----: | :---: | ---------------------------------- |
| `POST` | `/auth/register`     |    ✅    |   ✅   |  ✅   | User registration with email       |
| `POST` | `/auth/login`        |    ✅    |   ✅   |  ✅   | User login (returns session token) |
| `GET`  | `/auth/me`           |    ✅    |   ✅   |  ✅   | Get current authenticated user     |
| `POST` | `/auth/logout`       |    ✅    |   ✅   |  ✅   | Logout & invalidate session        |
| `POST` | `/auth/verify-email` |    ✅    |   ✅   |  ✅   | Verify email with token            |

### Categories Endpoints

| Method   | Endpoint                    | Customer | Seller | Admin | Description                     |
| -------- | --------------------------- | :------: | :----: | :---: | ------------------------------- |
| `GET`    | `/categories`               |    ✅    |   ✅   |  ✅   | List all categories (paginated) |
| `GET`    | `/categories/by-slug/:slug` |    ✅    |   ✅   |  ✅   | Get category by slug            |
| `GET`    | `/categories/:id`           |    ✅    |   ✅   |  ✅   | Get category by ID              |
| `POST`   | `/categories`               |    ❌    |   ❌   | ✅\*  | Create new category             |
| `PUT`    | `/categories/:id`           |    ❌    |   ❌   | ✅\*  | Update category                 |
| `DELETE` | `/categories/:id`           |    ❌    |   ❌   | ✅\*  | Delete category                 |

✅ = Accessible | ❌ = Not Accessible | ✅\* = Requires verified email

### Medicines Endpoints

| Method   | Endpoint         | Customer | Seller | Admin | Description                                |
| -------- | ---------------- | :------: | :----: | :---: | ------------------------------------------ |
| `GET`    | `/medicines`     |    ✅    |   ✅   |  ✅   | List all medicines (paginated, filterable) |
| `GET`    | `/medicines/:id` |    ✅    |   ✅   |  ✅   | Get medicine details                       |
| `POST`   | `/medicines`     |    ❌    |   ❌   | ✅\*  | Create new medicine                        |
| `PUT`    | `/medicines/:id` |    ❌    |   ❌   | ✅\*  | Update medicine                            |
| `DELETE` | `/medicines/:id` |    ❌    |   ❌   | ✅\*  | Delete medicine                            |

### Orders Endpoints

| Method   | Endpoint      | Customer | Seller | Admin | Description                                                |
| -------- | ------------- | :------: | :----: | :---: | ---------------------------------------------------------- |
| `GET`    | `/orders`     |    ✅    |   ✅   |  ✅   | List user's orders                                         |
| `GET`    | `/orders/:id` |    ✅    |   ✅   |  ✅   | Get order details                                          |
| `POST`   | `/orders`     |    ✅    |   ❌   |  ✅   | Create new order                                           |
| `PUT`    | `/orders/:id` |    ❌    |   ❌   | ✅\*  | Update order status (PENDING → PAID → SHIPPED → CANCELLED) |
| `DELETE` | `/orders/:id` |    ❌    |   ❌   | ✅\*  | Delete order                                               |

### Reviews Endpoints

| Method   | Endpoint       | Customer | Seller | Admin | Description                        |
| -------- | -------------- | :------: | :----: | :---: | ---------------------------------- |
| `GET`    | `/reviews`     |    ✅    |   ✅   |  ✅   | List medicine reviews              |
| `GET`    | `/reviews/:id` |    ✅    |   ✅   |  ✅   | Get review details                 |
| `POST`   | `/reviews`     |    ✅    |   ✅   |  ✅   | Create review for ordered medicine |
| `PUT`    | `/reviews/:id` |    ✅    |   ✅   |  ✅   | Update own review                  |
| `DELETE` | `/reviews/:id` |    ✅    |   ✅   |  ✅   | Delete own review                  |

### Users Endpoints

| Method   | Endpoint     | Customer | Seller | Admin | Description        |
| -------- | ------------ | :------: | :----: | :---: | ------------------ |
| `GET`    | `/users`     |    ❌    |   ❌   | ✅\*  | List all users     |
| `GET`    | `/users/:id` |    ❌    |   ❌   | ✅\*  | Get user details   |
| `PUT`    | `/users/:id` |    ✅    |   ✅   | ✅\*  | Update own profile |
| `DELETE` | `/users/:id` |    ❌    |   ❌   | ✅\*  | Delete user        |

---

### Example: Create Category Flow

```
POST /categories
├─ Request Body: { name: "Pain Relief", description: "..." }
├─ Header: Authorization: Bearer <SESSION_TOKEN>
│
├─ Route Handler → routes/category.route.ts
│
├─ Auth Middleware
│   └─ Verifies Better-Auth session token
│   └─ Extracts user info (userId, role)
│   └─ Checks if role === ADMIN
│   └─ Checks if user.emailVerified === true
│
├─ Controller → controllers/category.controller.ts
│   └─ Validates request body
│   └─ Calls service.createCategory()
│
├─ Service → services/category.service.ts
│   └─ Generates slug using generateSlug() helper
│   └─ Checks for duplicate slug
│   └─ Calls Prisma to insert category
│
├─ Prisma → ORM Layer
│   └─ Executes: INSERT INTO categories (name, slug, ...)
│
└─ Response: { id, name, slug, createdAt } (201 Created)
```

### Example: Get Categories with Pagination

```
GET /categories?page=1&limit=10&sort=name&order=asc

Response:
{
  "data": [
    { "id": "cat-1", "name": "Pain Relief", "slug": "pain-relief" },
    { "id": "cat-2", "name": "Vitamins", "slug": "vitamins" },
    ...
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 📮 Postman Collection & Testing

### Import Postman Collections

We provide pre-configured Postman collections for easy API testing:

**Collection Files:**

- 📄 **Main Collection:** `/postman/MediStore.postman_collection.json`
- 🌍 **Environment Variables:** `/postman/MediStore.postman_environment.json`

#### How to Import in Postman

1. Open **Postman** → Click `File` → Select `Import`
2. Choose **Upload Files** and select `MediStore.postman_collection.json`
3. Click `Import`
4. Go to **Environments** (top-left) → Click **Import** → Select `MediStore.postman_environment.json`
5. Select the **MediStore** environment from the dropdown

#### Environment Variables

```
baseUrl          = http://localhost:5000/api/v1
token            = <YOUR_SESSION_TOKEN_HERE>
adminToken       = <ADMIN_SESSION_TOKEN_HERE>
categoryId       = <TEST_CATEGORY_ID>
medicineId       = <TEST_MEDICINE_ID>
orderId          = <TEST_ORDER_ID>
```

#### Global Headers

All requests automatically include:

```
Authorization    = Bearer {{token}}
Content-Type     = application/json
```

Note: Better-Auth handles session tokens which are sent via `Authorization: Bearer <token>` header or as secure HTTP-only cookies depending on configuration.

#### Example Postman Requests

**1) Create Category (Admin)**

```
POST http://localhost:5000/api/v1/categories
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Antibiotics",
  "description": "Prescription antibiotics",
  "icon": "💊"
}

// Response (201):
{
  "id": "cat-abc123",
  "name": "Antibiotics",
  "slug": "antibiotics",
  "description": "Prescription antibiotics",
  "createdAt": "2026-01-28T10:30:00Z"
}
```

**2) Get Categories (Public, with Pagination)**

```
GET http://localhost:5000/api/v1/categories?page=1&limit=5&sort=name&order=asc
Content-Type: application/json

// Response (200):
{
  "data": [
    { "id": "1", "name": "Antibiotics", "slug": "antibiotics" },
    { "id": "2", "name": "Pain Relief", "slug": "pain-relief" },
    { "id": "3", "name": "Vitamins", "slug": "vitamins" }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}
```

**3) Get Category by Slug (Public)**

```
GET http://localhost:5000/api/v1/categories/by-slug/antibiotics
Content-Type: application/json

// Response (200):
{
  "id": "cat-abc123",
  "name": "Antibiotics",
  "slug": "antibiotics",
  "description": "Prescription antibiotics",
  "medicines": [...]
}
```

---

## ✨ Key Features

- 🔐 **Role-Based Access Control (RBAC)** – USER and ADMIN roles with granular permissions
- 🏷️ **Category Slug Support** – SEO-friendly URLs (e.g., `/categories/by-slug/pain-relief`)
- 📦 **Modular Architecture** – Each feature is independent and maintainable
- 🗄️ **Prisma ORM** – Type-safe database queries with auto-generated migrations
- 🛡️ **Centralized Error Handling** – Prisma-aware error middleware
- 📄 **Pagination & Sorting** – Efficient data retrieval with meta information
- 🔒 **Secure Authentication** – Better-Auth with session & token management
- 📧 **Email Verification** – Admin routes require verified email (requireVerifiedEmail = true)
- 🚀 **Production-Ready** – Structured logging, error handling, validation
- 🧪 **Postman Ready** – Pre-configured collections for testing

---

## 📥 Installation & Setup

### Prerequisites

- **Node.js** `v18.0.0` or higher
- **npm** or **pnpm** package manager
- **PostgreSQL** database
- **Git**

### Step-by-Step Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/medistore-backend.git
cd medistore-backend
```

#### 2️⃣ Install Dependencies

```bash
pnpm install
# or
npm install
```

#### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/medistore

# Better-Auth Configuration
BETTER_AUTH_SECRET=your_super_secret_key_change_this_in_production
BETTER_AUTH_URL=http://localhost:5000/api/auth

# Email (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Admin Seed
ADMIN_EMAIL=admin@medistore.com
ADMIN_PASSWORD=SecurePassword123!
```

#### 4️⃣ Generate Prisma Client

```bash
pnpm exec prisma generate
# or
npx prisma generate
```

#### 5️⃣ Run Database Migrations

```bash
pnpm exec prisma migrate dev --name init
# or
npx prisma migrate dev --name init
```

#### 6️⃣ Seed Database (Optional - Creates Admin User)

```bash
pnpm run seed:admin
# or
npm run seed:admin
```

#### 7️⃣ Start the Development Server

```bash
pnpm run dev
# or
npm run dev
```

**Server runs on:** `http://localhost:5000`

---

## 📁 Folder Structure & Responsibilities

```
medistore-backend/
│
├── src/
│   ├── modules/                    # Feature modules
│   │   ├── categories/             # Category management
│   │   │   ├── category.route.ts   # Routes & endpoints
│   │   │   ├── category.controller.ts  # Request handlers
│   │   │   └── category.service.ts     # Business logic
│   │   ├── medicines/              # Medicine management
│   │   │   ├── medicine.route.ts
│   │   │   ├── medicine.controller.ts
│   │   │   └── medicine.service.ts
│   │   ├── orders/                 # Order management
│   │   │   ├── order.route.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.dto.ts        # Data transfer objects
│   │   │   └── order.validation.ts # Input validation
│   │   ├── reviews/                # Review management
│   │   │   ├── review.route.ts
│   │   │   ├── review.controller.ts
│   │   │   └── review.service.ts
│   │   └── users/                  # User management
│   │       ├── user.route.ts
│   │       ├── user.controller.ts
│   │       └── user.service.ts
│   │
│   ├── middleware/                 # Global middleware
│   │   ├── auth.middleware.ts      # JWT verification & role check
│   │   ├── globalErrorHandler.ts   # Error handling (Prisma-aware)
│   │   └── NotFound.ts             # 404 handler
│   │
│   ├── helpers/                    # Utility functions
│   │   ├── generateSlug.ts         # Convert names to URL-safe slugs
│   │   └── paginationSortingHelper.ts  # Pagination logic
│   │
│   ├── lib/                        # Core libraries
│   │   ├── auth.ts                 # Auth utilities
│   │   ├── prisma.ts               # Prisma client singleton
│   │   └── mail-template.ts        # Email templates
│   │
│   ├── types/                      # TypeScript type definitions
│   │   └── express.d.ts            # Extend Express types
│   │
│   ├── scripts/                    # Database scripts
│   │   └── seedAdmin.ts            # Admin user seeding
│   │
│   ├── app.ts                      # Express app initialization
│   └── server.ts                   # Server startup
│
├── prisma/
│   ├── schema.prisma               # Database schema definition
│   └── migrations/                 # Migration history
│
├── resources/                      # Static assets
├── generated/                      # Prisma generated code
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

### Module Responsibilities

#### 📍 **Routes** (`***.route.ts`)

- Define HTTP endpoints (GET, POST, PUT, DELETE)
- Apply middleware (auth, validation)
- Route requests to controllers

#### 🎮 **Controllers** (`***.controller.ts`)

- Extract and validate request data
- Call appropriate service methods
- Format and send responses

#### ⚙️ **Services** (`***.service.ts`)

- Implement business logic
- Perform calculations and checks
- Interact with Prisma ORM

#### 🛡️ **Middleware** (`middleware/`)

- **auth.middleware.ts** – Verifies JWT, extracts user info, checks roles
- **globalErrorHandler.ts** – Catches errors, formats responses, logs issues
- **NotFound.ts** – Handles 404 errors for undefined routes

#### 🔧 **Helpers** (`helpers/`)

- **generateSlug.ts** – Converts "Pain Relief" → "pain-relief"
- **paginationSortingHelper.ts** – Builds Prisma pagination queries

---

## 🚀 Running the Project

### Development Mode (with auto-reload)

```bash
pnpm run dev
```

### Production Build

```bash
pnpm run build
pnpm run start
```

### Database Commands

```bash
# Create new migration
pnpm exec prisma migrate dev --name <migration_name>

# Apply pending migrations
pnpm exec prisma migrate deploy

# View/Edit data visually
pnpm exec prisma studio

# Reset database (dev only)
pnpm exec prisma migrate reset
```

---

## 🔄 Environment Variables Reference

| Variable         | Description                          | Example                                           |
| ---------------- | ------------------------------------ | ------------------------------------------------- |
| `NODE_ENV`       | Environment (development/production) | `development`                                     |
| `PORT`           | Server port                          | `5000`                                            |
| `DATABASE_URL`   | PostgreSQL connection string         | `postgresql://user:pass@localhost:5432/medistore` |
| `JWT_SECRET`     | Secret key for signing JWT tokens    | `your-super-secret-key`                           |
| `JWT_EXPIRES_IN` | Token expiration time                | `7d`                                              |
| `MAIL_HOST`      | SMTP server for emails               | `smtp.gmail.com`                                  |
| `MAIL_PORT`      | SMTP port                            | `587`                                             |
| `ADMIN_EMAIL`    | Default admin email (for seeding)    | `admin@medistore.com`                             |

---

## 🛣️ Future Improvements & Roadmap

The following enhancements are planned for future releases:

- 📖 **Swagger/OpenAPI Documentation** – Auto-generated API docs with interactive UI
- ✅ **Request Validation** – Zod/Joi for robust input validation
- ⏱️ **Rate Limiting** – Prevent abuse with request rate limiting
- 💾 **Redis Caching** – Cache frequently accessed data (categories, medicines)
- 📝 **Structured Logging** – Pino/Winston for production-grade logging
- 🧪 **Test Suite** – Jest + Supertest for unit and integration tests
- 🔄 **CI/CD Pipeline** – GitHub Actions for automated testing & deployment
- 📱 **GraphQL Support** – Alternative to REST API
- 🔔 **Notifications** – Email/SMS alerts for order updates
- 📊 **Analytics Dashboard** – Track sales, user behavior, performance

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Use TypeScript strictly
- Follow existing folder structure
- Add tests for new features
- Keep commits descriptive
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) file for details.

---

## 💬 Support & Contact

- **Issues & Bugs:** [GitHub Issues](https://github.com/yourusername/medistore-backend/issues)
- **Email:** support@medistore.com
- **Documentation:** [Full API Docs](https://docs.medistore.com)

---

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) – Outstanding ORM
- [Express.js](https://expressjs.com/) – Minimal and flexible framework
- [TypeScript](https://www.typescriptlang.org/) – Type safety for JavaScript
- [PostgreSQL](https://www.postgresql.org/) – Reliable database

---

**Made with ❤️ by the MediStore Team**  
Last Updated: January 28, 2026
↓
Services (Business Logic)
↓
Prisma ORM
↓
PostgreSQL

### Design Principles

- Thin controllers, fat services
- Centralized error handling
- Role-based authorization
- Transaction-safe operations
- Pagination & sorting helpers

---

## 🔐 Authentication & Roles

### User Roles

- `CUSTOMER`
- `SELLER`
- `ADMIN`

### Auth Rules

- Email verification required for sensitive actions
- Role validation enforced via middleware
- Session-based authentication

---

## 🚀 API Endpoints

### 🔑 Authentication (Better-Auth)

POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
POST /api/auth/sign-out
GET /api/auth/session
GET /api/auth/verify-email

---

### 👤 Users

GET /api/v1/users/me (Customer / Seller / Admin)
GET /api/v1/admin/users (Admin)
PATCH /api/v1/admin/users/:id/ban (Admin)

---

### 📂 Categories

GET /api/v1/categories
GET /api/v1/categories/by-slug/:slug
GET /api/v1/categories/:id

POST /api/v1/categories (Admin)
PUT /api/v1/categories/:id (Admin)
DELETE /api/v1/categories/:id (Admin)

Supports pagination:
?page=1&limit=10&sortBy=name&sortOrder=asc

---

### 💊 Medicines

GET /api/v1/medicines
GET /api/v1/medicines/:id

POST /api/v1/medicines (Seller)
PUT /api/v1/medicines/:id (Seller / Admin)
DELETE /api/v1/medicines/:id (Seller / Admin)

GET /api/v1/medicines/seller/medicines (Seller)

Filters:
?categoryId=
?search=
?minPrice=
?maxPrice=
?manufacturer=

---

### 🛒 Orders

#### Customer

POST /api/v1/orders
GET /api/v1/orders
GET /api/v1/orders/:id
PATCH /api/v1/orders/:id/cancel

#### Seller

GET /api/v1/seller/orders
PATCH /api/v1/seller/orders/:id

#### Admin

GET /api/v1/admin/orders
PATCH /api/v1/admin/orders/:id

---

### ⭐ Reviews

GET /api/v1/reviews/:medicineId
GET /api/v1/reviews (Customer)

POST /api/v1/reviews (Customer)
PUT /api/v1/reviews/:id (Customer)
DELETE /api/v1/reviews/:id (Customer)

📌 **Rule:** Reviews are allowed **only after an order is delivered**.

---

## ✨ Features

- 🔐 Secure authentication with email verification
- 🎭 Role-based access control
- 🧾 Transaction-safe order creation
- 📦 Seller-restricted order updates
- ⭐ Order-based review system
- 📊 Pagination & sorting support
- 🧹 Prisma-safe optional field handling
- ❌ Centralized global error handler

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/medi-store-backend.git
cd medi-store-backend
2️⃣ Install Dependencies
pnpm install
3️⃣ Environment Variables
Create .env file:

PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medi-store-app
BETTER_AUTH_SECRET=demo_auth_secret
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000
APP_USER=demo@gmail.com
APP_PASS=xxxx xxxx xxxx xxxx
4️⃣ Database Setup
pnpm prisma migrate dev
pnpm prisma generate
5️⃣ Run Server
pnpm dev
🧪 Postman Testing Guide
Recommended Testing Flow
Sign up user

Verify email

Login

Create category (Admin)

Create medicine (Seller)

Place order (Customer)

Update order status (Seller/Admin)

Create review after delivery

📌 Important: Enable cookies in Postman (Better-Auth uses sessions).

📁 Folder Structure
src/
 ├─ modules/
 │   ├─ users/
 │   ├─ categories/
 │   ├─ medicines/
 │   ├─ orders/
 │   ├─ reviews/
 ├─ middleware/
 ├─ helpers/
 ├─ lib/
 ├─ app.ts
 └─ server.ts
🔮 Future Improvements
🔍 Global search

💳 Payment gateway integration

📦 Order tracking

🧠 Admin analytics dashboard

🧪 Automated testing (Jest)

---
If you want next:
- 📦 **Postman collection JSON**
- 📘 **Swagger / OpenAPI docs**
- 🎯 **Assignment explanation PDF**

```
