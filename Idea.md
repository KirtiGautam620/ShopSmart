# 🛒 ShopSmart – Smart Product & Expense Management Web App

##  Problem Statement
Most shopping platforms allow users to browse and purchase products but do not provide a simple system to manage product data and track shopping activity in a structured way.  
For students and small-scale use cases, there is also a need for a lightweight full-stack application that demonstrates complete CRUD operations using a modern ORM and a deployable architecture.

ShopSmart is designed to solve this by providing:

- secure authentication
- complete product management
- a scalable backend using Prisma ORM
- a simple and responsive frontend

---

##  Objective
The objective of this project is to build a full-stack web application that:

- implements a complete RESTful CRUD API
- uses SQLite3 as the database
- uses Prisma as the ORM
- provides authentication and protected routes
- is deployed on Render (backend) and Vercel (frontend)

---

## 👥 Target Users
- Beginners who want a simple product management system
- Users who want to manage and track their shopping activity

---

##  Core Features

### 1️ Authentication
- User Registration
- User Login
- JWT-based authentication
- Protected routes

### 2️ Product Management (Main Feature – Full CRUD)
- Create a new product
- View all products
- View single product details
- Update product information
- Delete a product

This module fulfills the requirement of implementing a complete RESTful CRUD API.

### 3️ Shopping Cart (Milestone-2)
- Add items to cart
- Remove items from cart
- Update quantity
- View total cart value

### 4️ Order Management (Milestone-2)
- Place an order
- View order history

### 5️ Smart Dashboard (Milestone-2)
- Total money spent
- Total number of orders
- Category-wise spending insights

---

##  Tech Stack

### Frontend
- React (Vite)
- Axios / Fetch for API calls
- CSS / Tailwind (optional)

### Backend
- Node.js
- Express.js

### Database
- SQLite3

### ORM
- Prisma

### Testing
- Jest

### Deployment
- Backend → Render
- Frontend → Vercel

### Other
- CORS configuration for cross-origin requests

---

## Database Design (Prisma Models)

### User
- id (Primary Key)
- name
- email (Unique)
- password

### Product
- id (Primary Key)
- name
- price
- category
- createdAt

---

##  REST API Design

### Auth Routes
- POST /api/auth/register
- POST /api/auth/login

### Product Routes (Full CRUD)
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

---

##  Milestone Plan

###  Milestone-1

####  Backend
- Setup Express server
- Initialize Prisma
- Configure SQLite database
- Create Prisma models (User, Product)
- Run initial migration
- Implement authentication APIs
- Implement FULL CRUD REST API for Products

####  Frontend
- Setup React project using Vite
- Configure routing
- Create Login page
- Create Register page
- Implement protected routes
- Product listing page (data from backend)
- Add product functionality
- Edit product functionality
- Delete product functionality

####  Integration
- Connect frontend to backend
- Store and use JWT for authentication

---

###  Milestone-2 

####  Shopping Features
- Cart functionality
  - Add to cart
  - Remove from cart
  - Update quantity
  - Show total price

####  Order Management
- Place order
- Store order details in database
- View order history

#### Dashboard
- Total money spent
- Total number of orders
- Category-wise spending charts

####  Deployment
- Deploy backend on Render
- Deploy frontend on Vercel
- Configure environment variables
- Resolve CORS issues in production

####  Testing
- Write unit tests for APIs using Jest

---

##  Future Enhancements
- Admin panel for advanced product control
- Budget vs spending comparison
- AI-based product recommendation system
- Progressive Web App (PWA) support