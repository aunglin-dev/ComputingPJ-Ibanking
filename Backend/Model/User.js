import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "User",
    {
      UserId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      UserName: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      FullName: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      NRC: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      DateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      PhoneNumber: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      ProfilePhotoPath: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      CIFID: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      Address: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      Gender: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      LatestLoginPasswordChangedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      IsFirstTimeLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      IsLoginLockUser: {
        type: DataTypes.BOOLEAN,
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
      UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      UpdatedUserId: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      UserType: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "Users",
    }
  );
};
