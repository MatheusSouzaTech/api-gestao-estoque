const { v4: uuidv4 } = require("uuid")


module.exports = app => {

    app.get("/cotacoes", (req, res) => {

        app.db.query("SELECT * FROM Quotations", (err, result) => {
            if (err) {
                console.error("Erro ao buscar cotações", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    app.get("/cotacoes/:id", (req, res) => {
        const { id } = req.params

        app.db.query("SELECT * FROM Quotations WHERE _id=?", [id], (err, result) => {
            if (err) {
                console.error("Erro ao buscar cotação solicitada!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(400).json({ mensagem: "Cotação não encontrada!" })
            }
            res.json(result[0])
        })
    })

    app.post("/cotacoes", (req, res) => {
        const { solicitacaoCompra_id, dataValidade, usuarioResponsavel_id } = req.body
        const id = uuidv4()

        app.db.query(`INSERT INTO Quotations 
            (_id,solicitacaoCompra_id,dataValidade,usuarioResponsavel_id) VALUES (?,?,?,?)`,
            [id, solicitacaoCompra_id, dataValidade, usuarioResponsavel_id],
            (err) => {
                if (err) {
                    console.error("Erro ao registrar cotação", err)
                    return res.status(500).json({ mensagem: "Erro no servidor" })
                }
                if (itens && itens.length > 0) {
                    const values = itens.map(item => [
                        uuidv4(),
                        contacaoId,
                        item.produto_id,
                        item.quantidade,
                        item.obsevacoes || null
                    ])
                    db.query(`INSERT INTO QuotationItems (_id,cotacao_id,produto_id,quantidade,observacoes) VALUES (?,?,?,?,?)`,
                        [values],
                        (err2) => {
                            if (err2) {
                                console.error("Erro ao criar cotação!", err)
                                return res.status(500).json({ mensagem: "Erro no servidor" })
                            }
                            res.status(201).json({ mensagem: "Cotação criada com sucesso!", id, values })
                        }
                    )
                }
                else {
                    res.status(400).json({ mensagem: "Cotação já criada sem items" })
                }
            })
    })



    app.put("/cotacoes/:id/propostas", (err, result) => {
        const { id } = req.params
        const { fornecedor_id, precoUnitario, prazoEntregaDias, condicoesPagamento, observacoesFornecedor } = req.body

        const propostaId = uuidv4()

        app.db.query(`INSERT INTO  Quotation 
            (_id,fornecedor_id,precoUnitario,prazoEntregaDias,condicoesPagamento,observacoesFornecedor)`,
            [propostaId, fornecedor_id, precoUnitario, prazoEntregaDias, condicoesPagamento, observacoesFornecedor],
            (err, result) => {
                if(err){
                    console.error("Erro ao atualizar proposta!",err)
                    return res.status(500).json({mensagem: "Erro no servidor!"})
                }
                if(result.affectedRows === 0){
                    return res.status(400).json({mensagem: "Cotação não encontrada"})
                }
                res.status(201).json({mensagem: "Proposta atualizada com sucesso"})
            })
    })

    app.put("/cotacoes/:id/selecionar-propostas",(req,res)=>{
        const {id} = req.params
        const {propostaVencedor_id} = req.body

        app.db.query(`UPDATE Quotations SET propostaVencedora_id=?, status='concluida' WHERE _id=?`,
            [propostaVencedor_id,id],
            (err,result)=>{
                if(err){
                    console.error("Erro ao atualizar proposta vencedora!",err)
                    return res.status(500).json({mensagem: "Erro no servidor!"})
                }
                if(result.affectedRows === 0){
                    return res.status(404).json({mensagem: "Cotação vencedora não encontrada"})
                }
                res.status(201).json({mensagem: "Cotação selecionada com sucesso!",id,propostaVencedor_id})
            }
        )
    })

}