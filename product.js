const { DataTypes } = require('sequelize')
const databases=require('../database')

const post=databases.define('post',{
    title:DataTypes.STRING,
    description:DataTypes.STRING,
    likeCount:DataTypes.NUMBER,
    isOffensive:DataTypes.BOOLEAN
})
module.exports = post