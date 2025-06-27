const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "https://my-social-app-frontend0803.netlify.app/", // ✅ Replace with your actual Netlify URL
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/authRoutes"));
// Later: app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
