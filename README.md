# EventEase

EventEase is a full-stack event management application that allows users to browse, book, and manage events seamlessly. Built with **React Native** for the frontend and **Node.js + Express + MongoDB** for the backend.

---

## Features

- **User Authentication**: Register and login using email and password.
- **Event Browsing**: View a list of available events with details such as title, description, date, location, and price.
- **Event Booking**: Book events and manage your bookings.
- **Admin Panel**: Add, edit, and remove events (backend admin functionality).
- **Persistent Login**: Uses JWT and AsyncStorage for session management.
- **Cross-Platform**: Works on Android and iOS via React Native.

---

## Tech Stack

**Frontend:**

- React Native
- React Navigation
- Axios / Fetch API
- AsyncStorage

**Backend:**

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

**Other Tools:**

- Expo for mobile app development
- Git and GitHub for version control

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Expo CLI
- MongoDB Atlas account or local MongoDB

### Setup

#### Backend

1. Navigate to the backend folder:

```bash
cd backend
Install dependencies:

bash
Copy code
npm install
Create a .env file (based on .env.example) with your MongoDB URI and JWT secret.

Seed initial data:

bash
Copy code
node seed.js
Start the server:

bash
Copy code
npm run dev
Frontend
Navigate to the frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Start the app:

bash
Copy code
npx expo start
Run on Android/iOS simulator or physical device.

Project Structure
css
Copy code
EventEase/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── server.js
│   └── seed.js
└── frontend/
    ├── src/
    │   ├── screens/
    │   ├── components/
    │   └── context/
    └── App.js
