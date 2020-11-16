const Atv = require('../models/Atividade');
const User = require('../models/Usuario');


module.exports = {
    async index(req, res) {
        const limite = req.query.limit;
        const pagina = req.query.page;
        let offSet;

        if (pagina == 1 || pagina == 0) {
            offSet = 0;
        } else {
            offSet = (pagina - 1) * limite;
        }

        const atv = await Atv.findAll({
            where:
            {
                idUsuario: req.user.id
            },
            offset: offSet,
            limit: limite
        });

        if (!atv) {
            return res.status(400).json({ status: 2, error: 'Não foi possível achar atividades desse usuário' });
        }

        return res.json({ status: 1, atv });
    },


    async create(req, res) {
        const {
            agrupador,
            titulo,
            descricao,
            tempoConclusao,
            dataAtividade,
        } = req.body;

        let today = new Date();
        let date = new Date(dataAtividade);

        if (date <= today) {
            return res.status(400).json({ status: 2, error: 'A data da atividade já passou' });
        }

        if (tempoConclusao === "00:00:00") {
            return res.status(400).json({ status: 2, error: 'O tempo de conclusão é inválido' });
        }

        let data = {
            idUsuario: req.user.id,
            tempoCumprido: '00:00:00',
            agrupador: agrupador,
            descricao: descricao,
            numeroMetas: 0,
            anotacao: '',
            pontos: 0,
            tempoPrevisto: tempoConclusao,
            titulo: titulo,
            dataAtividade: dataAtividade,
            statusAtividade: 1
        };

        const atv = await Atv.create(data);

        if (!atv) {
            return res.status(400).json({ status: 2, error: 'Houve um erro ao criar a atividade' });
        }

        return res.json({ status: 1, atv });
    },

    //TODO
    async closeActivity(req, res) {
        const ActivityId = req.params.id;

        const response = await Atv.destroy({
            where: {
                id: ActivityId,
                idUsuario: req.user.id
            }
        });

        if (response.statusAtividade === 1) {
            const response = await Atv.update({ loginToken: refreshToken }, { where: { id: user.id } });

        } else {
            return res.status(400).json({ status: 2, error: 'A atividade já foi encerrada' });
        }
    },

    //Deleta uma atividade
    async delete(req, res) {
        const ActivityId = req.params.id;

        const response = await Atv.destroy({
            where: {
                id: ActivityId,
                idUsuario: req.user.id
            }
        });

        if (!response) {
            return res.status(400).json({ status: 2, error: 'Atividade não encontrada' });
        }

        if (response.tempoCumprido !== "00:00:00" || response.status !== 1) {
            return res.status(400).json({ status: 2, error: 'Atividade não pode ser deletada pois já foi iniciada' });
        }

        return res.json({ status: 1, response });
    },

    //TODO
    //Edita uma atividade
    async edit(req, res) {
        const {
            id,
            agrupador,
            titulo,
            descricao,
            tempoPrevisto,
            dataAtividade,
        } = req.body;


        const response = await Atv.findOne({
            where: {
                id: id,
                idUsuario: req.user.id
            }
        });


        if (!response) {
            return res.status(400).json({ status: 2, error: 'Atividade não encontrada' });
        }

        if(response.status != 2){
            return res.status(400).json({ status: 2, error: 'Atividade já foi terminada' });
        }

        let data;

        if (response.tempoCumprido != "00:00:00") {
            data = {
                id,
                agrupador,
                titulo,
                descricao,
            }

        } else {
            data = {
                id,
                agrupador,
                titulo,
                descricao,
                tempoPrevisto,
                dataAtividade,
            }
        }

        Atv.update(data, { where: { id: ActivityId } });

        return res.json({ status: 1, response });
    },


    async update(req, res) {
        const ActivityId = req.params.id;

        const {
            id,
            tempoCumprido,
            numeroMetas,
            anotacao,
            pontos,
        } = req.body;


        const response = await Atv.findOne({
            where: {
                id: ActivityId,
                idUsuario: req.user.id
            }
        });


        if (!response) {
            return res.status(400).json({ status: 2, error: 'Atividade não encontrada' });
        }

        if (response.status != 2) {
            let data = {
                id,
                tempoCumprido,
                numeroMetas,
                anotacao,
                pontos,
            }

            const update = Atv.update(data, { where: { id: ActivityId } });

            if (!update) {
                return res.status(400).json({ status: 2, error: 'Não foi possível atualizar a atividade' });
            }    

            return res.json({ status: 1, update});

        } else {
            return res.status(400).json({ status: 2, error: 'A atividade já foi fechada, não pode ser editada' });
        }
    },

    //Mostra uma atividade pelo ID
    async show(req, res) {
        const ActivityId = req.params.id;

        const response = await Atv.findOne({
            where: {
                id: ActivityId,
                idUsuario: req.user.id
            }
        });

        if (!response) {
            return res.status(400).json({ status: 2, error: 'Atividade não encontrada' });
        }

        return res.json({ status: 1, response});
    },

};
