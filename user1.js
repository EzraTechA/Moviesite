const database = require("../database");
const { DataTypes } = require("sequelize");
const user = database.define("user", {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  userName: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  
});
module.exports = user;
