const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const protect = async (req, res, next) => { /* ... */ };
module.exports = { protect };
// ... paste the full authMiddleware.js code here ...