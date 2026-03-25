# Simple Joe Ecommerce

A full-stack ecommerce application built with React and Express. Users can browse products, manage a cart, and place orders. Admins have a separate dashboard to manage products, categories, and order statuses.

---

## Tech Stack

**Frontend**
- React 19, React Router v7
- TanStack Query v5
- Vite

**Backend**
- Express 5, MongoDB, Mongoose
- JWT authentication (cookie-based)
- Helmet, express-rate-limit, bcrypt

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB instance (local or Atlas)

### Backend

```bash
cd "Backend Express"
npm install
```

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=5000
```

```bash
npm run dev
```

### Frontend

```bash
cd EcommerceFrontend
npm install
npm run dev
```

---

## Project Structure

```
Simple-Joe-Ecommerce/
├── Backend Express/
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & admin middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   └── server.js
└── EcommerceFrontend/
    ├── adminPages/         # Admin-only pages & portals
    └── src/
        ├── api/            # Fetch functions
        ├── authentication/ # Auth context
        ├── components/     # Page components
        └── subcomponents/  # Shared UI components
```

---

## API Reference

Base URL: `http://localhost:PORT`

### Users `/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/logout` | User | Logout |
| GET | `/profile` | User | Get own profile |
| PUT | `/update` | User | Update profile |
| POST | `/address` | User | Add address |
| GET | `/address` | User | Get addresses |
| PUT | `/address/:id` | User | Update address |
| DELETE | `/address/:id` | User | Delete address |

### Products `/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | Get all products (filter by `?categoryName=`) |
| GET | `/:id` | Public | Get product by ID |
| POST | `/:id/reviews` | User | Add a review |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Categories `/categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | Get all categories |
| GET | `/:id` | Public | Get category by ID |
| POST | `/` | Admin | Create category |
| DELETE | `/:id` | Admin | Delete category |

### Cart `/cart`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | User | Get cart |
| POST | `/items` | User | Add item |
| PATCH | `/items` | User | Update item quantity |
| DELETE | `/items/:productId` | User | Remove item |
| DELETE | `/` | User | Clear cart |

### Orders `/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | User | Create order from cart |
| GET | `/myOrders` | User | Get own orders |
| GET | `/:id` | User/Admin | Get order by ID |
| DELETE | `/:id/cancel` | User | Cancel order |
| GET | `/` | Admin | Get all orders (filter by `?status=`) |
| PUT | `/:id/status` | Admin | Update order status |

---

## Order Status Flow

Orders follow strict transitions enforced on both the backend and frontend:

```
pending → processing → shipped → delivered
   ↓            ↓
cancelled    cancelled
```

---

## Features

### User
- Register and login with JWT cookie authentication
- Browse and filter products by category
- Add products to cart and adjust quantities
- Manage shipping addresses
- Checkout and place orders
- Track order history with color-coded status badges

### Admin
- Separate dashboard visible only to users with `role: "admin"`
- Create, edit, and delete products (image URLs, category assignment)
- Create and delete categories with parent/path hierarchy
- View all orders filterable by status
- Update order status with valid-transition enforcement (tracking number and carrier required for shipped)

---

## Data Models

**User** — name, email, password (hashed), role (`user` | `admin`), addresses

**Product** — name, description, price, stockQuantity, category (ref), images, reviews, averageRating

**Category** — name, parent (ref, optional), path (e.g. `electronics>phones>smartphones`)

**Order** — user, items (denormalized snapshot), shippingAddress, paymentInfo, priceBreakdown, status, trackingNumber, carrier, adminNotes

**ShoppingCart** — user, items[]
