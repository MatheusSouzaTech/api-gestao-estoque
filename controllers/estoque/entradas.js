const {v4: uuidv4} = require("uuid")

module.exports = app =>{

    app.get("/entradas", (req,res)=>{
        
        app.db.query("SELECT * FROM ProductEntries", (err,result)=>{
            if(err){ 
                console.error("Entradas não encontradas!",err)
                return res.status(500).json({mensagem: "erro no servidor"})
            }
            res.json(result)
        })
    })

    app.get("/entradas/:id",(req,res)=>{
        const {id} = req.params

        app.db.query("SELECT * FROM ProductEntries WHERE _id=?",[id],(err,result)=>{
            if(err){
                console.error("Entrada não encontrada!",err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.length === 0){
                return res.status(404).json({mensagem: "Entrada não encontrada"})
            }
            res.json(result[0])
        })
    })

    app.post("/entradas",(req,res)=>{
        const {produto_id, 
            quantidade, 
            tipoEntrada,
            fornecedor_id,
            numeroNotaFiscal
            ,dataEntrada,
            observacoes,
            lote_numeroLote,
            lote_dataValidade} = req.body
        const _id = uuidv4()

        app.db.query("INSERT INTO ProductEntries (_id,produto_id, quantidade, tipoEntrada,fornecedor_id,numeroNotaFiscal,dataEntrada,observacoes,lote_numeroLote,lote_dataValidade) VALUES (?,?,?,?,?,?,?,?,?,?)",[
            _id,
            produto_id, 
            quantidade, 
            tipoEntrada,
            fornecedor_id,
            numeroNotaFiscal
            ,dataEntrada,
            observacoes,
            lote_numeroLote,
            lote_dataValidade],(err,result)=>{
                if(err){
                    console.error("Error na entrada do produto",err)
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }

                app.db.query("UPDATE Products SET quantidadeEstoque = quantidadeEstoque + ? WHERE _id=? ",[quantidade,produto_id],(err2,result)=>{
                    if(err2){
                        console.error("Erro ao atualizar estoque do produto!", err2)
                        return res.status(500).json({mensagem: "Erro no servidor"})
                    }
                    if(result.affectedRows === 0){
                        return res.status(404).json({mensagem: "Produto não encontrado!"})
                    }
                    res.status(201).json({mensagem: "Entrada registrada com sucesso",_id,produto_id})
                })
                
            })
    })

}