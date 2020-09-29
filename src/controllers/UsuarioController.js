// const Dev = require('../models/Dev');
const db = require('./dbconnect.js');
const dateFormat = require('dateformat');

module.exports = {

    /// Rota: user/signup
    signup(req, res) {
        const { email, senha, confirmaSenha, nickname } = req.body;

        if (email && senha && confirmaSenha) {
            if (senha.length < 8 || senha.length > 32) {
                return res.json({ mensagem: 'A senha não atende os padrões para criar um usuário.', status: 2 });}

            if (senha != confirmaSenha) {
                return res.json({ mensagem: 'As senhas digitadas não coincidem', status: 2 })}


            let sql = "SELECT IdUsuario, Email FROM Usuario WHERE Email = ?";
            db.query(sql, email, (err, result) => {
                if (err) return res.json({ mensagem: 'Houve um problema para criar o usuário.', sqlError: err, status: 2 });

                if (result.length > 0) {
                    return res.json({ mensagem: 'Já existe um usuário com esse email', status: 2 });
                }
                else {
                    let hoje = new Date();
                    dateFormat(hoje, "yyyy-mm-dd hh:MM:ss");

                    let data = {
                        Email: email,
                        Senha: senha,
                        Nickname: nickname,
                        DescricaoPerfil: "",
                        Pontuacao: 0,
                        Avatar: 1,
                        TipoUsuario: 1,
                        DataCriacao: hoje 
                    }; 

                    sql = 'INSERT INTO Usuario SET ?';
                    db.query(sql, data, (err, result) => {
                        if (err) return res.json({ mensagem: 'Houve um problema para criar o usuário.', sqlError: err, status: 2 });


                        if (result.insertId != 0) {
                            return res.json({ mensagem: 'Usuário criado', status: 1 });
                        } else {
                            return res.json({ mensagem: 'Houve um problema para criar o usuário.', status: 2  });
                        }
                    });
                }
            });
        } else {
            return res.json({ mensagem: 'Coloque um usuário e senha', status: 2 })
        }
    },

    login(req, res) {
        const { email, senha } = req.body;

        let sql = "SELECT * FROM Usuario WHERE Email = ? AND Senha = ?";
        db.query(sql, [email, senha], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao fazer login', sqlError: err, status: 2 });

            if (result.length > 0) {
                return res.json({ mensagem: 'Autenticado', status: 1})
            } else {
                return res.json({ mensagem: 'Não há usuários com essas credenciais', status: 2 });
            }

        });
    },

    delete(req, res) {
        const { usuario, email, senha } = req.body;

        let sql = "DELETE FROM Usuario WHERE IdUsuario = ?, Email = ?, Senha = ?";
        db.query(sql, [usuario, email, senha], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao deletar.', sqlError: err, status: 2});


            if (result.affectedRows != 0) {
                return res.json({ mensagem: 'Usuário deletado.', status: 1})
            } else {
                return res.json({ mensagem: 'O usuário já foi deletado ou não existe.', status: 2 });
            }
        });
    },

    edit(req, res) {
        const { email, senha } = req.body;

        let sql = "SELECT * FROM usuario WHERE Email = ? AND Senha = ?";
        db.query(sql, [email, senha], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao fazer login', status: 2 });

            if (result.affectedRows != 0) {
                return res.json({ mensagem: 'Autenticado', status: 2  })
            } else {
                return res.json({ mensagem: 'Não há usuários com essas credenciais', status: 2  });
            }

        });
    },

    show(req, res) {
        const UserId = req.params.id;

        let sql = "SELECT * FROM Usuario WHERE IdUsuario = ?";
        db.query(sql, [UserId], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao buscar o usuário', sqlError: err, status: 2 });

            if (result[0]) {
                return res.json({ Dados: result[0], status: 1 });
            } else {
                return res.json({ mensagem: 'Usuário não encontrado.', status: 2 });
            }
        });
    },

    list(req, res) {
        const { limite } = req.body;
        const pagina = req.params.page;

        let offSet;

        if (pagina == 0 || pagina == 1) {
            offSet = 0;
        } else {
            offSet = (pagina - 1) * limite;
        }

        let sql = "SELECT * FROM Usuario LIMIT ? OFFSET ?;";
        db.query(sql, [limite, offSet], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao buscar os usuários', sqlError: err, status: 2});

            if (result) {
                return res.json({ dados: result, status: 1 });
            } else {
                return res.json({ densagem: 'Usuários não encontrados.', status: 2 });
            }
        });
    }


};
