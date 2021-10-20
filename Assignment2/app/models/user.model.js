const { DataTypes } = require("sequelize");
const uuid = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        isEmail: true
      },
      user_password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_type: {
        type: Sequelize.STRING
      },
      image_name: {
        type: Sequelize.STRING
      },
      user_image: {
        type: Sequelize.BLOB('long')
      },
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_logged_in: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  
    return User;
};