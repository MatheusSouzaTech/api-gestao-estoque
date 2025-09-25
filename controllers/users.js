const {v4: uuidv4} = require("uuid")

module.exports = app =>{

    app.get("/users", (req,res)=>{
        app.db.query("SELECT * FROM Users", (err,result)=>{
            if(err){
                console.error("Erro ao buscar usuarios",err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            res.json(result)
        })
    })

    app.get("/users/:id", (req,res)=>{
        const {id} = req.params

        app.db.query("SELECT * FROM Users WHERE _id=?",[id],(err,result)=>{
            if(err){
                console.error("Erro ao buscar usuario!", err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.length ===0){
                return res.status(404).json({mensagem: "Usuario não encontrado"})
            }
            res.json(result[0])
        })
    })

    app.post("/users",(req,res)=>{
        const {nome,email,senha,role,status} = req.body
        const _id = uuidv4()

        app.db.query("INSERT INTO Users (_id,nome,email,senha,role,status) VALUES (?,?,?,?,?,?)",
            [_id,nome,email,senha,role,status],
            (err,result)=>{
                if(err){
                    console.error("Erro ao adicionar usuario", err)
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }
                res.status(201).json({mensagem: "Usuario adicionado!",_id,_id})
            }
        )
    })

    app.put("/users/:id", (req,res)=>{
        const {id} = req.params
        const {nome,email,senha,role,status} = req.body

        app.db.query("UPDATE Users SET nome=?, email=?, senha=?, role=?, status=? WHERE _id=?", 
            [nome,email,senha,role,status,id],
            (err,result)=>{
                if(err){
                    console.error("Erro ao atualizar usuario", err)
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }
                if(result.length === 0){
                    return res.status(404).json({mensagem: "Usuario não encontrado"})
                }
                res.status(201).json({mensagem: "Usuario atualizado com sucesso!"})
            })
    })

    app.delete("/users/:id", (req,res)=>{
        const {id} = req.params
        const {nome,email,senha,role,status} = req.body

        app.db.query("DELETE FROM Users WHERE _id=?", [nome,email,senha,role,status,id],
            (err,result)=>{
                if(err){
                    console.error("Erro ao deletar usuario")
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }
                if(result.length === 0){
                    return res.status(404).json({mensagem: "Usuario não encontrado!"})
                }
                res.status(201).json({mensagem: "Usuario deletado com sucesso!"})
            })
    })

}