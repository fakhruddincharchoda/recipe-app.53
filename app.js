const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Bookmark = require("./Model/bookmark.js");
const app = express();
const router = express.Router();

const DB = process.env.DATABASE;
const {
  getBookmark,
  postBookmark,
  deleteBookmark,
  getUserBookmarks,
  addBookmarks,
} = require("./controllers/bookmarkContoller.js");
const { signup, login, protect } = require("./controllers/userController.js");
app.use(express.json());
console.log(DB);
mongoose.connect(DB).then((con) => {
  console.log("Db connection sucessful⭐");
});

app.use(
  cors({
    origin: "https://recipe-app53.netlify.app", // your frontend URL
  })
);
// ********* Bookmark routes ********
router.get("/recipe/get/bookmarks", getBookmark);
// DELETE with URL param
router.delete("/recipe/delete/bookmark/:id", deleteBookmark);
// ********** Signup and SignIn routes ************
router.post("/recipe/signUp", signup);
router.post("/recipe/login", login);
// ********* routes for Get bookMark of users
router.post("/user/bookmark", protect, addBookmarks);
router.get("/user/getbookmark", protect, getUserBookmarks);
app.use("/", router);
app.listen(8000, () => console.log("server has started"));
module.exports = app;
