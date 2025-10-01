const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const generateEventId = require('../utils/eventId');
const { format } = require('date-fns');

// GET /api/events - list events with optional filters
router.get('/', async (req, res) => {
  const { category, locationType, startDate, endDate, q, page = 1, limit = 50 } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (locationType) filter.locationType = locationType;
  if (startDate || endDate) {
    filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate);
    if (endDate) filter.startDate.$lte = new Date(endDate);
  }
  if (q) filter.title = { $regex: q, $options: 'i' };

  try {
    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const now = new Date();
    const withMeta = events.map((e) => {
      const sd = new Date(e.startDate);
      const ed = new Date(e.endDate || e.startDate);

      let status = 'Upcoming';
      if (sd <= now && ed >= now) status = 'Ongoing';
      else if (ed < now) status = 'Completed';

      return {
        id: e._id,
        eventId: e.eventId,
        title: e.title,
        description: e.description,
        category: e.category,
        locationType: e.locationType,
        location: e.location,
        startDate: format(sd, 'dd-MMM-yyyy'),
        endDate: format(ed, 'dd-MMM-yyyy'),
        capacity: e.capacity,
        status,
      };
    });

    res.json(withMeta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/events - create new event (Admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.category || !data.startDate || !data.capacity) {
      return res.status(400).json({ message: 'Title, category, startDate, and capacity are required' });
    }

    data.eventId = generateEventId(new Date(data.startDate));
    const ev = new Event(data);
    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/events/:id - update event (Admin only)
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/events/:id - delete event (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
