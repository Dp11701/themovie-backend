const express = require("express");
const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");

const adminMiddleware = asyncHandler(async (req, res, next) => {
  // Giả sử rằng req.user chứa thông tin về người dùng hiện tại
  const user = req.user;

  if (user && user.isAdmin) {
    // Nếu người dùng hiện tại là admin, tiếp tục xử lý request
    next();
  } else {
    // Nếu người dùng hiện tại không phải là admin, trả về lỗi
    res.status(403).json({ error: "ccess denied" });
  }
});

module.exports = adminMiddleware;
