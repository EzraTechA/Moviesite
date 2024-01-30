const Movie = require("./models/movies");
const User = require("./models/user1");

function relations() {
  Movie.belongsTo(User, { foreignKey: "userid" });
  User.hasMany(Movie, { foreignKey: "userid" });
}

module.exports = relations;
