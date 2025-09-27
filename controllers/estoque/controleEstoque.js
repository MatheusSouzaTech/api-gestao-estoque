const {v4: uuidv4} = require("uuid")

module.exports = app =>{

    app.get("/estoque/baixo",(req,res)=>{
        app.db.query("SELECT _id,quantidadeEstoque,estoqueMinimo,estoqueMaximo FROM Products WHERE quantidadeEstoque < estoqueMinimo",
            (err,result)=>{
                if(err){
                    console.error("Erro ao buscar produto com estoque baixo!", err)
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }
                res.json(result)
            }
        )
    })

    app.get("/estoque/minimo-maximo",(req,res)=>{
        app.db.query("SELECT _id,estoqueMinimo,estoqueMaximo FROM Products",(err,result)=>{
            if(err){
                console.error("Erro ao consultar os niveis de estoque", err)
                return res.status(500).json({mensagem: "Erro no servidor!"})
            }
            res.json(result)
        })
    })

    app.put("/estoque/minimo-maximo/:id",(req,res)=>{
        const {id} = req.params
        const {estoqueMinimo,estoqueMaximo} = req.body

        app.db.query("UPDATE Products SET estoqueMinimo=?, estoqueMaximo=? WHERE _id=?",[estoqueMinimo,estoqueMaximo,id],(err,result)=>{
            if(err){
                console.error("Erro ao atualizar niveis de estoque do produto!",err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.affectedRows === 0 ){
                return res.status(400).json({mensagem: "Produto não encontado"})
            }
            res.status(201).json({mensagem: "Niveis de estoque atualizados!",estoqueMinimo,estoqueMaximo})
        })
    })

}