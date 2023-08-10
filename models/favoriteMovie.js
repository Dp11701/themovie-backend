const mongoose = require("mongoose");
const Users = require("./userModel");

const favoriteMovieSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      ref: "Users",
    },
    movieId: {
      type: String,
      required: [true, "Please add a movieId"],
    },
  },
  { _id: false },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FavoriteMovie", favoriteMovieSchema);
