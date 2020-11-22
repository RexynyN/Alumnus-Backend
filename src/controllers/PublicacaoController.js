const Pub = require('../models/Publicacao');


module.exports = {
    async feed(req, res) {
        const limite = req.query.limit;
        const pagina = req.query.page;

        if (!limite || !pagina) {
            return res.status(400).json({ status: 2, error: 'Parâmetros de URL inválidos' });
        }

        let offSet;

        if (pagina == 1 || pagina == 0) {
            offSet = 0;
        } else {
            offSet = (pagina - 1) * limite;
        }

        const pubs = await Pub.findAll({
            offset: offSet,
            limit: limite,
            order: [['createdAt', 'DESC']]
            
        });

        if (!pubs) {
            return res.status(400).json({ status: 2, error: 'Não foi possível achar atividades desse usuário' });
        }

        return res.json({ status: 1, pubs });
    },


    async create(req, res) {
        const { 
            titulo,
            conteudo
        } = req.body;

        if (!titulo || !conteudo) {
            return res.status(400).json({ status: 2, error: 'A publicação não foi criada, faltam campos ou os campos não atendem aos critérios' });
        }

        let data = {
            idUsuario: req.user.id,
            titulo: titulo,
            conteudo: conteudo,
            apreciacoes: 0
        };

        const pub = await Pub.create(data);

        if (!pub) {
            return res.status(400).json({ status: 2, error: 'Houve um erro ao criar a atividade' });
        }

        return res.json({ status: 1, pub });
    },

    //Deleta uma atividade
    async delete(req, res) {
        const pubId = req.params.id;

        if (!pubId) {
            return res.status(400).json({ status: 2, error: 'O ID da publicação é necessário' });
        }

        const pub = await Pub.findOne({
            where: {
                id: pubId,
                idUsuario: req.user.id
            }
        });

        if (!pub) {
            return res.status(400).json({ status: 2, error: 'Publicação não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        const response = await Pub.destroy({
            where: {
                id: pubId,
                idUsuario: req.user.id
            }
        });

        if (!response) {
            return res.status(400).json({ status: 2, error: 'Publicação não encontrada' });
        }

        return res.json({ status: 1, response });
    },

    //Edita uma atividade
    async edit(req, res) {
        const {
            id,
            titulo,
            conteudo,
        } = req.body;


        if (!id || !titulo || !conteudo) {
            return res.status(400).json({ status: 2, error: 'Faltam campos para atualizar a publicação' });
        }

        if(conteudo.length > 255){
            return res.status(400).json({ status: 2, error: 'Texto muito longo, máximo de 255' });
        }

        const response = await Pub.findOne({
            where: {
                id: id,
                idUsuario: req.user.id
            }
        });


        if (!response) {
            return res.status(400).json({ status: 2, error: 'Publicação não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        let data;

        if (!titulo && conteudo) {
            data = {
                id,
                conteudo
            }

        } else if (titulo && !conteudo) {
            data = {
                id,
                titulo
            }
        } else if (titulo && conteudo) {
            data = {
                id,
                titulo,
                conteudo
            }
        }

        const change = await Pub.update(data, { where: { id: id } });

        if (!change) {
            return res.status(400).json({ status: 2, error: "Não foi possível editar a publicação" })
        }

        return res.json({ status: 1, change });
    },

    //Mostra uma atividade pelo ID
    async show(req, res) {
        const pubId = req.params.id;

        if (!pubId) {
            return res.status(400).json({ status: 2, error: 'O ID da publicação é necessário' });
        }

        const pub = await Pub.findOne({
            where: {
                id: pubId,
                idUsuario: req.user.id
            }
        });

        if (!pub) {
            return res.status(400).json({ status: 2, error: 'Publicação não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        return res.json({ status: 1, pub });
    },

    async like(req, res) {
        const pubId = req.params.id;

        if (!pubId) {
            return res.status(400).json({ status: 2, error: 'O ID da publicação é necessário' });
        }

        const pub = await Pub.findOne({
            where: {
                id: pubId,
            }
        });

        if (!pub) {
            return res.status(400).json({ status: 2, error: 'Publicação não encontrada: Provavelmente não existe.' });
        }

        let likes = await pub.update({ apreciacoes: (pub.apreciacoes + 1) });

        if (!likes) {
            return res.status(400).json({ status: 2, error: 'Apreciação não registrada' });
        }

        likes = likes.apreciacoes;

        return res.json({ status: 1, likes });
    },

    async unlike(req, res) {
        const pubId = req.params.id;

        if (!pubId) {
            return res.status(400).json({ status: 2, error: 'O ID da publicação é necessário' });
        }

        const pub = await Pub.findOne({
            where: {
                id: pubId,
            }
        });

        if (!pub) {
            return res.status(400).json({ status: 2, error: 'Publicação não encontrada: Provavelmente não existe.' });
        }

        let likes = await pub.update({ apreciacoes: (pub.apreciacoes - 1) });

        if (!likes) {
            return res.status(400).json({ status: 2, error: 'Não foi possível retirar a apreciação' });
        }

        likes = likes.apreciacoes;

        return res.json({ status: 1, likes });
    },
};
