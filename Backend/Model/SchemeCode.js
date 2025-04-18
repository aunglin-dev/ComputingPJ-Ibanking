import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "SchemeCode",
    {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      SchemeCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      AccountType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      AccountId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "AccountType", // should match the name used in your model definition
          key: "AccountId",
        },
      },
      LimitCodeId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "TransactionLimit",
          key: "Id",
        },
      },
      LimitCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CreatedAdminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false, // disables createdAt and updatedAt
      tableName: "SchemeCode",
    }
  );
};
