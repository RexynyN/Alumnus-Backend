const db = require('./dbconnect.js');

module.exports = {
    create(req, res) {
        const {
            usuario,
            agrupador,
            titulo,
            descricao,
            tempoConclusao,
            dataAtividade,
        } = req.body;


        let data = {
            IdUsuario: usuario,
            TempoCumpridoAtividade: '00:00:00',
            AgrupadorAtividade: agrupador,
            DescricaoAtividade: descricao,
            NumeroDeMetas: 0,
            Anotacao: '',
            PontosAtividade: 0,
            TempoPrevistoAtividade: tempoConclusao,
            TituloAtividade: titulo,
            DataAtividade: dataAtividade,
            SituacaoAtividade: 1
        };

        let sql = "INSERT INTO Atividade SET ?"
        db.query(sql, data,
            (err, result) => {
                if (err) return res.json({ mensagem: "Houve um erro ao criar a Atividade", sqlError: err, status: 2 });

                console.log(result)

                if (result.insertId != 0) {
                    return res.json({ mensagem: 'Atividade criada', status: 1 });
                } else {
                    return res.json({ mensagem: 'Houve um problema para criar a Atividade.', status: 2 });
                }
            });


    },


    closeActivity(req, res) {
        const { email, senha } = req.body;

        let sql = "SELECT * FROM usuario WHERE Email = ? AND Senha = ?";
        db.query(sql, [email, senha], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao fazer login' });

            if (result.length > 0) {
                return res.json({ mensagem: 'Autenticado' })
            } else {
                return res.json({ mensagem: 'Não há usuários com essas credenciais' });
            }

        });
    },

    delete(req, res) {
        const ActivityId  = req.params.id;

        let sql = "DELETE FROM Atividade WHERE IdAtividade = ?";
        db.query(sql, [ActivityId], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao deletar.', status: 2});


            if (result.affectedRows != 0) {
                return res.json({ mensagem: 'Atividade deletada.', status: 1 })
            } else {
                return res.json({ mensagem: 'A Atividade já foi deletada ou não existe.', status: 2  });
            }
        });
    },

    edit(req, res) {
        const { email, senha } = req.body;

        let sql = "SELECT * FROM Atividade WHERE ";
        db.query(sql, [email, senha], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao fazer login' });

            if (result.affectedRows != 0) {
                return res.json({ mensagem: 'Autenticado' })
            } else {
                return res.json({ mensagem: 'Não há usuários com essas credenciais' });
            }

        });
    },

    show(req, res) {
        const ActivityId = req.params.id;

        let sql = "SELECT * FROM Atividade WHERE IdAtividade = ?";
        db.query(sql, [ActivityId], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao buscar a Atividade.', sqlError: err, status: 2 });

            if (result[0]) {
                return res.json({ dados: result[0], status: 1 });
            } else {
                return res.json({ mensagem: 'Atividade não encontrada. Ela pode ter sido deletada ou não existe.', status: 2 });
            }
        });
    },

    list(req, res) {
        const { usuario, limite } = req.body;
        const pagina = req.params.page;

        let offSet;

        if (pagina == 1 || pagina == 0) {
            offSet = 0;
        } else {
            offSet = (pagina - 1) * limite;
        }

        let sql = "SELECT * FROM Atividade WHERE IdUsuario = ? LIMIT ? OFFSET ?;";
        db.query(sql, [usuario, limite, offSet], (err, result) => {
            if (err) return res.json({ mensagem: 'Houve um erro ao buscar as Atividades', sqlError: err,  status: 2  });

            if (result) {
                return res.json({ dados: result, status: 1});
            } else {
                return res.json({ mensagem: 'Usuário não encontrado.', status: 2 });
            }
        });
    },

    createDatabase(req, res) {
        // let sql = "create table Atividade (" +
        //     "IdAtividade int primary key auto_increment not null," +
        //     "IdUsuario int not null," +
        //     "TempoCumpridoAtividade time not null," +
        //     "AgrupadorAtividade varchar(50) not null," +
        //     "TituloAtividade varchar(100) not null," +
        //     "DescricaoAtividade varchar(800) not null," +
        //     "NumeroDeMetas int not null," +
        //     "Anotacao varchar(800) not null," +
        //     "PontosAtividade int not null," +
        //     "TempoPrevistoAtividade time not null," +
        //     "DataAtividade datetime not null," +
        //     "SituacaoAtividade tinyint not null," +
        //     "foreign key (IdUsuario) references Usuario(IdUsuario)" +
        //     ");";

        // db.query(sql, (err, result) => {
        //         if (err) return res.json({ mensagem: 'Houve um erro ao buscar as Atividades', sqlError: err,  status: 2  });
    
        //         if (result) {
        //             return res.json({ dados: result, status: 1});
        //         } 
        // });
    }
};
