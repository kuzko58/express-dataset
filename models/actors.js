module.exports = (sequelize, DataTypes) => {
  const actors = sequelize.define('actors', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    main_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sub_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_seen: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
    event_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, { timestamps: false });

  actors.associate = (models) => {
    actors.hasMany(models.repos);
    actors.hasMany(models.events);
  };
  return actors;
};
