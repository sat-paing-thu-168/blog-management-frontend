# 📝 Blog Management System

A **full-stack blog management application** built with **Spring Boot (backend)** and **React (frontend)**.  
It provides secure authentication using **JWT**, full **blog CRUD functionality**, and **soft delete support**.

This project demonstrates modern full-stack development with **REST APIs, authentication, pagination, filtering, and a responsive UI**.

---

# 🚀 Tech Stack

## 🔧 Backend

- **Java 17**
- **Spring Boot 3.1.5**
- **Spring Security** – Authentication & Authorization
- **Spring Data JPA** – Database operations
- **JWT (JSON Web Tokens)** – Token-based authentication
- **PostgreSQL** – Database
- **Maven** – Build tool
- **Lombok** – Reduce boilerplate code

---

## 🎨 Frontend

- **React 18** – UI library
- **Vite** – Fast build tool
- **React Router DOM 6** – Routing
- **Axios** – HTTP client
- **Bootstrap 5** – Styling
- **React Hook Form** – Form handling
- **Yup** – Validation

---

# ✨ Features

## ⚙️ Backend Features

- ✅ JWT Authentication with **access & refresh tokens**
- ✅ **User registration & login**
- ✅ **Password encryption** using BCrypt
- ✅ **Blog CRUD operations**
- ✅ **Soft delete** for blogs
- ✅ **Pagination & filtering**
- ✅ **Sorting by multiple fields**
- ✅ **Search by title & description**
- ✅ **User-specific blog access**
- ✅ **Input validation**
- ✅ **CORS configuration**
- ✅ **Global exception handling**

---

## 💻 Frontend Features

- ✅ **Responsive UI** using Bootstrap
- ✅ **JWT token storage & management**
- ✅ **Protected routes**
- ✅ **Token refresh interceptor**
- ✅ **Form validation**
- ✅ **User-friendly error handling**
- ✅ **Loading states**
- ✅ **Pagination controls**
- ✅ **Advanced filtering**
- ✅ **User-specific actions** (Edit/Delete only for owners)
- ✅ **Blog detail view**

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sat-paing-thu-168/blog-management-backend
git clone https://github.com/sat-paing-thu-168/blog-management-frontend
```

```bash
cd blog-management-backend
mvn clean install
```

```bash
cd blog-management-frontend
npm install
```

### ▶️ Running the Application

## Backend

```bash
mvn spring-boot:run
```

## Frontend

```bash
npm run dev
```
