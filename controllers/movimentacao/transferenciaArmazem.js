const { v4: uuidv4 } = require("uuid")

module.exports = app => {

    app.get("/trasferencias", (req, res) => {
        app.db.query("SELECT * FROM Transfers", (err, result) => {
            if (err) {
                console.error("Erro ao buscar resultados!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    app.get("/transferencia", (req, res) => {
        const { id } = req.params

        app.db.query("SELECT *FROM Tranfers WHERE _id=?", [id], (err, result) => {
            if (err) {
                console.error("Erro ao buscar resultado!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(500).json({ mensagem: "Transferencia não encontrada!" })
            }
            res.json(result[0])
        })
    })

    app.post("/transferencias", (req, res) => {
        const { produto_id, quantidade, origem, destino, dataTransferencia, status, obsevacoes, funcionarioResponsavel_id } = req.body
        const id = uuidv4()

        app.db.query("INSERT INTO Transfers (_id,produto_id,quantidade,origem,destino,dataTransferencia,status,observacoes,funcionarioResponsavel_id) VALUES (?,?,?,?,?,?,?,?,?)",
            [id, produto_id, quantidade, origem, destino, dataTransferencia, status, obsevacoes, funcionarioResponsavel_id],
            (err, result) => {
                if (err) {
                    console.error("Erro ao registrar transferencia!", err)
                    return res.status(500).json({ mensagem: "Erro no servidor!" })
                }
                res.status(201).json({ mensagem: "Transferencia registrada com sucesso!", id })
            })
    })

    app.put("/transferencias", (req, res) => {
        const { id } = req.params

        app.db.query(`UPDATE Transfers 
    SET status = 'concluida', updatedAt = CURRENT_TIMESTAMP
    WHERE _id = ? AND status != 'concluida' AND status != 'cancelada'`[id], (err, result) => {
        if(err){
            console.error("Erro ao atualizar transferencia!",err)
            return res.status(500).json({mensagem: "Erro no servidor"})
        }
        if(result.affectedRows === 0 ){
            return res.status(400).json({mensagem: "Registro não encontrado!"})
        }
        res.status(201).json({mensagem:"Transferencia atualizada com sucesso",id,novo_status: "concluida"})
        })
    })

}