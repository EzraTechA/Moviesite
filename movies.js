const { DataTypes } = require("sequelize");
const database = require("../database");

const movi = database.define("movi", {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  catagory: DataTypes.STRING,
  image: DataTypes.STRING,
  video: DataTypes.STRING,
});
module.exports = movi;
