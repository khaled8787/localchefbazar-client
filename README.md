# LocalChefBazar

## Project Purpose
LocalChefBazar একটি full-stack MERN-based web application যেখানে লোকাল শেফরা তাদের তৈরি খাবার লিস্ট করতে পারে এবং ইউজাররা সেই খাবার অর্ডার, রিভিউ ও ফেভারিট করতে পারে।  
এই প্রজেক্টে role-based system (User, Chef, Admin), secure authentication, payment system এবং dashboard-based management অন্তর্ভুক্ত করা হয়েছে।


**Frontend Live URL:** https://rococo-zuccutto-80d144.netlify.app/


## Key Features

## Authentication & Authorization
- Firebase Authentication (Email/Password & Google Login)
- JWT-based protected API routes
- Role-based access control (User, Chef, Admin)

## Meals & Orders
- Chef can add, update, and delete meals
- Users can view meals, sort by price
- Users can place orders
- Fraud users are restricted from ordering

## Payment System
- Stripe payment integration
- Secure payment intent creation
- Payment history stored in database

## Reviews & Favorites
- Users can add, update, and delete reviews
- Users can add meals to favorites
- Personal review & favorite management

## Admin Dashboard
- View all users, chefs, and orders
- Approve or reject role requests
- Mark users as fraud
- Platform statistics (users, orders, payments)

---

## Technologies & NPM Packages Used

## Frontend
- React
- React Router
- Tailwind CSS
- DaisyUI
- Axios
- TanStack React Query
- Firebase
- Stripe.js
- React Hook Form
- Framer Motion
- react-icons

###  Backend
- Node.js
- Express.js
- MongoDB
- JWT
- Stripe
- CORS
- dotenv

---

## Environment Variables

### Backend (.env)


## How to Run Locally
1. git clone https://github.com/khaled8787/localchefbazar.git
2. cd localchefbazar-client
3. npm install
4. npm start / npm run dev

