const fetch = require("node-fetch");
const asyncHandler = require("express-async-handler");
const FavoriteMovie = require("../models/favoriteMovie");
const dotenv = require("dotenv").config();
const User = require("../models/userModel");

//@desc GET the movie TMDb API
//@route GET /api/movies
//@access private
const getMovies = asyncHandler(async (req, res) => {
  const url =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//@desc GET the movie TMDb API by id
//@route GET /api/movies/:id
//@access private

const getMovieById = asyncHandler(async (req, res) => {
  const movieId = req.params.id; // Lấy ID phim từ đường dẫn
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//@desc GET the TV TMDb API
//@route GET /api/movies
//@access private

const getTV = asyncHandler(async (req, res) => {
  const url =
    "https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc";
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//@desc ADD favorite movie
//@route POST /api/movies/favorite
//@access private
const addFavoriteMovie = asyncHandler(async (req, res) => {
  try {
    const { movieId } = req.body;
    const email = req.user.email; // Lấy id của người dùng từ token

    if (!movieId) {
      res.status(400);
      throw new Error("All fields are mandatory !");
    }

    const movieAvailable = await FavoriteMovie.findOne({ email, movieId });

    if (movieAvailable) {
      res.status(400);
      throw new Error("Phim đã được đánh dấu thích trước đó");
    }

    const favorite = await FavoriteMovie.create({
      email,
      movieId,
    });
    console.log("Added favorite movie:", favorite);

    if (favorite) {
      res.status(201).json({ movieId: favorite.movieId });
    } else {
      console.log("Favorite movie creation failed");
      res.status(400);
      throw new Error("movie data is not valid");
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

//@desc GET the movie search
//@route GET /api/movies/search
//@access private
const searchMovies = asyncHandler(async (req, res) => {
  const query = encodeURIComponent(req.query.q); // Mã hóa từ khóa tìm kiếm
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//@desc GET the movie favorite
//@route GET /api/movies/favorites
//@access private
const getFavoriteMovies = asyncHandler(async (req, res) => {
  try {
    const email = req.user.email; // Lấy email người dùng từ token

    // Lấy danh sách các bộ phim yêu thích của người dùng
    const favoriteMovies = await FavoriteMovie.find({ email });

    // Lấy dữ liệu các bộ phim từ API của TMDb
    const url =
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
    const apiKey = process.env.TMDB_API_KEY;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    // So sánh movieId và lưu các bộ phim trùng khớp vào mảng matchedMovies
    const matchedMovies = [];
    for (const movie of data.results) {
      if (
        favoriteMovies.some((favorite) => favorite.movieId === String(movie.id))
      ) {
        matchedMovies.push(movie);
      }
    }

    res.json(matchedMovies);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

//@desc DELETE favorite movie
//@route DELETE /api/movies/favorite/:movieId
//@access private
const deleteFavoriteMovie = asyncHandler(async (req, res) => {
  try {
    const { movieId } = req.body;
    const email = req.user.email; // Lấy id của người dùng từ token
    console.log(email);

    if (!movieId) {
      res.status(400);
      throw new Error("Movie ID is required");
    }

    const favorite = await FavoriteMovie.findOneAndDelete({ email, movieId });

    if (favorite) {
      res.status(200).json({ message: "Favorite movie deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Favorite movie not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});
//@desc Check if a movie is a favorite
//@route GET /api/movies/favorite/check/:movieId
//@access private
const checkFavoriteMovie = asyncHandler(async (req, res) => {
  try {
    const { movieId } = req.params;
    const email = req.user.email; // Get user email from token

    if (!movieId) {
      res.status(400);
      throw new Error("Movie ID is required");
    }

    const favorite = await FavoriteMovie.findOne({ email, movieId });

    if (favorite) {
      res.status(200).json({ isFavorite: true });
    } else {
      res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

module.exports = {
  getMovies,
  getTV,
  addFavoriteMovie,
  getFavoriteMovies,
  deleteFavoriteMovie,
  searchMovies,
  getMovieById,
  checkFavoriteMovie,
};
