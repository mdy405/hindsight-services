import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { session } from "../models/session.js";
import { stock } from "../models/stock.js";
dotenv.config();
// Database Connection
const URI = process.env.CONNECTION_STRING;

const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  /*dialectOptions: {
    ssl: true,
  },*/
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: false,
  },
});

//Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models/tables
db.session = session(sequelize, Sequelize);
db.session.sync();

db.stock = stock(sequelize, Sequelize);
db.stock.sync();

export default db;
