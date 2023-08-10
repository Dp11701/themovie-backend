const express = require("express");
const router = express.Router();
const {
  getMovies,
  getTV,
  addFavoriteMovie,
  getFavoriteMovies,
} = require("../controllers/movieController");
const validateToken = require("../middleware/validateTokenHandler");

// Lấy danh sách phim và TV
router.get("/movies", getMovies);
router.get("/tv", getTV);

// Thêm phim vào danh sách yêu thích
router.post("/favorite", validateToken, addFavoriteMovie);

// Lấy danh sách các phim yêu thích
router.get("/favorites", validateToken, getFavoriteMovies);

module.exports = router;
