import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "OfficeAccounts",
    {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      Code: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      OfficeAccountNumber: {
        type: DataTypes.STRING, // No length specified as per your SQL
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING, // No length specified as per your SQL
        allowNull: false,
      },
      Balance: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
    },
    {
      timestamps: false, // Disable createdAt/updatedAt
      tableName: "OfficeAccounts", // Explicit table name
      freezeTableName: true, // Prevent pluralization
    }
  );
};
