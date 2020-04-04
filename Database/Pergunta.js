const Sequelize = require("sequelize");
const connection = require("./Database");

const Pergunta = connection.define('Pergunta', {
    Título: {
        type: Sequelize.STRING,
        allowNull: false //Não aceita campo 'Título' vazio..
    },
    Descrição: {
        type: Sequelize.TEXT,
        allowNull: false //Não aceita campo 'Descrição' vazia..
    }
});

Pergunta.sync({ force: false }).then(() => { //Sincroniza com o BD, Se no BD não existir tabela com nome 'Pergunta', dai ele cria. "force: false" é que ele não vai forçar a criação da tabela caso a tabela "Pergunta" ja exista.
    console.log("Tabela criada!")

});

module.exports = Pergunta