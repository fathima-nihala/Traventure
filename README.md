
# 🌍 Traventure - Travel Package Booking App (MERN Stack)

Traventure is a modern travel package booking web app built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to discover, customize, and book travel packages, while admins can manage offerings and monitor booking analytics. It supports both traditional email/password login and Google OAuth.

---

## ✨ Features

### 👤 User
- Register/Login with email or Google
- Search and sort travel packages
- View detailed package information
- Customize packages (Food, Accommodation)
- Live price calculation
- Book travel packages
- Update profile information and profile picture
- View bookings filtered by Upcoming, Active, Completed

### 🔧 Admin
- Secure admin login
- Add, edit, delete travel packages
- View all users and bookings
- Track booking counts per package
- Analyze package status (Upcoming, Active, Completed)

---

## 🔒 Authentication
- JWT-based session management
- Google OAuth 2.0 integration
- Role-based access control

---

## 🛠️ Tech Stack

```bash
Frontend: React.js, Tailwind CSS, Axios
Backend: Node.js, Express.js, MongoDB (Mongoose)
Authentication: JWT, Google OAuth 2.0
File Uploads: Multer (for profile picture uploads)
```

---

## 📁 Project Structure

```bash
Traventure/
├── client/               # React frontend
│   ├── components/       # Reusable components like ProfileForm
│   ├── pages/            # Pages like Home, ProfilePage
├── server/               # Express backend
│   ├── models/           # Mongoose models (User, Package, Booking)
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth middleware
│   └── uploads/          # Uploaded profile pictures
```

---

## 📦 API Highlights

```md
| Method | Endpoint             | Description                  |
|--------|----------------------|------------------------------|
| POST   | /api/register        | Register user                |
| POST   | /api/login           | Login with email/password    |
| POST   | /api/google-login    | Login with Google OAuth      |
| GET    | /api/user/me         | Get current user             |
| PUT    | /api/user/profile    | Update profile info & photo  |
| GET    | /api/packages/search | Search travel packages       |
| POST   | /api/book            | Book a travel package        |
```

---

## 🖥️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/fathima-nihala/traventure.git
cd traventure
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env # Set MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Live Demo

```md
Frontend: https://traventure.vercel.app
Backend API: https://api.traventure.com
```

---

## 📹 Demo Recording

- Email/Google login flow
- Admin dashboard (Add/Edit/Delete packages)
- Package customization and booking
- User profile update with image upload
- Booking list filter

---

## ✅ Submission Checklist

```md
[x] Public GitHub Repository
[x] Live hosting links (frontend + backend)
[x] Working login and booking flows
[x] README with instructions and demo
```

---

## ✍️ Author

```md
**Nihala**  
GitHub: [@fathima-nihala](https://github.com/fathima-nihala)  
Email: nihalafathima547@gmail.com
```




