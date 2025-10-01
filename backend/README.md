Backend setup:
cd backend
npm install
cp .env.example .env (update MONGO_URI and JWT_SECRET)
npm run seed
npm run dev
