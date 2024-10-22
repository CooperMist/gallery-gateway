/**
 * Creates the 'portfolios' table
 * @param {*} queryInterface 
 * @param {*} Sequelize 
 * @returns 'portfolios' table
 */
export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('portfolios', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    studentUsername: {
      type: Sequelize.STRING,
      allowNull: false,
      references: { model: 'users', key: 'username' }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    portfolioPeriodId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'portfolioPeriods',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  })
}
  
export function down (queryInterface) {
  return queryInterface.dropTable('portfolios')
}
  