const Sequelize = require("sequelize"); //Serve para conectar o Javascript ao Banco de dados..

//Construir conexão com BD
const connection = new Sequelize('guiaperguntas', 'root', 'admin', { //Acesso ao BD 'guiaperguntas'
    host: 'localhost', //qual servidor
    dialect: 'mysql' //  qual tipo de banco de dados
});

module.exports = connection;