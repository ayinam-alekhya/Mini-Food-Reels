# 🍽️ FoodReels

A lightweight Instagram-style **vertical reels app** for food videos.  
Users can **register/login**, scroll a **snap-to-screen feed**, **like**, **save**, and **view saved** reels.  
Food Partners can **upload videos** which instantly appear on the Home feed.

---

## ✨ Features

- 📱 **Vertical Reels** with `scroll-snap` for smooth, full-screen video feed  
- ▶️ **Autoplay / Pause** via `IntersectionObserver`  
- ❤️ **Like**, 💾 **Save**, 💬 **Comment** actions with optimistic UI updates  
- 🔖 **Saved Feed** with the same scroll & video interactions  
- 👨‍🍳 **Food Partner Uploads** (via Multer + ImageKit)  
- 🧭 **Bottom Navigation Bar** (Home / Saved)  
- 🎨 **Mobile-first UI** optimized for accessibility  

---

## 🧩 Tech Stack

**Frontend:** React (Vite), Axios, CSS Modules  
**Backend:** Node.js, Express, Mongoose, Multer  
**Database:** MongoDB (Mongoose models: `User`, `Food`, `Save`, `Like`)  
**File Storage:** ImageKit (for hosting uploaded videos)  
**Auth:** JWT (stored in HttpOnly cookies)

---

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
git clone https://github.com/ayinam-alekhya/Mini-Food-Reels.git
cd Mini-Food-Reels

# install frontend & backend dependencies
cd frontend && npm install
cd ../backend && npm install
```

---

### 2️⃣ Configure Environment Variables

Create `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<your_mongo_connection>
JWT_SECRET=super-secret

# ImageKit Keys
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your_id>
```

---

### 3️⃣ Run the App

Start backend and frontend in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

- Frontend → http://localhost:5173  
- Backend API → http://localhost:3000  

---

## 🗂️ Folder Structure

```
Mini-Food-Reels/
├─ frontend/
│  ├─ src/
│  │  ├─ components/BottomNav.jsx
│  │  ├─ pages/
│  │  │  ├─ general/Home.jsx
│  │  │  ├─ general/Saved.jsx
│  │  │  ├─ foodPatner/Profile.jsx
│  │  │  └─ auth/{UserLogin,UserRegister,FoodPartnerLogin,FoodPartnerRegister}.jsx
│  │  └─ styles/{reels.css,saved.css,profile.css}
│  └─ ...
├─ backend/
│  ├─ src/
│  │  ├─ controller/food.controller.js
│  │  ├─ models/{user.model.js,food.model.js,save.model.js,like.model.js}
│  │  ├─ routes/{food.routes.js,auth.routes.js}
│  │  └─ services/storage.service.js
│  └─ server.js
└─ Demonstration_videos/
   ├─ UserRegisterLogin.mp4
   └─ FoodPartnerRegisterLogin.mp4
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/food` | Upload new food video (partner only) |
| `GET` | `/api/food` | Get all food reels (public) |
| `POST` | `/api/food/like` | Toggle like/unlike on a reel |
| `POST` | `/api/food/save` | Toggle save/unsave on a reel |
| `GET` | `/api/food/saved` | Get saved food videos for logged-in user |

---

## 🔐 Authentication

- JWT issued at login, stored in **HttpOnly cookie**  
- `axios.defaults.withCredentials = true` used for all requests  
- Protected endpoints require `authUserMiddleware`

---

## 🧪 UI/UX Highlights

- Smooth **scroll-snap** for vertical feed  
- **Autoplay** only when video is in view  
- Overlays and buttons spaced above bottom nav  
- Simple CSS with **backdrop blur** and **glassmorphism effects**  
- Responsive design for all mobile sizes  

---
## 📸 Application Demonstration

### 🎥 Demo Videos
Explore key functionalities through short demonstration clips:

- **Food Partner Registration & Login** — [`FoodPartnerRegisterLogin.mp4`](./Food_Reels/FoodPartnerRegisterLogin.mp4)
- **User Registration & Login** — [`UserRegisterLogin.mp4`](./Food_Reels/UserRegisterLogin.mp4)

> These videos highlight the authentication process for both users and food partners.

---

### 🖼️ Application Screenshots

Below are some visual highlights of the application's user interface and major workflows.  
All screenshots are available inside the [`Application_Screenshots`](./Food_Reels/Application_Screenshots/) folder.

| Screen | Description |
|--------|--------------|
| ![User Register](./Food_Reels/Application_Screenshots/User_Register.png) | User Registration Page |
| ![User Login](./Food_Reels/Application_Screenshots/User_Login.png) | User Login Page |
| ![Home Page](./Food_Reels/Application_Screenshots/Home_page.png) | Video Feed Home Page |
| ![Video Saved Liked](./Food_Reels/Application_Screenshots/Video_saved_liked.png) | Liked/Saved Video View |
| ![Saved Feed](./Food_Reels/Application_Screenshots/Saved_feed.png) | Saved Feed Section |
| ![Visit Store Profile](./Food_Reels/Application_Screenshots/Visit_store_Profile_Page.png) | Visit Store / Profile Page |
| ![Food Partner Register](./Food_Reels/Application_Screenshots/Food_patner_Register.png) | Food Partner Registration |
| ![Food Partner Login](./Food_Reels/Application_Screenshots/Food_patner_Login.png) | Food Partner Login |
| ![Uploading Video](./Food_Reels/Application_Screenshots/Uploading_video.png) | Uploading a New Video |
| ![After Upload](./Food_Reels/Application_Screenshots/After_video_Upload.png) | Feed After Successful Upload |

> Each screenshot captures a specific interaction flow, demonstrating the app’s end-to-end experience.

## ☁️ Deployment Tips

- Use **Nginx reverse proxy** for `/api` → Express backend  
- Configure ImageKit **CORS** to match your frontend domain  
- For production builds:  
  ```bash
  cd frontend
  npm run build
  ```
  Then serve the `dist/` folder through your Node or hosting platform.

---

## 🧑‍💻 Author

**Alekhya Ayinam**  
🌐 [GitHub Profile](https://github.com/ayinam-alekhya)

---

## 📜 License

MIT License © 2025 Alekhya Ayinam
