const { v4: uuidv4 } = require("uuid")

module.exports = app => {

    app.get("/solicitacao-de-compra", (req, res) => {

        app.db.query("SELECT * FROM PuschaseRequests", (err, result) => {
            if (err) {
                console.error("Erro ao buscar solicitaçoes", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    app.get("/solicitacao-de-compra/:id", (req, res) => {
        const { id } = req.params

        app.db.query("SELECT * FROM PuschaseRequests WHERE _id=?", [id], (err, result) => {
            if (err) {
                console.error("Erro ao solicitação", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(400).json({ mensagem: "Solicitação não encontrada" })
            }
            res.json(result[0])
        })
    })

    app.post("/solicitacao-de-compra", (req, res) => {
        const { produto_id, quantidade, dataSolicitacao, dataNecessidade, urgencia, status, solicitante_id, aprovador_id, observacoes } = req.body
        const id = uuidv4()

        app.db.query(`INSERT INTO PuschaseRequests (_id,produto_id,quantidade,dataSolicitacao,dataNecessidade,urgencia,status,solicitante_id,aprovador_id,observacores)
            VALUES (?,?,?,?,?,?,?,?,?,?)`, [id, produto_id, quantidade, dataSolicitacao, dataNecessidade, urgencia, status, solicitante_id, aprovador_id, observacoes], (err, result) => {
            if (err) {
                console.error("Erro ao registrar solicitação!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.status(201).json({ mensagem: "Solicitação registrada com sucesso", id })
        })
    })

    app.put("/solicitacoes-compra/:id/status", (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        const statusPermitidos = ["pendente", "aprovada", "rejeitada"];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ mensagem: "Status inválido" });
        }

        const sql = `
    UPDATE SolicitacoesCompra
    SET status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
  `;

        db.query(sql, [status, id], (err, result) => {
            if (err) {
                console.error("Erro ao atualizar status:", err);
                return res.status(500).json({ mensagem: "Erro no servidor" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Solicitação de compra não encontrada" });
            }

            res.json({
                mensagem: "Status atualizado com sucesso",
                solicitacao_id: id,
                novo_status: status
            });
        });
    });

}