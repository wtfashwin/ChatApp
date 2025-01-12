const seedUsers = require("./seedsUsers.json");
const { User } = require("../models/");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log("\n----- Database Synched -----\n");

  const user = await User.bulkCreate(seedUsers, {
    individualHooks: true,
    returning: true,
  });
  console.log("\n----- Users Seeded -----\n");

  process.exit(0);
};

seedAll();
