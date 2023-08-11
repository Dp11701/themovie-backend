const express = require("express");
const router = express.Router();
const {
  getMovies,
  getTV,
  addFavoriteMovie,
  getFavoriteMovies,
} = require("../controllers/movieController");
const {
  addComment,
  getCommentsAndRatingsByMovie,
} = require("../controllers/evaluateController");
const validateToken = require("../middleware/validateTokenHandler");

// Lấy danh sách phim và TV
router.get("/movies", getMovies);
router.get("/tv", getTV);

// Thêm phim vào danh sách yêu thích
router.post("/favorite", validateToken, addFavoriteMovie);

// Lấy danh sách các phim yêu thích
router.get("/favorites", validateToken, getFavoriteMovies);
// Thêm bình luận và đánh giá cho bộ phim
router.post("/comments", validateToken, addComment);

// Lấy danh sách bình luận và đánh giá cho bộ phim
router.get("/comments/:movieId", getCommentsAndRatingsByMovie);

module.exports = router;
