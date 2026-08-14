const CompanyInfo = require('../models/CompanyInfo');

/**
 * GET /api/company
 * Public - Returns the singleton company info document.
 * Uses getOrCreate() to ensure a document always exists.
 */
const getCompanyInfo = async (req, res, next) => {
  try {
    const company = await CompanyInfo.getOrCreate({
      name: 'FreshFlock Farms',
    });
    res.json(company);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/company
 * Auth protected - Updates the singleton company info document.
 * Accepts any combination of: name, tagline, phone, email, address, founded.
 */
const updateCompanyInfo = async (req, res, next) => {
  try {
    const { name, tagline, phone, email, address, founded } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (founded !== undefined) updateData.founded = founded;

    const company = await CompanyInfo.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(company);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCompanyInfo,
  updateCompanyInfo,
};
