const asyncHandler = require("express-async-handler");
const Comment = require("../models/evaluateModel");

//@desc Thêm bình luận cho bộ phim
//@route POST /api/movies/comments
//@access private
const addComment = asyncHandler(async (req, res) => {
  try {
    const { movieId, content } = req.body;
    const userId = req.user.id; // Lấy id của người dùng từ token

    const comment = await Comment.create({
      userId,
      movieId,
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

//@desc Lấy danh sách bình luận và đánh giá cho bộ phim
//@route GET /api/movies/comments/:movieId
//@access public
const getCommentsAndRatingsByMovie = asyncHandler(async (req, res) => {
  try {
    const movieId = req.body.movieId;

    const comments = await Comment.find({ movieId }).populate(
      "userId",
      "username"
    );
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

module.exports = { addComment, getCommentsAndRatingsByMovie };
