const { v4: uuidv4 } = require('uuid') // Para gerar IDs únicos

module.exports = app => {
    // Rota para obter todos os produtos
    app.get("/products", (req, res) => {
        app.db.query("SELECT * FROM Products", (err, result) => {
            if (err) {
                console.error("Erro ao buscar produtos: ", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    // Rota para obter um produto por ID
    app.get("/products/:id", (req, res) => {
        const { id } = req.params
        
        app.db.query("SELECT * FROM Products WHERE _id = ?", [id], (err, result) => {
            if (err) {
                console.error("Erro ao buscar produto: ", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(404).json({ mensagem: "Produto não encontrado!" })
            }
            res.json(result[0])
        })
    })

    // Rota para adicionar os produtos
    app.post("/products", (req, res) => {
        const { nome, codigo, categoria, descricao, unidadeMedida, precoCusto, precoVenda, quantidadeEstoque, estoqueMinimo, estoqueMaximo, fornecedor_id, dataValidade, status } = req.body;
        const _id = uuidv4() // Gerar um ID único para o novo produto

        
        app.db.query(
            "INSERT INTO Products (_id, nome, codigo, categoria, descricao, unidadeMedida, precoCusto, precoVenda, quantidadeEstoque, estoqueMinimo, estoqueMaximo, fornecedor_id, dataValidade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [_id, nome, codigo, categoria, descricao, unidadeMedida, precoCusto, precoVenda, quantidadeEstoque, estoqueMinimo, estoqueMaximo, fornecedor_id, dataValidade, status],
            (err, result) => {
                if (err) {
                    console.error("Erro ao adicionar produto: ", err)
                    return res.status(500).json({ mensagem: "Erro no servidor" })
                }
                res.status(201).json({ mensagem: "Produto adicionado!", _id: _id })
            }
        );
    });

    // Rota para atualizar um produto existente
    app.put("/products/:id", (req, res) => {
        const { id } = req.params
        const { nome, codigo, categoria, descricao, unidadeMedida, precoCusto, precoVenda, quantidadeEstoque, estoqueMinimo, estoqueMaximo, fornecedor_id, dataValidade, status } = req.body;

        app.db.query(
            "UPDATE Products SET nome=?, codigo=?, categoria=?, descricao=?, unidadeMedida=?, precoCusto=?, precoVenda=?, quantidadeEstoque=?, estoqueMinimo=?, estoqueMaximo=?, fornecedor_id=?, dataValidade=?, status=? WHERE _id=?",
            [nome, codigo, categoria, descricao, unidadeMedida, precoCusto, precoVenda, quantidadeEstoque, estoqueMinimo, estoqueMaximo, fornecedor_id, dataValidade, status, id],
            (err, result) => {
                if (err) {
                    console.error("Erro ao atualizar produto: ", err)
                    return res.status(500).json({ mensagem: "Erro no servidor" })
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ mensagem: "Produto não encontrado" })
                }
                res.json({ mensagem: "Produto atualizado com sucesso!" })
            }
        )
    })

    // Rota para deletar um produto
    app.delete("/products/:id", (req, res) => {
        const { id } = req.params
        
        app.db.query("DELETE FROM Products WHERE _id = ?", [id], (err, result) => {
            if (err) {
                console.error("Erro ao deletar produto: ", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Produto não encontrado" })
            }
            res.json({ mensagem: "Produto deletado com sucesso!" })
        })
    })
}