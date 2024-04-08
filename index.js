import express from "express";
import cors from "cors";
import login from "./src/routes/login.js";
import user from "./src/routes/user.js";
import video from "./src/routes/video.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

var port = process.env.PORT || 4001;
var MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", user);
app.use("/api/video", video);
app.use("/api/login", login);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => console.log(err));




