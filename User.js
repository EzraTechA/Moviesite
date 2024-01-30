const { DataTypes } = require('sequelize')
const database = require('../database')

const User = database.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName:DataTypes.STRING,
    lastName:DataTypes.STRING,
    email:DataTypes.STRING,

})

module.exports = User