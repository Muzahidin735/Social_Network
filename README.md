# Social Network Application

A full-stack social networking application built using **Django REST Framework** for the backend and **React** for the frontend.  
This project focuses on secure authentication, clean API design, and proper frontend–backend integration.

## 🚀 Features
- User authentication using JWT (access & refresh tokens)
- Login and signup functionality
- Secure protected routes
- User profile management with profile picture upload
- Create and delete posts
- Like and dislike posts
- Real-time update of like/dislike counts
- Token refresh handling
- Automatic logout on session expiry
- Clean separation of frontend and backend

## 🛠 Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT

### Frontend
- React
- Axios
- React Router

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Muzahidin735/social_network.git
cd social_network

```
---

### 2️⃣ Backend Setup (Django)
```bash
python -m venv my_env
my_env\Scripts\activate    # Windows
my_env/bin/activate        # macOS/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Backend runs at: http://127.0.0.1:8000
```

### 3️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm start
Frontend runs at: http://localhost:5173/
```
---
## 🧪 Sample API Endpoints
```bash
POST /api/login/          – User login
POST /api/signup/         – User registration
GET  /api/profile/        – Fetch logged-in user profile
PATCH /api/profile/       – Update profile details
POST /api/posts/          – Create a post
GET  /api/posts/          – Fetch all posts
POST /api/posts/<id>/like/    – Like a post
POST /api/posts/<id>/dislike/ – Dislike a post
DELETE /api/posts/<id>/delete/ – Delete own post
```
---
## 🧠 Skills Learned
- Building RESTful APIs using Django REST Framework
- Implementing JWT authentication with access and refresh tokens
- Handling token expiration and automatic logout
- Writing secure and protected backend endpoints
- Managing React state and re-fetching data correctly
- Integrating frontend with backend using Axios
- Using Axios interceptors for authentication
- Debugging full-stack issues across React and Django
- Structuring a full-stack project professionally
- Using Git and GitHub with proper .gitignore practices
