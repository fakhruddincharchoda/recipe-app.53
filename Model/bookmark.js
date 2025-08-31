const mongoose = require("mongoose");
const bookmarkSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: [true, "A recipe must have id"],
  },
  title: {
    type: String,
    unique: true,
    required: [true, "A recipe must have title"],
  },
  publisher: {
    type: String,
  },
  ingredients: {
    type: Array,
    required: [true, "A recipe must have ingredients"],
  },
  servings: {
    type: Number,
    required: [true, "require servings"],
  },
  cooking_time: {
    type: Number,
    required: [true, "require cookingTime"],
  },
  image_url: {
    type: String,
    required: [true, "require Image"],
  },
});
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;
