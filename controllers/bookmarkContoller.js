const Bookmark = require("../Model/bookmark");
const getBookmark = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.status(200).json({
      bookmarks,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: err.message });
  }
};
const deleteBookmark = async (req, res) => {
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
};

const addBookmarks = async (req, res, next) => {
  try {
    const { recipeId, image_url, title, servings, cooking_time, ingredients } =
      req.body;
    const bookmark = new Bookmark({
      recipeId: recipeId,
      image_url: image_url,
      title: title,
      servings: servings,
      cooking_time: cooking_time,
      ingredients: ingredients,
      user: req.user._id,
    });
    await bookmark.save();
    console.log(bookmark);
    res.status(200).json({ bookmark });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "failed to add bookMark",
    });
  }
};
const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id,
    }).populate("recipeId");
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
};
module.exports = {
  getBookmark,
  deleteBookmark,
  addBookmarks,
  getUserBookmarks,
};
