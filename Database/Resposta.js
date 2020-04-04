const Sequelize = require("sequelize");
const connection = require("./Database");

const Resposta = connection.define("Respostas", {
    Corpo: { //Resposta vai ficar salva no corpo...
        type: Sequelize.TEXT,
        allowNull: false
    },
    PerguntaId: { //Vai guardar o id da pergunta que foi respondida....
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Resposta.sync({ force: false });

module.exports = Resposta;