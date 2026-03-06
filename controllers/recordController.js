const Record = require('../models/Record');

// @desc  Get all medical records for user
// @route GET /api/records
const getRecords = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Upload/add a medical record
// @route POST /api/records/upload
const uploadRecord = async (req, res) => {
  try {
    const { title, type, description, date } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Record title is required' });
    }

    const record = await Record.create({
      user: req.user._id,
      title,
      type: type || 'Other',
      description,
      date: date ? new Date(date) : new Date(),
      fileName: req.file ? req.file.originalname : '',
      filePath: req.file ? req.file.path : '',
    });

    res.status(201).json({ success: true, message: 'Record uploaded successfully', record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete a medical record
// @route DELETE /api/records/:id
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRecords, uploadRecord, deleteRecord };
