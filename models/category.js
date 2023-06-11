const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
