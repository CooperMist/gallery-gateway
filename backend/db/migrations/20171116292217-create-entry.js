export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('entries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    showId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'shows',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    portfolioId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'portfolios',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    studentUsername: {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'username'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    groupId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'groups',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    entryType: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    entryId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      defaultValue: 'Untitled',
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT
    },
    distributionAllowed: {
      type: Sequelize.BOOLEAN
    },
    moreCopies: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    forSale: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    awardWon: {
      type: Sequelize.TEXT
    },
    invited: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    yearLevel: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    academicProgram: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    score: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    excludeFromJudging: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  })
}

export function down (queryInterface) {
  return queryInterface.dropTable('entries')
}
