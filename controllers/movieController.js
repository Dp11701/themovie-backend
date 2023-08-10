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
    console.log(userId);

    if (!movieId) {
      res.status(400);
      throw new Error("All fields are mandatory !");
    }

    const movieAvailable = await FavoriteMovie.findOne({ movieId });

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
//@desc GET the movie favorite
//@route GET /api/movies/favorites
//@access private
const getFavoriteMovies = asyncHandler(async (req, res) => {
  try {
    const _id = req.user.id; // Lấy id người dùng từ token

    const favoriteMovies = await FavoriteMovie.find({ userId });

    res.status(200).json(favoriteMovies);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});
module.exports = { getMovies, getTV, addFavoriteMovie, getFavoriteMovies };