import express from 'express';
import cors from "cors";
import login from "./src/routes/login.js";
import user from "./src/routes/user.js";
import video from "./src/routes/video.js";

var port = process.env.PORT || 4001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/user", user);
app.use("/api/video", video);
app.use("/api/login", login);


app.listen(port, () => {console.log(`Server started on port ${port}`)});