const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  bookAppointment,
  getUpcomingAppointments,
  getAppointmentHistory,
  cancelAppointment,
} = require('../controllers/appointmentController');

router.post('/book', protect, bookAppointment);
router.get('/upcoming', protect, getUpcomingAppointments);
router.get('/history', protect, getAppointmentHistory);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
