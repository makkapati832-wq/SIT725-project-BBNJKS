const mongoose = require("mongoose");

require("./user");
require("./class");
require("./enrollment");
require("./session");
require("./attendance");

mongoose.connect("mongodb://localhost:27017/attendance_system")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.error(err));

const User = require("./user");

async function addSample() {
  await User.create({
    fullName: "satwik",
    email: "mbkskarthik@gmail.com",
    password: "test123",
    role: "teacher"
  });
  console.log("Sample user inserted");
}

addSample();

