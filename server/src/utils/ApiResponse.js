class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, data, message });
  }
  static error(res, message = 'Error', statusCode = 500, errors = []) {
    return res.status(statusCode).json({ success: false, data: null, message, errors });
  }
}
module.exports = ApiResponse;