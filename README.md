# 🍽️ FoodReels

FoodReels is a MERN Stack application where users can explore food videos in a vertical reel format — similar to Instagram Reels or TikTok.  
Users can like, save, and view food items posted by food partners.

---

## 🚀 Features

### 👥 User Features
- View vertical food reels with auto-play & scroll snapping
- Like and unlike a food video
- Save & unsave videos to Saved list
- View all saved videos in a reels feed
- Visit food partner profile from reels

### 🍽️ Food Partner Features
- Register/Login as Food Partner
- Create and upload food videos with description
- View profile with all uploaded videos in grid format

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|----------------|
| Frontend | React.js, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Cookies |

---

## 📂 Folder Structure

```
FoodReels/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controller/
│   │   ├── middleware/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── styles/
    │   ├── App.jsx
    │   └── AppRoutes.jsx
    └── package.json
```

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repo
```
git clone <repo-url>
cd FoodReels
```

### 2️⃣ Backend Setup
```
cd backend
npm install
npm start
```

> Make sure you add your `.env` file (MongoDB URI, JWT Secret)

### 3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` in backend:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## 📍 Routes Overview

### User Auth
| Method | Route | Description |
|--------|--------|----------------|
| POST | /api/user/register | Register User |
| POST | /api/user/login | Login User |

### Food Partner Auth
| Method | Route | Description |
|--------|--------|----------------|
| POST | /api/food-partner/register | Register Food Partner |
| POST | /api/food-partner/login | Login Food Partner |

### Food & Saved
| Method | Route | Description |
|--------|--------|----------------|
| GET | /api/food | Get all food reels |
| POST | /api/food/save | Save/Unsave food |
| GET | /api/food/saved | Get saved food reels |
| POST | /api/food/like | Like/Unlike food |

---

## ✨ Future Enhancements

- Add comments section  
- Enable following of food partners  
- Add notifications for likes & saves  
- Add chat support between users & food partners  

---

## 📜 License

This project is for educational and learning purposes.
