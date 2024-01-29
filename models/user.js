"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
          notEmpty: { msg: "name cannot be empty" },
          isAlpha: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password cannot be empty" },
          len: {
            args: [6, 10],
            msg: "Password must be between 6 and 10 characters",
          },
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "mobile is required" },
          notEmpty: { msg: "mobile cannot be empty" },
          isNumeric: true,
          len: {
            args: [10],
            msg: "mobile must be between 10 digit",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      hooks: {
        beforeCreate: async (user) => {
          console.log(user);
          const saltRounds = 10;
          user.password = await bcrypt.hash(user.password, saltRounds);
        },
      },
    }
  );
  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
