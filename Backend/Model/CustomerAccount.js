import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "CustomerAccounts",
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "UserId",
        },
      },
      AccountNo: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      AccountId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "AccountType",
          key: "AccountId",
        },
      },
      Currency: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      IsLock: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      IsDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      Balance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
    },
    {
      timestamps: false, // Disable Sequelize's default timestamps (createdAt, updatedAt)
      tableName: "CustomerAccounts", // Explicitly set the table name
    }
  );
};
