
//exportando os modulos das rotas a serem ultilizadas
module.exports = app => {
    app.get('/products', (req, res) => res.send('Rota para manipulação de produtos'))

    //rota de adicionar os atendimentos
    app.post('/products', (req, res) => {
        console.log(req.body)
        res.send('requisição processada e retornando')
    })
}