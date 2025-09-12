const mongoose = require("mongoose");
const bookmarkSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: [true, "A recipe must have id"],
  },
  title: {
    type: String,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A user is must required"],
  },
});
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;
