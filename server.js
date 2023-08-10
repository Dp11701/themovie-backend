const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConection");
const cors = require("cors");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;

// Cors middleware
const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
