const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const adminMiddleware = require("./middleware/adminMiddleware");
const connectDb = require("./config/dbConection");
const dotenv = require("dotenv").config();
const Users = require("./models/userModel"); // Import User model (đảm bảo đúng đường dẫn)

connectDb();
const app = express();

const port = process.env.PORT || 5000;

// Cors middleware
const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  exposedHeaders: "X-Total-Count",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));

// Route để lấy danh sách người dùng và thiết lập header X-Total-Count
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
