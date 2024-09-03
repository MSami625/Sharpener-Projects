const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const filesUploaded = sequelize.define("filesUploaded", {

    url: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = filesUploaded;