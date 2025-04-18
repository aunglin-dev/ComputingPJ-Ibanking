import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Particular",
    {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      TranType: {
        type: DataTypes.STRING(256),
        allowNull: true, // Matches your NULL specification
      },
      OfficeAccountId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "OfficeAccounts",
          key: "Id",
        },
      },
      ChargesRate: {
        type: DataTypes.DECIMAL(18, 2), // No precision specified as per your SQL
        allowNull: true,
      },
      UpdateAdminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false, // Disable createdAt/updatedAt
      tableName: "Particular", // Explicit table name (matches your SQL)
      freezeTableName: true, // Prevent pluralization
    }
  );
};
