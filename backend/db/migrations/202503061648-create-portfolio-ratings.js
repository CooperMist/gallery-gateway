/**
 * Creates the 'portfolio ratings' table
 * @param {*} queryInterface 
 * @param {*} Sequelize 
 * @returns 'portfolio ratings' table
 */
export function up (queryInterface, Sequelize) {
    return queryInterface.createTable('portfolioRatings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // id of portfolio submitted
      portfolioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'portfolios',
          key: 'id'
        }
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
        judgeUsername: {
            type: Sequelize.STRING,
            allowNull: false,
            references: { model: 'users', key: 'username' },
            primaryKey: true
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
    return queryInterface.dropTable('portfolioRatings')
  }
    