export const session = (sequelize, DataTypes) => {
  const Session = sequelize.define("session", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    access: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    refresh: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expires: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Session;
};
