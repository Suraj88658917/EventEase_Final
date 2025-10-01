const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Booking logger middleware
const bookingLogger = (req, res, next) => {
  if (req.method === 'POST') {
    const userEmail = req.user ? req.user.email : 'anonymous';
    console.log(`[Booking] ${userEmail} - ${new Date().toISOString()} - ${JSON.stringify(req.body)}`);
  }
  next();
};

// Create a booking
router.post('/', authenticate, bookingLogger, async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    if (!eventId || !seats) return res.status(400).json({ message: 'eventId and seats required' });
    if (seats > 2) return res.status(400).json({ message: 'Max 2 seats per user' });

    const ev = await Event.findOne({ eventId });
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    // Check total booked seats
    const agg = await Booking.aggregate([
      { $match: { event: ev._id, status: 'CONFIRMED' } },
      { $group: { _id: '$event', total: { $sum: '$seats' } } },
    ]);
    const booked = (agg[0] && agg[0].total) || 0;
    if (booked + seats > ev.capacity) return res.status(400).json({ message: 'Event full or not enough seats' });

    // Check user’s existing bookings for this event
    const existing = await Booking.findOne({ user: req.user._id, event: ev._id, status: 'CONFIRMED' });
    const existingSeats = existing ? existing.seats : 0;
    if (existingSeats + seats > 2)
      return res.status(400).json({ message: 'User can hold max 2 seats total for event' });

    const b = new Booking({ user: req.user._id, event: ev._id, seats });
    await b.save();

    res.json({ message: 'Booked', bookingId: b._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user bookings
router.get('/me', authenticate, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event')
    .sort({ createdAt: -1 });

  res.json(
    bookings.map((b) => ({
      id: b._id,
      eventId: b.event.eventId,
      title: b.event.title,
      startDate: b.event.startDate,
      seats: b.seats,
      status: b.status,
      createdAt: b.createdAt,
    }))
  );
});

// Cancel a booking
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id).populate('event');
    if (!b) return res.status(404).json({ message: 'Booking not found' });

    if (String(b.user) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    const now = new Date();
    if (new Date(b.event.startDate) <= now)
      return res.status(400).json({ message: 'Cannot cancel past or ongoing event' });

    b.status = 'CANCELLED';
    await b.save();
    res.json({ message: 'Cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get attendees for an event
router.get('/event/:eventId/attendees', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const ev = await Event.findOne({ eventId: req.params.eventId });
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    const attendees = await Booking.find({ event: ev._id, status: 'CONFIRMED' }).populate('user');

    res.json(
      attendees.map((a) => ({
        name: a.user.name,
        email: a.user.email,
        seats: a.seats,
        bookedAt: a.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
