const { v4: uuidv4 } = require("uuid")

module.exports = app => {

    app.get("/movimentacoes", (req, res) => {

        app.db.query("SELECT * FROM Movements", (arr, result) => {
            if (err) {
                console.error("Erro ao buscar resultados!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    app.get("/movimentacoes/:id", (req, res) => {
        const { id } = req.params

        app.db.query("SELECT * FROM Moviments WHERE _id=?",[id],(err, result) => {
            if (err) {
                console.error("Erro ao buscar Resultado!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(400).json({ mensagem: "Registro não encontrado!" })
            }
            res.json(result[0])
        })
    })

    app.get("/api/movimentacoes/produto/:produtoId", (req, res) => {
        const { produtoId } = req.params;

        const sql = `
    SELECT 
      m._id,
      m.tipo,
      m.produto_id,
      p.nome AS produto_nome,
      m.quantidade,
      m.dataMovimentacao,
      m.referenciaId,
      m.observacoes,
      m.usuario_id,
      u.nome AS usuario_nome,
      m.createdAt,
      m.updatedAt
    FROM Movements m
    JOIN Products p ON m.produto_id = p._id
    JOIN Users u ON m.usuario_id = u._id
    WHERE m.produto_id = ?
    ORDER BY m.dataMovimentacao DESC`

        db.query(sql, [produtoId], (err, results) => {
            if (err) {
                console.error("Erro ao buscar movimentações:", err);
                return res.status(500).json({ mensagem: "Erro no servidor" });
            }

            if (results.length === 0) {
                return res.status(404).json({ mensagem: "Nenhuma movimentação encontrada para este produto" });
            }

            res.json(results);
        });
    });

}