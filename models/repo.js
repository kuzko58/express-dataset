module.exports = (sequelize, DataTypes) => {
  const repos = sequelize.define('repos', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: false });

  repos.associate = (models) => {
    repos.belongsTo(models.actors);
    repos.hasMany(models.events);
  };
  return repos;
};
