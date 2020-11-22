const User = require('../models/Usuario');
const Auth = require('../controllers/AuthController');
const crypto = require('crypto');
const { Op } = require('sequelize');
const Val = require('../helpers/ValidationHelper');


module.exports = {

    //Rota: user/signup
    async signup(req, res) {

        let { email, senha, confirmaSenha, nickname } = req.body;

        if (email && senha && confirmaSenha && nickname) {

            if (email.length > 255) {
                return res.status(400).json({ error: 'O email é grande demais', status: 2 });
            }

            if (nickname.length > 50) {
                return res.status(400).json({ status: 2, error: "O nickname é grande demais" });
            }

            if (senha.length < 8 || senha.length > 20) {
                return res.status(400).json({ error: 'A senha deve ter no mínimo 8 e no máximo 20 dígitos', status: 2 });
            }

            if (senha != confirmaSenha) {
                return res.status(400).json({ error: 'As senhas digitadas não coincidem', status: 2 });
            }

            let response = await User.findOne({
                where:
                {
                    email: email
                }
            });

            if (response) {
                return res.status(400).json({ error: 'Este email já está sendo utilizado', status: 2 });
            }

            nickname = nickname.trim();

            response = await User.findOne({
                where:
                {
                    nickname: nickname
                }
            });

            if (response) {
                return res.status(400).json({ error: 'Este nickname já está sendo utilizado', status: 2 });
            }

            const hashSenha = crypto.createHash('sha256').update(senha).digest('hex');

            let data = {
                email: email,
                senha: hashSenha,
                nickname: nickname,
                descricaoPerfil: "",
                pontuacao: 0,
                avatar: 1,
                tipoUsuario: 1,
            };

            let user = await User.create(data);

            if (!user) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao criar o usuário' });
            }

            const tokens = await Auth.directLogin(user.id, user.email, senha, user.nickname, user.tipoUsuario);

            user.senha = "<Oculto>";

            return res.json({ status: 1, user, tokens });
        } else {
            return res.status(400).json({ status: 2, error: 'Faltam campos para criar um novo usuário' });
        }

    },

    //Deleta uma atividade
    async delete(req, res) {
        const { email, senha } = req.body;

        if (!email || email.length > 255) {
            return res.status(400).json({ status: 2, error: "O campo 'email' está incorreto" });
        }

        if (!senha || senha.length > 20) {
            return res.status(400).json({ status: 2, error: "Falta o campo 'senha'" });
        }

        if (email !== req.user.email || senha !== req.user.senha) {
            return res.status(400).json({ status: 2, error: 'Houve um conflito de credenciais, informe o email e senha corretos para deletar o usuário' });
        }

        let user = await User.findOne({ where: { id: req.user.id } });

        if (!user) {
            return res.status(400).json({ status: 2, error: 'Houve um problema ao retornar o usuário, provavelmente já foi deletado', user });
        }

        response = await user.update({ loginToken: "" });

        if (!response) {
            return res.status(400).json({ status: 2, error: 'Não foi possível sair da conta' });
        }

        const final = await user.destroy();

        if (!final) {
            return res.status(400).json({ status: 2, error: 'Houve um problema ao apagar o usuário, provavelmente já foi deletado', request });
        }

        return res.json({ status: 1 });
    },


    async edit(req, res) {
        let {
            nickname,
            descricaoPerfil,
            avatar,
        } = req.body;

        const user = await User.findOne({
            where: {
                id: req.user.id,
            }
        });

        if (!user) {
            return res.status(400).json({ status: 2, error: 'Usuário não encontrado' });
        }

        if (nickname && nickname != "" && nickname != " ") {

            if (nickname.length > 50) {
                return res.status(400).json({ status: 2, error: "O nickname é grande demais" });
            }

            nickname = nickname.trim();

            let response = await User.findOne({
                where: {
                    nickname: nickname
                }
            });

            if (response) {
                return res.status(400).json({ status: 2, error: 'Este nickname já está sendo usado' });
            }

            response = await user.update({ nickname: nickname });

            if (!response) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao mudar o nickname' });
            }
        }

        let change = null;

        if (descricaoPerfil && avatar) {
            if (descricaoPerfil.length > 255) {
                return res.status(400).json({ status: 2, error: "A descrição é grande demais" });
            }

            avatar = Number(avatar);

            change = await user.update({ descricaoPerfil, avatar });

            if (!change) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao mudar o nickname' });
            }

        } else if (!descricaoPerfil && avatar) {
            avatar = Number(avatar);

            change = await user.update({ avatar });

            if (!change) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao mudar o nickname' });
            }

        } else if (descricaoPerfil && !avatar) {
            if (descricaoPerfil.length > 255) {
                return res.status(400).json({ status: 2, error: "A descrição é grande demais" });
            }

            change = await user.update({ descricaoPerfil });

            if (!change) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao mudar o nickname' });
            }
        }

        return res.json({ status: 1, user });
    },

    async editPassword(req, res) {
        const { senha, confirmaSenha, novaSenha, confirmaNovaSenha } = req.body;

        if (!senha || !confirmaSenha || !novaSenha || !confirmaNovaSenha) {
            return res.status(400).json({ status: 2, error: "Faltam campos para concluir sua requisição" });
        }

        if (senha != confirmaSenha) {
            return res.status(400).json({ error: 'As senhas digitadas não coincidem', status: 2 });
        }

        if (novaSenha.length > 20) {
            return res.status(400).json({ status: 2, error: "A nova senha é muito grande" });
        }

        if (novaSenha != confirmaNovaSenha) {
            return res.status(400).json({ error: 'As novas senhas digitadas não coincidem', status: 2 });
        }

        if (senha !== req.user.senha) {
            return res.status(400).json({ status: 2, error: 'Houve um conflito de credenciais, informe a senha correta para mudá-la' });
        }

        let hashSenha = crypto.createHash('sha256').update(senha).digest('hex');

        const response = await User.findOne({
            where:
            {
                [Op.and]: [{ id: req.user.id }, { senha: hashSenha }]
            }
        });

        if (!response) {
            return res.status(400).json({ error: 'A senha está incorreta', status: 2 });
        }

        if (novaSenha.length < 8 || novaSenha.length > 32) {
            return res.status(400).json({ error: 'A nova senha deve ter no mínimo 8 e no máximo 32 dígitos', status: 2 });
        }

        hashSenha = crypto.createHash('sha256').update(novaSenha).digest('hex');

        const change = response.update({ senha: hashSenha });

        if (!change) {
            return res.status(400).json({ error: 'Houve um problema para mudar a senha', status: 2 });
        }

        const tokens = await Auth.directLogin(response.id, response.email, novaSenha, response.nickname, response.tipoUsuario);

        return res.json({ status: 1, tokens });

    },

    async show(req, res) {
        let id = null;
        const self = req.query.self;

        if (self === true || self === "true") {
            id = req.user.id;
        } else if (req.query.id) {
            id = req.query.id;
        } else {
            return res.status(400).json({ status: 2, error: "Falta o parâmetro de busca para concluir sua requisição" });
        }

        const response = await User.findOne({
            where: {
                id: id,
            }
        });

        if (!response) {
            return res.status(400).json({ status: 2, error: 'Usuário não encontrado' });
        }

        let user = {
            id: response.id,
            nickname: response.nickname,
            descricaoPerfil: response.descricaoPerfil,
            pontuacao: response.pontuacao,
            avatar: response.avatar,
            createdAt: response.createdAt,
        }

        return res.json({ status: 1, user });
    },

    async list(req, res) {
        const limite = req.query.limit;
        const pagina = req.query.page;
        let offSet;

        if (!limite || !pagina) {
            return res.status(400).json({ status: 2, error: "Faltam parâmetros para concluir sua requisição" });
        }

        if (pagina == 1 || pagina == 0) {
            offSet = 0;
        } else {
            offSet = (pagina - 1) * limite;
        }

        const response = await User.findAll({
            offset: offSet,
            limit: limite
        });

        if (!response) {
            return res.status(400).json({ status: 2, error: 'Não foi possível achar atividades desse usuário' });
        }

        let users = [];

        response.forEach(user => {
            users.push({
                id: user.id,
                nickname: user.nickname,
                descricaoPerfil: user.descricaoPerfil,
                pontuacao: user.pontuacao,
                avatar: user.avatar,
                createdAt: user.createdAt,
            });
        });

        return res.json({ status: 1, users });
    },

    async ranking(req, res) {
        const top = req.query.top;

        // const max = await User.max('pontuacao');

        if (!top) {
            return res.status(400).json({ status: 2, error: "O parâmetro de 'top' está faltando" });
        }

        const response = await User.findAll({
            limit: top,
            order: [['pontuacao', 'DESC']]
        });


        if (!response) {
            return res.status(400).json({ status: 2, error: 'Houve um erro ao recuperar o ranking' });
        }

        let usuarios = [];

        response.forEach(user => {
            usuarios.push({
                id: user.id,
                nickname: user.nickname,
                descricaoPerfil: user.descricaoPerfil,
                pontuacao: user.pontuacao,
                avatar: user.avatar,
                createdAt: user.createdAt,
            });
        });

        return res.json({ status: 1, usuarios })
    },


    async signupADM(req, res) {

        let { email, senha, confirmaSenha, nickname, segredo } = req.body;

        if (segredo == process.env.ADM_SECRET || req.user.tipoUsuario == 2) {
            if (email && senha && confirmaSenha && nickname) {

                if (email.length > 255) {
                    return res.status(400).json({ error: 'O email é grande demais', status: 2 });
                }

                if (nickname.length > 50) {
                    return res.status(400).json({ status: 2, error: "O nickname é grande demais" });
                }

                if (senha.length < 8 || senha.length > 20) {
                    return res.status(400).json({ error: 'A senha deve ter no mínimo 8 e no máximo 20 dígitos', status: 2 });
                }

                if (senha != confirmaSenha) {
                    return res.status(400).json({ error: 'As senhas digitadas não coincidem', status: 2 });
                }

                let response = await User.findOne({
                    where:
                    {
                        email: email
                    }
                });

                if (response) {
                    return res.status(400).json({ error: 'Este email já está sendo utilizado', status: 2 });
                }

                nickname = nickname.trim();

                response = await User.findOne({
                    where:
                    {
                        nickname: nickname
                    }
                });

                if (response) {
                    return res.status(400).json({ error: 'Este nickname já está sendo utilizado', status: 2 });
                }

                const hashSenha = crypto.createHash('sha256').update(senha).digest('hex');

                let data = {
                    email: email,
                    senha: hashSenha,
                    nickname: nickname,
                    descricaoPerfil: "",
                    pontuacao: 0,
                    avatar: 1,
                    tipoUsuario: 2,
                };

                let user = await User.create(data);

                if (!user) {
                    return res.status(400).json({ status: 2, error: 'Houve um erro ao criar o usuário' });
                }

                const tokens = await Auth.directLogin(user.id, user.email, senha, user.nickname, user.tipoUsuario);

                user.senha = "<Oculto>";

                return res.json({ status: 1, user, tokens });
            } else {
                return res.status(400).json({ status: 2, error: 'Faltam campos para criar um novo usuário' });
            }
        }else{
            return res.status(400).json({ status: 2, error: 'Você não tem permissão para criar um administrador' });
        }

    },
};
