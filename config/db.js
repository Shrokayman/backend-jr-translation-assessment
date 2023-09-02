import { Sequelize } from 'sequelize';
const connection = process.env.PSQL_CONNECTION

// Configure the database connection
const sequelize = new Sequelize(connection, { logging: false });

export async function startApplication() {
    try {
      // Test the database connection
      await sequelize.authenticate();
      console.log('DB connection has been established successfully.'.cyan.underline.bold);
  
      // Sync all models with the database
      await sequelize.sync({ force: false });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

// Export the Sequelize instance
export default sequelize;