export function up(queryInterface, Sequelize) {
    return queryInterface.addColumn('portfolios', 'score', {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DOUBLE,
    });
  }

  export function down(queryInterface) {
    return queryInterface.removeColumn('portfolios', 'score');
  }