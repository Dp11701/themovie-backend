const express = require("express");
const router = express.Router();
const {
  getMovies,
  getTV,
  addFavoriteMovie,
  getFavoriteMovies,
  deleteFavoriteMovie,
  searchMovies,
  getMovieById,
  checkFavoriteMovie,
} = require("../controllers/movieController");
const {
  addComment,
  getCommentsAndRatingsByMovie,
} = require("../controllers/evaluateController");
const validateToken = require("../middleware/validateTokenHandler");

// Lấy danh sách phim và TV
router.get("/movies", getMovies);
router.get("/tv", getTV);
router.get("/movies/:id", getMovieById);
router.get("/search", searchMovies);

// Thêm phim vào danh sách yêu thích
router.post("/favorites", validateToken, addFavoriteMovie);

// Lấy danh sách các phim yêu thích
router.get("/favorites", validateToken, getFavoriteMovies);

// Check if a movie is a favorite
router.get("/favorites/check/:movieId", validateToken, checkFavoriteMovie);

// Thêm bình luận và đánh giá cho bộ phim
router.post("/comments", validateToken, addComment);

// Lấy danh sách bình luận và đánh giá cho bộ phim
router.get("/comments/:movieId", getCommentsAndRatingsByMovie);

router.delete("/favorites/:movieId", validateToken, deleteFavoriteMovie);

module.exports = router;
