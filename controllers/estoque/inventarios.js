const { v4: uuidv4 } = require("uuid")

module.exports = app => {

    app.get("/inventarios", (req, res) => {
        app.db.query("SELECT *FROM Inventarios", (err, result) => {
            if (err) {
                console.error("Erro ao consultar inventarios", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    app.get("/inventarios/:id", (req, res) => {
        const { id } = req.params

        app.db.query("SELECT * FROM Inventarios WHERE _id=?", [id], (err, result) => {
            if (err) {
                console.error("Erro ao localizar inventario!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(400).json({ mensagem: "Inventario não encontrado", result })
            }
            res.json(result[0])
        })
    })

    app.post("/inventarios", (req, res) => {
        const { usuario_id, dataInventario, status, observacoes } = req.body
        const _id = uuidv4()

        app.db.query("INSERT INTO Inventarios (_id,usuario_id,dataInventario,status,observacoes) VALUES (?,?,?,?,?)",
            [_id, usuario_id, dataInventario, status, observacoes],
            (err, result) => {
                if (err) {
                    console.error("Erro ao adicionar inventario!", err)
                    return res.status(500).json({ mensagem: "Erro no servidor" })
                }
                res.status(201).json({ mensagem: "Inventario registrado com sucesso!", _id, _id })
            }
        )
    })

    //função assincrona: Permite que o codigo continue rodando enquanto determinada execução esta sendo requerida 
    //exemplo das querys que não terminarm imediatamente
    app.put("/inventarios/:id/ajustar", async (req, res) => {
        const { id } = req.params
        const { ajustes } = req.body

        //promises são objetos que tratam funções assincronas e seus resultados
        //map ultilizado para percorrer cada item e realizar uma ação
        const promises = ajustes.map(item => {
            const itemId = uuidv4()

            return new Promise((resolve, reject) => {

                app.db.query("INSERT INTO InventarioItens (_id,inventario_id,produto_id,quantidadeContada) VALUES (?,?,?,?)", [itemId, item.id, item.produto_id, item.quantidadeContada], (err) => {
                    if (err) {
                        console.error("Erro ao inserir item")
                        return reject(err)
                    }

                    app.db.query("UPDATE Products SET quantidadeEstoque = ? WHERE _id=?",
                        [item.quantidadeContada, item.produto_id], (err2, result2) => {
                            if (err2) {
                                console.error("Erro ao atualizar estoque")
                                return reject(err2)
                            }
                            if (result2.affectedRows === 0) {
                                return reject(new Error("Produto não encontrado"))
                            }
                            resolve()
                        })

                })
            })
        })
        //await permite que o codigo continue executando somente quando a função assincrona for resolvida pela Promise
        //Promis.all espera todas as operações do array promises terminarem
        await Promise.all(promises)
            app.db.query("UPDATE Inventarios SET status='concluido' WHERE _id=?",
                [id], (err3, result3) => {
                    if (err3) {
                        console.error("Erro ao finalizar produtos", err3)
                        return res.status(500).json({ mensagem: "Erro no servidor!" })
                    }
                    if (result3.affectedRows === 0) {
                        return res.status(400).json({ mensagem: "Inventario não encontrado!" })
                    }
                    return res.json({ mensagem: "Inventario ajustado com sucesso!" })
        })
    })

}