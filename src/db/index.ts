import { Sequelize } from "sequelize";
import config from "../config";
import { init } from "../db/models";

class DB {
  public sequelize: Sequelize | null = null;

  async connect(): Promise<Sequelize> {
    try {
      this.sequelize = config.DBConfig();
      await this.sequelize.authenticate();
      await init(this.sequelize);
      console.log("Connected to database");
      return this.sequelize;
    } catch (error) {
      console.error(`Failed to connect to database: ${error}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.close();
      console.log("Database connection closed");
    }
  }
}

export default new DB();
