const Appointment = require('../models/Appointment');

// @desc  Book a new appointment
// @route POST /api/appointments/book
const bookAppointment = async (req, res) => {
  try {
    const { doctorName, specialty, date, timeSlot, notes } = req.body;

    if (!doctorName || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Doctor name, date and time slot are required' });
    }

    const appointmentDate = new Date(date);

    // Clash detection: check if same doctor has the same date+timeSlot booked
    const clash = await Appointment.findOne({
      doctorName,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lte: new Date(appointmentDate.setHours(23, 59, 59, 999)),
      },
      timeSlot,
      status: { $in: ['Confirmed', 'Pending'] },
    });

    if (clash) {
      return res.status(409).json({ success: false, message: 'This slot is already booked. Please choose another time.' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      doctorName,
      specialty,
      date: new Date(date),
      timeSlot,
      notes,
    });

    res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get upcoming appointments
// @route GET /api/appointments/upcoming
const getUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      user: req.user._id,
      date: { $gte: today },
      status: { $in: ['Confirmed', 'Pending'] },
    }).sort({ date: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get appointment history
// @route GET /api/appointments/history
const getAppointmentHistory = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      user: req.user._id,
      $or: [
        { date: { $lt: today } },
        { status: { $in: ['Completed', 'Cancelled'] } },
      ],
    }).sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Cancel an appointment
// @route PUT /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { bookAppointment, getUpcomingAppointments, getAppointmentHistory, cancelAppointment };
