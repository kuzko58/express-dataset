module.exports = (sequelize, DataTypes) => {
  const events = sequelize.define('events', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { timestamps: false });

  events.associate = (models) => {
    events.belongsTo(models.actors);
    events.belongsTo(models.repos);
  };
  return events;
};
