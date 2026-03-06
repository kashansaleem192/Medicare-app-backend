const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { getRecords, uploadRecord, deleteRecord } = require('../controllers/recordController');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/', protect, getRecords);
router.post('/upload', protect, upload.single('file'), uploadRecord);
router.delete('/:id', protect, deleteRecord);

module.exports = router;
