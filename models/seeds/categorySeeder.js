const Category = require("../category");
const db = require("../../config/mongoose");

const CATEGORY = {
  家居物業: "fa-solid fa-house",
  交通出行: "fa-solid fa-van-shuttle",
  休閒娛樂: "fa-solid fa-face-grin-beam",
  餐飲食品: "fa-solid fa-utensils",
  其他: "fa-solid fa-pen",
};

const seedCategory = async (data) => {
  for (const key in data) {
    await Category.create({
      name: key,
      img: data[key],
    });
  }
  console.log("finished categorySeeder created.");
};

db.once("open", async () => {
  try {
    console.log("mongodb connected!");
    await seedCategory(CATEGORY);
    process.exit();
  } catch (err) {
    console.log(err);
  }
});
