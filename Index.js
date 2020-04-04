const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./Database/Database");
const Pergunta = require("./Database/Pergunta");
const Resposta = require("./Database/Resposta");


//Database (usando o 'sequelize')
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com banco de dados!")
    })
    .catch((msgErro) => {
        console.log("msgErro")
    })

//Configuração do EJS no Express..Renderização de HTML
app.set('view engine', 'ejs'); // Estou dizendo para o Express que a view engine (o motor de HTML) que vai usar é a 'ejs'.
app.use(express.static('Public')); //Vai utilizar os arquivos estáticos que estão na pasta 'Public'. Arquivos estáticos são arquivos que nao são reconhecidos pelo express. EX.: CSS,JS front end,imagens, etc... 


//BodyParser
app.use(bodyParser.urlencoded({ extended: false })) //Permite que a pessoa envie os dados do formulário, e o bodyparser vai traduzir(Decodificar) os dados em estrutura Javascript para usar neste projeto..
app.use(bodyParser.json()); //Permite que a gente leia dados de formmulários enviados via 'json'.

//ROTAS
app.get("/", (req, res) => {
    Pergunta.findAll({ // é o mesmo que SELECT * ALL FROM pergunta. 'Raw: true' serve para só mostrar o que tiver na tabela.. PUXA INFORMAÇÕES DO BD PARA O FRONT END.
        raw: true,
        order: [
            ['id', 'DESC'] // ASC = Crescente, DESC = Decrescente.. Serve para pegar a informação do BD pelo ID e na ordem selecionada (crescente ou decrescente).
        ]
    }).then(Pergunta => {
        res.render("index", {
            Pergunta: Pergunta // Cria variavel 'Pergunta'que recebe 'pergunta' do BD..
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo; // Cria variavel titulo que pega informação 'titulo' na pagina perguntar..
    var descricao = req.body.descricao;

    Pergunta.create({
        Título: titulo, //Cria uma coluna Título na tabela Pergunta do BD que recebe o valor informado na variavel titulo...
        Descrição: descricao
    }).then(() => {
        res.redirect("/");
    });
    //res.send("Formulário recebido!" + titulo + " " + "Descrição: " + descricao);
});

app.get("/pergunta/:id", (req, res) => { //Cria Rota Para busca de id do BD.
    var id = req.params.id; //Cria variavel 'id' que pega o id digitado na Rota.
    Pergunta.findOne({ // Método do Sequelize que busca no BD, na tabela Pergunta um dado específico.
        where: { id: id } //Procura o id no BD equivalente ao id digitado na rota..
    }).then(Pergunta => { //Depois de achado o id, ele vai fazer isso..
        if (Pergunta != undefined) { // Se ele achar o id no BD igual ao digitado na rota..

            Resposta.findAll({ //Pesquisa dentro da table Resposta no BD
                where: { PerguntaId: Pergunta.id }, // procura onde PerguntaId(do BD) = pergunta.id ( da pagina)
                order: [
                    ['id', 'DESC'] //Para deixar em ordem decrescente as resposta.
                ]
            }).then(Resposta => { //Se Achar, recebe resposta...
                res.render("Pergunta", { //Vai para Pergunta.ejs
                    Pergunta: Pergunta,
                    Resposta: Resposta
                });
            });
        } else { //id não encontrado no BD..
            res.redirect("/");
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo; // Cria variavel 'corpo' que pega o 'corpo' do front end no arquivo 'Pergunta.ejs'...
    var perguntaId = req.body.pergunta; // Cria variavel 'perguntaId' que pega a 'pergunta' do front end no arquivo 'Pergunta.ejs'... Pega o id 
    Resposta.create({ //envia para o BD na tabela Resposta...
        Corpo: corpo, //envia para BD na tabela Resposta em 'Corpo'
        PerguntaId: perguntaId //envia para BD na tabela Resposta em 'PerguntaId'
    }).then(() => { // Quando finalizar a resposta, Redireciona para...
        res.redirect("/pergunta/" + perguntaId); // Redireciona para /pergunta/+id da pergunta
    });
});

//RODAR APLICAÇÃO
app.listen(8080, () => { console.log("App Rodando!"); });