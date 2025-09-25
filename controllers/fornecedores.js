const { v4: uuidv4} = require('uuid')

module.exports = app => {

    app.get('/suppliers', (req,res) =>{
        app.db.query("SELECT * FROM Suppliers", (err,result)=>{
            if(err){
                console.error("Error ao buscar fornecedores",err)
                return res.status(500).json({mensagem: "Erro no servidor!"})
            }
            res.json(result)
        })
    })

    app.get("/suppliers/:id", (req,res)=>{
        const { id } = req.params
        app.db.query("SELECT * FROM Suppliers WHERE _id=?",[id],(err,result)=>{
            if(err){
                console.error("Erro ao buscar fornecedor", err)
                return res.status(500).json({ mensagem: "Erro no servidor!"})
            }
            if(result.length === 0 ){
                return res.status(400).json({mensagem: "Fornecedor não encontrado!"})
            }
            res.json(result[0])
        })
    })

    app.post("/suppliers", (req,res)=>{
        const {razaoSocial, cnpjCpf,enderecoRua, enderecoNumero, enderecoComplemento, enderecoBairro,enderecoCidade,enderecoEstado,enderecoCep,contatoTelefone,contatoEmail,contatoSite,observacoes,status} = req.body
        const _id = uuidv4()

        app.db.query("INSERT INTO Suppliers (_id,razaoSocial,cnpjCpf,endereco_rua,endereco_numero,endereco_complemento,endereco_bairro,endereco_cidade,endereco_estado,endereco_cep,contato_telefone,contato_email,contato_site,observacoes,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [_id,razaoSocial, cnpjCpf,enderecoRua, enderecoNumero, enderecoComplemento, enderecoBairro,enderecoCidade,enderecoEstado,enderecoCep,contatoTelefone,contatoEmail,contatoSite,observacoes,status],(err,result)=>{
                if(err){
                    console.error("Erro ao adicionar o fornecedor!", err)
                    return res.status(500).json({mensagem: "Erro no servidor"})
                }
                res.status(201).json({mensagem: "Fornecedor adicionado!", _id: _id})
            })

    })
    app.put("/suppliers/:id", (req,res)=>{
        const {id} = req.params
        const {razaoSocial, cnpjCpf,enderecoRua, enderecoNumero, enderecoComplemento, enderecoBairro,enderecoCidade,enderecoEstado,enderecoCep,contatoTelefone,contatoEmail,contatoSite,observacoes,status} = req.body

        app.db.query("UPDATE suppliers SET razaoSocial=?, cnpjCpf=?, endereco_rua=?, endereco_numero=?,endereco_complemento=?, endereco_bairro=?, endereco_cidade=?,endereco_estado=?,endereco_cep=?,contato_telefone=?,contato_email=?, contato_site=?,observacoes=?,status=? WHERE _id=?",[razaoSocial, cnpjCpf,enderecoRua, enderecoNumero, enderecoComplemento, enderecoBairro,enderecoCidade,enderecoEstado,enderecoCep,contatoTelefone,contatoEmail,contatoSite,observacoes,status,id], (err,result)=>{
            if(err){
                console.error("Erro ao atualizar o fornecedor", err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.affectedRows ===0){
                return res.status(404).json({mensagem: "Fornecedor não encontrado"})
            }
            res.status(201).json({mensagem: "Fornecedor atualizado com sucesso!",id:id})
        })
    })

    app.delete("/suppliers/:id",(req,res)=>{
        const {id} = req.params

        app.db.query("DELETE FROM Suppliers WHERE _id=?", [id], (err,result)=>{
            if(err){
                console.error("Erro ao deletar Fornecedor!", err)
                return res.status(500).json({mensagem: "Erro no servidor"})
            }
            if(result.affectedRows === 0 ){
                return res.status(404).json({mensagem: "Fornecedor não encontrado ou já deletado!"})
            }
            res.status(201).json({mensagem: "Fornecedor deletado com sucesso!"})
        })
    })

}