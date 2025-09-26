
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config({path: "./config/.env"});
const JWT_SECRET = process.env.JWT_SECRET;



module.exports = app => {

    app.get("/users", (req, res) => {
        app.db.query("SELECT * FROM Users", (err, result) => {
            if (err) {
                console.error("Erro ao buscar usuarios", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            res.json(result)
        })
    })

    app.get("/users/:id", (req, res) => {
        const { id } = req.params

        app.db.query("SELECT * FROM Users WHERE _id=?", [id], (err, result) => {
            if (err) {
                console.error("Erro ao buscar usuario!", err)
                return res.status(500).json({ mensagem: "Erro no servidor" })
            }
            if (result.length === 0) {
                return res.status(404).json({ mensagem: "Usuario não encontrado" })
            }
            res.json(result[0])
        })
    })

    app.post("/users", async (req, res) => {
        const { nome, email, senha, role, status } = req.body
        const _id = uuidv4()

        app.db.query("SELECT * FROM Users WHERE email=?", [email], async (err, result) => {
            if (err) return res.status(500).json({ mensagem: "Erro no servidor" })

            if (result.length > 0) {
                return res.status(400).json({ mensagem: "Usuario existente!" })
            }
            const hash = await bcrypt.hash(senha, 10)

            app.db.query("INSERT INTO Users (_id,nome,email,senha,role,status) VALUES (?,?,?,?,?,?)",
                [_id, nome, email, hash, role, status],
                (err, result) => {
                    if (err) {
                        console.error("Erro ao adicionar usuario", err)
                        return res.status(500).json({ mensagem: "Erro no servidor" })
                    }
                    res.status(201).json({ mensagem: "Usuario adicionado!", _id, _id })
                }
            )
        })


    })

    app.put("/users/:id", async (req, res) => {
        const { id } = req.params
        const { nome, email, senha, role, status } = req.body

        const hash = await bcrypt.hash(senha, 10);

        app.db.query("UPDATE Users SET nome=?, email=?, senha=?, role=?, status=? WHERE _id=?",
            [nome, email, hash, role, status, id],
            (err, result) => {
                if (err) {
                    console.error("Erro ao atualizar usuario", err)
                    return res.status(500).json({ mensagem: "Erro no servidor" })
                }
                if (result.affectedrows === 0) {
                    return res.status(404).json({ mensagem: "Usuario não encontrado" })
                }
                res.status(201).json({ mensagem: "Usuario atualizado com sucesso!" })
            })
    })

    app.delete("/users/:id", (req, res) => {
        const { id } = req.params

        app.db.query("DELETE FROM Users WHERE _id=?", [id],
            (err, result) => {
                if (err) {
                    console.error("Erro ao deletar usuario")
                    return res.status(500).json({ mensagem: "Erro no servidor" })
                }
                if (result.affectedrows === 0) {
                    return res.status(404).json({ mensagem: "Usuario não encontrado!" })
                }
                res.status(201).json({ mensagem: "Usuario deletado com sucesso!" })
            })
    })

    app.post("/users/login", (req, res) => {
        const { email, senha } = req.body

        app.db.query("SELECT * FROM Users WHERE email=?", [email], async (err, result) => {
            if (err) return res.status(500).json({ mensagem: "Erro no servidor" })

            if (result.length === 0) {
                return res.status(401).json({ mensagem: "Credencial email invalida!" })
            }
            const user = result[0]

            const validPass = await bcrypt.compare(senha, user.senha)
            if (!validPass) {
                return res.status(401).json({ mensagem: "Credencial senha invalida!" })
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" }

            )

            res.json({ mensagem: "Login bem sucedido!", token })

        })
    })

    
}