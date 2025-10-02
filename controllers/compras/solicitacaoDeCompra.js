const {v4:uuidv4} = require("uuid")

module.exports = app =>{
    
    app.get("/solicitacao-de-compra",(req,res)=>{

        app.db.query("SELECT * FROM PuschaseRequests",(err,result)=>{
            if(err){
                console.error("Erro ao buscar solicitaçoes",err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            res.json(result)
        })
    })

    app.get("/solicitacao-de-compra/:id",(req,res)=>{
        const {id} = req.params

        app.db.query("SELECT * FROM PuschaseRequests WHERE _id=?",[id],(err,result)=>{
            if(err){
                console.error("Erro ao solicitação",err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.length === 0){
                return res.status(400).json({mensagem: "Solicitação não encontrada"})
            }
            res.json(result[0])
        })
    })
    

}