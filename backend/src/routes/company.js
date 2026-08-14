const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCompanyInfo,
  updateCompanyInfo,
} = require('../controllers/companyController');

const router = express.Router();

// GET /api/company - Public, returns company info
router.get('/', getCompanyInfo);

// PUT /api/company - Auth protected, update company info
router.put('/', protect, updateCompanyInfo);

module.exports = router;
