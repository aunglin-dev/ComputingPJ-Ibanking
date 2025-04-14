import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "OtherBank",
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      BankName: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      ShortName: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      BankCode: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      CreatedUserId: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      IsDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "OtherBank",
    }
  );
};
