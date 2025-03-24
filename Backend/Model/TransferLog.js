import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "TransferLog",
    {
      Id: {
        type: DataTypes.BIGINT,
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
      TransactionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      FromAccount: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      ToAccount: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      ToAccountName: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      TransactionAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      TotalCharges: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      OtherBankCharges: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      Description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      BeneficiaryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ToBank: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      ToBranch: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Currency: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      Status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      TranType: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Nrc: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      TransactionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "TransferLog",
    }
  );
};
