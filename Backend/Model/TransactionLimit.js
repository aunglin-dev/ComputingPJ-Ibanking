import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "TransactionLimit",
    {
      Id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      LimitCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Currency: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      LimitType: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      MinTransactionAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      MaxTransactionAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      Rate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      IsDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      CreatedUserId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      DeletedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      DeletedUserId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      LimitCodeDesc: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      timestamps: false, // Disables createdAt and updatedAt
      tableName: "TransactionLimit", // Explicit table name
      freezeTableName: true, // Prevents pluralization
    }
  );
};
