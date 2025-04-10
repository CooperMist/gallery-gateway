export function up(queryInterface, Sequelize) {
    return queryInterface.addColumn('entries', 'score', {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.DOUBLE,
    });
  }

  export function down(queryInterface) {
    return queryInterface.removeColumn('entries', 'score');
  }