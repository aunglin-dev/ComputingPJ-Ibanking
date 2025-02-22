import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Admin",
    {
      AdminID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      FullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(100),
        allowNull: false,

        validate: { isEmail: true },
      },
      PhoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { isIn: [["SuperAdmin", "Manager", "Support"]] },
      },
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      UpdatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      tableName: "Admins",
    }
  );
};
