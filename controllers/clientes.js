const {v4: uuidv4} = require("uuid")

module.exports = app =>{
    app.get("/clients", (req,res)=>{
        app.db.query("SELECT * FROM Clients", (err,result)=>{
            if(err){
                console.error("Clientes não encontrados!", err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            res.json(result)
        })
    })

    app.get("/clients/:id", (req,res)=>{
        const {id} = req.params
        app.db.query("SELECT * FROM Clients WHERE _id=?",[id], (err,result)=>{
            if(err){
                console.error("Cliente não encontrado!", err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.length === 0){
                return res.status(400).json({mensagem: "Cliente não encontrado!"})
            }  
            res.json(result[0])
        })  
    })

    app.post("/clients", (req,res)=>{
        const {nome, cnpjCpf,endereco_rua,endereco_numero,endereco_complemento,endereco_bairro,endereco_cidade,endereco_estado,endereco_cep,contato_telefone,contato_email,observacoes,status} = req.body
        const _id = uuidv4()

        app.db.query("INSERT INTO Clients (_id, nome, cnpjCpf,endereco_rua,endereco_numero,endereco_complemento,endereco_bairro,endereco_cidade,endereco_estado,endereco_cep,contato_telefone,contato_email,observacoes,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [_id,nome, cnpjCpf,endereco_rua,endereco_numero,endereco_complemento,endereco_bairro,endereco_cidade,endereco_estado,endereco_cep,contato_telefone,contato_email,observacoes,status], 
            (err,result)=>{
                if(err){
                    console.error("Erro ao adicionar cliente", err)
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }
                res.status(201).json({mensagem: "Cliente adicionado com sucesso",_id,_id})
            })
    })

    app.put("/clients/:id",(req,res)=>{
        const {id} = req.params
        const {nome, cnpjCpf,endereco_rua,endereco_numero,endereco_complemento,endereco_bairro,endereco_cidade,endereco_estado,endereco_cep,contato_telefone,contato_email,observacoes,status} = req.body

        app.db.query("UPDATE Clients SET nome=?, cnpjCpf=?, endereco_rua=?, endereco_numero=?, endereco_complemento=?, endereco_bairro=?, endereco_cidade=?, endereco_estado=?, endereco_cep=?, contato_telefone=?, contato_email=?, observacoes=?, status=? WHERE _id=?",
            [nome, cnpjCpf,endereco_rua,endereco_numero,endereco_complemento,endereco_bairro,endereco_cidade,endereco_estado,endereco_cep,contato_telefone,contato_email,observacoes,status,id],
        (err,result)=>{
            if(err){
                console.error("Erro ao atualizar cliente", err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.length === 0){
                return res.status(404).json({mensagem: "Cliente não encontrado"})
            }
            res.status(201).json({mensagem: "Cliente atualizado com sucesso!"})
        })
    })

    app.delete("/clients/:id", (req,res)=>{
            const {id} = req.params
            app.db.query("DELETE FROM Clients WHERE _id=?",[id], (err,result)=>{
                if(err){
                    console.error("Erro ao deletar cliente")
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }
                if(result.length === 0){
                    return res.status(404).json({mensagem: "Cliente não encontrado"})
                }
                res.status(201).json("Cliente deletado com sucesso!")
            })
        })




}