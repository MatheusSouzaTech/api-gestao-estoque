//importando recursos para api
const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const mysql = require('mysql2') 



//exportando a configuração do servidor para o server.js
module.exports = () => {

    const app = express()

    //conexão com o banco de dados
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1238945679abC@",
        database: "estoque"
    })

    db.connect((err)=>{
        if(err){
            console.log("Erro ao se conectar com o banco de dados!")
        }
        else{
            console.log("Banco conectado com sucesso!")
        }
    })

    app.db = db

    //configurando o formato de leitura
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    //importando os dados do controller para ser tratado
    consign()
        .include('controllers')
        .into(app)

    return app
}