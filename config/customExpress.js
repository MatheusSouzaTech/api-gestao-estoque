//importando recursos para api
const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');


//exportando a configuração do servidor para o server.js
module.exports = () => {

    const app = express();

    //configurando o formato de leitura
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    //importando os dados do controller para ser tratado
    consign()
        .include('controllers')
        .into(app)

    return app
}