const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('Online', 'Physical'),
    defaultValue: 'Online'
  },
  milestoneId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Milestones',
      key: 'id'
    }
  }
});

// Instance methods
Meeting.prototype.isUpcoming = function() {
  return new Date(this.date) > new Date();
};

// Model hooks
Meeting.beforeCreate(async (meeting) => {
  meeting.title = meeting.title.trim();
  if (meeting.description) {
    meeting.description = meeting.description.trim();
  }
});

Meeting.beforeUpdate(async (meeting) => {
  if (meeting.changed('title')) {
    meeting.title = meeting.title.trim();
  }
  if (meeting.changed('description')) {
    meeting.description = meeting.description?.trim();
  }
});

module.exports = Meeting;
