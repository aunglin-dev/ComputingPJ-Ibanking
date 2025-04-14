import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "OtherBranches",
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      BankId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Name: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Code: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      ShortName: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      CityCode: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      StateCode: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Address: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Region: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PhoneNumber: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING(225),
        allowNull: true,
        validate: {
          isEmail: true, // Optional email validation
        },
      },
      CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      CreatedUserId: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "OtherBranches",
    }
  );
};
