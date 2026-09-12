const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/email');

const generateToken = (id, secret, expire) =>
  jwt.sign({ id }, secret, { expiresIn: expire });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  if (await User.findOne({ email })) throw new ApiError(400, 'Email already exists');
  const allowedRole = ['admin', 'teacher', 'student'].includes(role) ? role : 'student';
  const user = await User.create({ name, email, password, role: allowedRole, phone });
  const token = generateToken(user._id, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
  ApiResponse.success(res, { user, token }, 'Registered successfully', 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  if (!user.isActive) throw new ApiError(403, 'Account deactivated');
  const token = generateToken(user._id, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
  const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRE);
  ApiResponse.success(res, { user, token, refreshToken }, 'Login successful');
});

exports.me = asyncHandler(async (req, res) => {
  ApiResponse.success(res, req.user, 'Profile fetched');
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(401, 'Refresh token required');
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const token = generateToken(decoded.id, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
    ApiResponse.success(res, { token }, 'Token refreshed');
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(404, 'User not found');
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  ApiResponse.success(res, null, 'Reset email sent');
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired token');
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  ApiResponse.success(res, null, 'Password reset successful');
});