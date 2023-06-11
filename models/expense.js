const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // categoryId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Category",
  //   createIndexes: true,
  //   required: true,
  // },
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   createIndexes: true,
  //   required: true,
  // },
});

module.exports = mongoose.model("Expense", expenseSchema);
