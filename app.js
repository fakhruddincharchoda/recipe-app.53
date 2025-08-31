const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Bookmark = require("./Model/bookmark.js");
const app = express();
const router = express.Router();
const DB = process.env.DATABASE;
app.use(express.json());
console.log(DB);
mongoose.connect(DB).then((con) => {
  console.log("Db connection sucessful⭐");
});
app.use(
  cors({
    origin: "https://recipe-app53.netlify.app", // your frontend URL
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
router.get("/recipe/get/bookmarks", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.status(200).json({
      bookmarks,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: err.message });
  }
});
// DELETE with URL param
router.delete("/recipe/delete/bookmark/:id", async (req, res) => {
  try {
    const deleteBookmark = await Bookmark.findByIdAndDelete(req.params.id);

    if (!deleteBookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Bookmark deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/recipe/bookmark", async (req, res) => {
  const { id, image_url, title, servings, cooking_time, ingredients } =
    req.body;
  try {
    const bookmark = new Bookmark({
      id: id,
      image_url: image_url,
      title: title,
      servings: servings,
      cooking_time: cooking_time,
      ingredients: ingredients,
    });
    await bookmark.save();
    console.log(bookmark);
    res.status(201).json({
      message: "Bookmark Added",
      bookmark,
    });
  } catch (err) {
    console.error(err);
  }
});
app.use(router);
app.listen(8000, () => console.log("server has started"));
module.exports = app;
