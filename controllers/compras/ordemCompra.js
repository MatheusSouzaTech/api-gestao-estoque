const { v4: uuidv4 } = require("uuid")

module.exports = app => {

    app.get("/ordemCompra", (req, res) => {

        app.db.app(`SELECT * FROM PushaseOrders`, (err, result) => {
            if (err) {
                console.error("Erro ao buscar ordens de compra", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    app.get("/ordemCompra/:id", (req, res) => {

        const { id } = req.params

        app.db.query("SELECT * FROM PushaseOrders", [id], (err, result) => {
            if (err) {
                console.error("Erro ao buscar ordem de compra!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(404).json({ mensagem: "Ordem de compra não encontrada" })
            }
            res.json(result[0])
        })
    })

    app.post("/ordemCompra/:id", (req, res) => {
        const { cotacao_id, fornecedor_id, itens } = req.body
        const ordemId = uuidv4()

        if (cotacao_id) {
            app.db.query(`SELECT propostaVencedora_id FROM Quotations WHERE _id=?`,
                [cotacao_id],
                (err, result) => {
                    if (err) {
                        console.error("Erro ao buscar proposta vencedora!", err)
                        return res.status(500).json({ mensagem: "Erro no servidor" })
                    }
                    if (result.length === 0) {
                        return res.status(404).json({ mensagem: "Proposta não encontrada" })
                    }

                    const propostaId = result[0].propostaVencedora_id
                    if (!propostaId) return res.status(400).json({ mensagem: "Nenhuma proposta selecionada" })

                    app.db.query(`SELECT fornecedor_id,precoUnitario,prazoEntregaDias FROM QuotationProposals WHERE _id=?`,
                        [propostaId],
                        (err2, proposta) => {
                            if (err2) return res.status(500).json({ error: err2.mensage })

                            const fornecedorId = proposta[0].fornecedor_id

                            app.db.query(`INSERT INTO PurchaseOrders(_id,cotacao_id,fornecedor_id) VALUES (?,?,?)`,
                                [ordemId, cotacao_id, fornecedor_id],
                                (err3) => {
                                    if (err3) return res.status(500).json({ error: err3.mensage })

                                    app.db.query(`SELECT produto_id,quantidade FROM QuotationItems WHERE _id=?`,
                                        [cotacao_id],
                                        (err4, itemsCotacao) => {
                                            if (err4) return res.status(400).json({ error: err4.mensage })

                                            const values = itemsCotacao.map(item=>[
                                                uuidv4(),
                                                ordemId,
                                                item.produto_id,
                                                item.quantidade,
                                                proposta[0].precoUnitario
                                            ])
                                            app.db.query(`INSERT INTO PurchaseOrderItems (_id,ordemCompra_id,produto_id,quantidade,precoUnitario)
                                                VALUES (?,?,?,?,?)`,[values],
                                            (err5)=>{
                                                if(err5) return res.status(500).json({error: err5.mensage})
                                                res.status(201).json({mensagem: "Ordem de compra criada a paritr da cotação"})
                                            })
                                        }
                                    )
                                }
                            )
                        }
                    )
                })
        }else{
            if(!fornecedor_id || !itens) return res.status(400).json({mensagem: "Dados invalidos"})

            app.db.query(`INSERT INTO PurchaseOrders (_id,fornecedor_id) VALUES (?,?)`,
                [ordemId,fornecedor_id],
                (err)=>{
                    if(err) return res.status(500).json({error: err.mensage})
                    
                    const values = itens.map(item=>[
                        uuidv4(),
                        ordemId,
                        item.produto_id,
                        item.fornecedor_id,
                        item.precoUnitario
                    ])
                    app.db.query(`INSERT INTO PurchaseOrdersItems 
                        (_id,ordemCompra_id,produto_id,quantidade,precoUnitario) VALUES (?,?,?,?,?)`,
                    (err2)=>{
                        if(err2) return res.status(500).json({error: err2.mensage})
                        res.status(201).json({mensagem: "Ordem de compra criada manualmente",ordemId})
                    })
                }
            )
        }

    })

}