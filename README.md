# 🏡 Stayly

<p align="center">
  <b>Modern Full-Stack Real Estate Listing Platform</b><br />
  Create, manage, and discover property listings with secure authentication, cloud image uploads, and powerful search.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-overview">API</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## 📌 Overview

**Stayly** is a MERN-style real estate platform where users can:

* 🔐 Sign up & sign in securely using JWT
* 🏠 Create and manage property listings
* 🖼️ Upload multiple images via Cloudinary
* 🔍 Search listings with filters & sorting
* 📞 Contact listing owners directly

---

## ✨ Features

### 🔐 Authentication

* JWT-based authentication with `httpOnly` cookies
* Protected routes & secure user actions

### 🏠 Listings

* Full CRUD operations (Create, Read, Update, Delete)
* Advanced search with:

  * Filters
  * Sorting
  * Pagination

### 🖼️ Media Uploads

* Multi-image upload (max 6 images)
* Cloudinary integration for storage

### 👤 User Profile

* Update user details (name, email, password, phone, avatar)
* Delete account & logout

### ⚡ Frontend Experience

* React + Redux Toolkit
* Persistent authentication state
* Fully responsive UI (TailwindCSS)

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* React Router
* Redux Toolkit + redux-persist
* TailwindCSS
* Axios
* Swiper

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT + cookie-parser
* Multer
* Cloudinary
* CORS + dotenv

> ⚠️ Twilio config exists but is not fully integrated yet.

---

## ⚡ Quick Start

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Sufiyan959/stayly_new.git
cd stayly_new
```

### 2️⃣ Install Dependencies

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 3️⃣ Setup Environment Variables

Create `.env` in root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/stayly
JWT_SECRET=your_secret_key
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_FOLDER=stayly

TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

---

### 4️⃣ Run Application

```bash
# Backend
npm run dev
```

```bash
# Frontend
cd client
npm run dev
```

---

### 🌐 Access App

* Frontend → http://localhost:5173
* Backend → http://localhost:3000

---

## 📡 API Overview

### 🔐 Auth (`/api/auth`)

* POST `/signup`
* POST `/signin`
* GET `/signout`
* GET `/me` (protected)

### 👤 User (`/api/user`)

* POST `/update/:id`
* DELETE `/delete/:id`
* GET `/listings/:id`
* GET `/:id`

### 🏠 Listing (`/api/listing`)

* POST `/create`
* DELETE `/delete/:id`
* POST `/update/:id`
* GET `/get/:id`
* GET `/get`
* POST `/upload` (images up to 6)

---

## 📁 Project Structure

```bash
stayly/
├── api/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── main.jsx
│   └── vite.config.js
│
├── package.json
└── README.md
```

---

## 🔒 Security

* Do NOT commit `.env`
* Rotate secrets if exposed
* Use strong JWT secret

---

## 🚀 Future Improvements

* 💳 Payment Integration
* ⭐ Reviews & Ratings
* 📍 Google Maps Integration
* 📱 Better Mobile UI
* 🔔 Notifications System

---

## 👨‍💻 Author

**Mohammad Sufiyan Sami**

* 💻 Full Stack Developer (MERN)
* 🚀 Passionate about building real-world applications

---

## ⭐ Support

If you like this project:

👉 Give it a **star ⭐ on GitHub**
👉 Share it with others

---

## 📄 License

ISC
