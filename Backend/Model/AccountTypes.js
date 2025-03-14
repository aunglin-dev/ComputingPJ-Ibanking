import { DataTypes } from "sequelize";

export default (sequelize) => {
  const AccountType = sequelize.define(
    "AccountType",
    {
      AccountId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      ProductName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      CategoryGroup: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      IsDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      MinimumBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      IsPayOutAllow: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "AccountType",
    }
  );

  // Define associations
  AccountType.associate = (models) => {
    AccountType.hasMany(models.CustomerAccounts, { foreignKey: "AccountId" });
  };

  return AccountType;
};
