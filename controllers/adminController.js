const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");

const convertUser = (user) => {
  let userObject = user.toObject();
  userObject.id = userObject._id;
  delete userObject._id;
  return userObject;
}

const getUsers = asyncHandler(async (req, res) => {
  const users = await Users.find({});
  res.json(users.map(convertUser));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (user) {
    res.json(convertUser(user));
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id; // Lấy id của người dùng từ URL

    if (!userId) {
      res.status(400);
      throw new Error("User ID is required");
    }

    const user = await Users.findByIdAndDelete(userId);

    if (user) {
      res.status(200).json({ message: "User deleted successfully", user: convertUser(user) });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();

    if(updatedUser){
        res.json(convertUser(updatedUser));
    } else {
        res.status(404).json({ error: 'User not found' });
    }
    
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
