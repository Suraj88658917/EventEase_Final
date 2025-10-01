const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
app.use(cors());

let users = []; // {id, name, email, password, role}
let events = [
  { _id: '1', title: 'React Conference', category: 'Tech', location: 'Online', date: '2025-10-10', capacity: 50 },
  { _id: '2', title: 'Jazz Night', category: 'Music', location: 'In-Person', date: '2025-10-12', capacity: 30 }
];
let bookings = []; // {id, userId, eventId, seats, status}

const SECRET = 'secretkey';

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if(users.find(u=>u.email===email)) return res.status(400).json({message:'Email already exists'});
  const newUser = { id: Date.now().toString(), name, email, password, role:'user' };
  users.push(newUser);
  res.json({ message: 'Registered successfully' });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if(!user) return res.status(400).json({message:'Invalid credentials'});
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
  res.json({ user, token });
});

// Get events
app.get('/api/events', (req, res) => res.json(events));
app.get('/api/events/:id', (req,res)=>res.json(events.find(e=>e._id===req.params.id)));

// Bookings
app.post('/api/bookings', (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message:'Unauthorized'});
  const decoded = jwt.verify(token, SECRET);
  const { eventId } = req.body;
  const newBooking = { id: Date.now().toString(), userId: decoded.id, eventId, seats:1, status:'Confirmed' };
  bookings.push(newBooking);
  res.json(newBooking);
});

// Get user bookings
app.get('/api/bookings/me', (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message:'Unauthorized'});
  const decoded = jwt.verify(token, SECRET);
  const userBookings = bookings.filter(b=>b.userId===decoded.id).map(b=>({
    ...b,
    title: events.find(e=>e._id===b.eventId).title
  }));
  res.json(userBookings);
});

// Start server
app.listen(5000, ()=>console.log('Server running on port 5000'));
