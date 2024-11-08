export function up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'entries', // Table name
      'score', // Column name
      {
        type: Sequelize.INTEGER, // Define the data type
        allowNull: true // Change to false if the column is required
      }
    );
  }
  
  export function down(queryInterface) {
    return queryInterface.removeColumn('entries', 'score');
  }
  