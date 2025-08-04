const mongoose  = require("mongoose");

const StepSchema = new mongoose.Schema({
  instruction: String,
  duration: Number // in seconds
});

const RecipeSchema = new mongoose.Schema({
  title: String,
  category: String,
  ingredients: [String],
  steps: [StepSchema],
  image: String,
  duration: Number
});

module.exports = mongoose.model('Recipe', RecipeSchema);