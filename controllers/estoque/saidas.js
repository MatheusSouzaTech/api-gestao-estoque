const { json } = require("body-parser")
const {v4:uuidv4} = require("uuid")

module.exports = app =>{

    app.get("/saidas",(req,res)=>{
        app.db.query("SELECT * FROM ProductExits",(err,result)=>{
            if(err){
                console.error("Erro ao buscar registros!", err)
                return res.status(500).json({mensagem: "Erro no servidor!"})
            }
            res.json(result)
        })
    })

    app.get("/saidas/:id",(req,res)=>{
        const {id} = req.params

        app.db.query("SELECT *FROM ProductExits WHERE _id=?",[id],(err,result)=>{
            if(err){
                console.error("Erro ao buscar registro!",err)
                return res.status(500).json({mensagem: "Erro no servidor!"})
            }
            if(result.length === 0){
                return res.status(404).json({mensagem: "Registro de saida não encontrado!"})
            }
            res.json(result[0])
        })
    })

    app.post("/saidas",(req,res)=>{
        const {produto_id,
            quantidade,
            tipoSaida,
            cliente_id,
            numeroPedidoVenda,
            dataSaida,
            observacoes,
            lote_numeroLote} = req.body
        const _id = uuidv4()

        app.db.query("INSERT INTO ProductExits (_id,produto_id,quantidade,tipoSaida,cliente_id,numeroPedidoVenda,dataSaida,observacoes,lote_numeroLote) VALUES (?,?,?,?,?,?,?,?,?)",
            [_id,
            produto_id,
            quantidade,
            tipoSaida,
            cliente_id,
            numeroPedidoVenda,
            dataSaida,
            observacoes,
            lote_numeroLote],(err,result)=>{
                if(err){
                    console.error("Erro ao registrar Saida!",err)
                    return res.status(500).json({mensagem: "Erro no Servidor!"})
                }
                app.db.query("UPDATE Products SET quantidadeEstoque = quantidadeEstoque - ? WHERE _id=?",[quantidade,produto_id],(err2,result2)=>{
                    if(err2){
                        console.error("Erro ao dar baixa no estoque", err2)
                        return res.status(500).json({mensagem: "Erro no servidor!"})
                    }
                    if(result2.affectedRows === 0){
                        return res.status(404).json({mensagem: "Produto não encontrado!"})
                    }
                    res.status(201).json({mensagem: "Saida registrada com sucesso!",_id,result})
                })
            })
    })


}