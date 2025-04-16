import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Beneficiary",
    {
      Id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      UserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "Users", // This references the Users table
          key: "UserId",
        },
      },
      AccountNo: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Type: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Phone: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Address: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Description: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      OtherBankId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      OtherBranchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      IsDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      AccountNameName: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      NickName: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Beneficiary",
    }
  );
};
