const Atv = require('../models/Atividade');
const User = require('../models/Usuario');
const { Op } = require('sequelize');

module.exports = {
    async index(req, res) {
        const limite = req.query.limit;
        const pagina = req.query.page;

        if (!limite || !pagina) {
            return res.json({ status: 2, error: 'Parâmetros de URL inválidos' });
        }

        let offSet;

        if (pagina == 1 || pagina == 0) {
            offSet = 0;
        } else {
            offSet = (pagina - 1) * limite;
        }

        const activities = await Atv.findAll({
            where:
            {
                idUsuario: req.user.id
            },
            offset: offSet,
            limit: limite
        });

        if (!activities) {
            return res.json({ status: 2, error: 'Não foi possível achar atividades desse usuário' });
        }

        return res.json({ status: 1, activities });
    },

    async agenda (req, res){
        const { dataInicio, dataFinal } = req.body;

        if (!dataInicio || !dataFinal) {
            return res.json({ status: 2, error: 'Faltam campos para retornar a agenda' });
        }

        let startDate = new Date(dataInicio);
        let endDate = new Date(dataFinal);

        if(dataInicio > dataFinal) {
            return res.json({ status: 2, error: 'As datas estão fora de ordem cronológica' });
        }

        const atividades = await Atv.findAll({
            where: {
                dataAtividade: {
                    [Op.between]: [startDate, endDate]
                },
                idUsuario: req.user.id,
                order: [['dataAtividade', 'ASC']]
            }
        });

        if (!atividades) {
            return res.json({ status: 2, error: 'Houve um erro ao recuperar sua agenda' });
        }

        return res.json({ status: 1, atividades })
    },


    async create(req, res) {
        const {
            agrupador,
            titulo,
            descricao,
            tempoConclusao,
            dataAtividade,
        } = req.body;

        if (!agrupador || !titulo || !descricao || !tempoConclusao || !dataAtividade) {
            return res.json({ status: 2, error: 'Faltam campos para criar uma atividade' });
        }

        let today = new Date();
        let startDate = new Date(dataAtividade);
        let endDate = new Date(dataAtividade);
        let hourMin = tempoConclusao.split(":");
        endDate.setHours(endDate.getHours() + Number(hourMin[0]));
        endDate.setMinutes(endDate.getMinutes() + Number(hourMin[1]));

        if (startDate <= today) {
            return res.json({ status: 2, error: 'A data da atividade já passou' });
        }

        if (tempoConclusao === "00:00") {
            return res.json({ status: 2, error: 'O tempo de conclusão é inválido' });
        }

        const response = await Atv.findOne({
            where: {
                dataAtividade: {
                    [Op.between]: [startDate, endDate]
                },
                idUsuario: req.user.id,
            }
        });

        console.log(response)

        if (response) {
            return res.json({ status: 2, error: 'Já existe uma atividade neste data/horário' });
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
            return res.json({ status: 2, error: 'Houve um erro ao criar a atividade' });
        }

        return res.json({ status: 1, atv });
    },

    //TODO
    async closeActivity(req, res) {
        const {
            id,
            tempoCumprido,
            numeroMetas,
            anotacao,
        } = req.body;

        if (!id) {
            return res.json({ status: 2, error: 'Falta o ID da atividade' });
        }

        if (!tempoCumprido) {
            return res.json({ status: 2, error: 'Falta o tempo cumprido da atividade ' });
        }

        const response = await Atv.findOne({
            where: {
                id: id,
                idUsuario: req.user.id
            }
        });

        if (!response) {
            return res.json({ status: 2, error: 'Atividade não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.json({ status: 2, error: 'Houve um erro ao recuperar o usuário' });
        }

        if (response.statusAtividade !== 1) {
            return res.json({ status: 2, error: 'Atividade já foi terminada' });
        }

        let previsto = new Date(response.dataAtividade);
        let hourMin = response.tempoPrevisto.split(":");
        previsto.setHours(previsto.getHours() + Number(hourMin[0]));
        previsto.setMinutes(previsto.getMinutes() + Number(hourMin[1]));
        let real = new Date(response.dataAtividade);
        hourMin = tempoCumprido.split(":");
        real.setHours(real.getHours() + Number(hourMin[0]));
        real.setMinutes(real.getMinutes() + Number(hourMin[1]));

        let razao = (previsto.getTime() - real.getTime());

        if (razao === 0)
            razao = 60000;

        let pontos = razao / 30000;

        if(pontos > 30){
            pontos = 30
        }else if(pontos < -30){
            pontos = -30;
        }

        const change = await response.update({
            statusAtividade: 2,
            pontos: pontos,
            numeroMetas,
            anotacao,
            tempoCumprido
        });

        if (!change) {
            return res.json({ status: 2, error: 'Houve um erro ao fechar a atividade.' });
        }

        const points = await User.update({
            pontuacao: (user.pontuacao + pontos)
        },
            {
                where: {
                    id: req.user.id,
                }
            });

        if (!points) {
            return res.json({ status: 2, error: 'Houve um erro ao atribuir os pontos.' });
        }

        return res.json({ status: 1 });
    },

    async cancelActivity(req, res) {
        const {
            id,
        } = req.body;

        if (!id) {
            return res.json({ status: 2, error: 'Falta o ID da atividade' });
        }

        const response = await Atv.findOne({
            where: {
                id: id,
                idUsuario: req.user.id
            }
        });

        if (!response) {
            return res.json({ status: 2, error: 'Atividade não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.json({ status: 2, error: 'Houve um erro ao recuperar o usuário' });
        }

        if (response.statusAtividade !== 1) {
            return res.json({ status: 2, error: 'Atividade já foi terminada' });
        }

        let pontos = -3;

        const change = await response.update({
            statusAtividade: 2,
            pontos: pontos,
        });

        if (!change) {
            return res.json({ status: 2, error: 'Houve um erro ao cancelar a atividade.' });
        }

        const points = await User.update({
            pontuacao: (user.pontuacao + pontos)
        },
            {
                where: {
                    id: req.user.id,
                }
            });

        if (!points) {
            return res.json({ status: 2, error: 'Houve um erro ao atribuir os pontos.' });
        }

        return res.json({ status: 1 });
    },
 
    //Deleta uma atividade
    async delete(req, res) {
        const ActivityId = req.params.id;

        if (!ActivityId) {
            return res.json({ status: 2, error: 'O ID da atividade é necessário' });
        }


        const atv = await Atv.findOne({
            where: {
                id: ActivityId,
                idUsuario: req.user.id
            }
        });

        if (!atv) {
            return res.json({ status: 2, error: 'Atividade não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        if (atv.statusAtividade !== 1) {
            return res.json({ status: 2, error: 'A atividade não pode ser deletada, pois já foi terminada' });
        }

        
        if (atv.tempoCumprido !== "00:00:00" || atv.statusAtividade !== 1) {
            return res.json({ status: 2, error: 'Atividade não pode ser deletada pois já foi iniciada' });
        }


        const response = await Atv.destroy({
            where: {
                id: ActivityId,
                idUsuario: req.user.id
            }
        });

        if (!response) {
            return res.json({ status: 2, error: 'Atividade não encontrada' });
        }

        return res.json({ status: 1, response });
    },

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
            return res.json({ status: 2, error: 'Atividade não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        if (response.statusAtividade !== 1) {
            return res.json({ status: 2, error: 'Atividade já foi terminada' });
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

        const change = await Atv.update(data, { where: { id: id } });

        return res.json({ status: 1, change });
    },


    async update(req, res) {
        const {
            id,
            tempoCumprido,
            numeroMetas,
            anotacao,
        } = req.body;

        if (!id || !tempoCumprido || !numeroMetas || !anotacao) {
            return res.json({ status: 2, error: 'Faltam campos para atualizar a atividade' });
        }

        const response = await Atv.findOne({
            where: {
                id: id,
                idUsuario: req.user.id
            }
        });


        if (!response) {
            return res.json({ status: 2, error: 'Atividade não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        if (response.status != 2) {
            let data = {
                id,
                tempoCumprido,
                numeroMetas,
                anotacao,
            }

            const update = Atv.update(data, { where: { id: ActivityId } });

            if (!update) {
                return res.json({ status: 2, error: 'Não foi possível atualizar a atividade' });
            }

            return res.json({ status: 1, update });

        } else {
            return res.json({ status: 2, error: 'A atividade já foi fechada, não pode ser editada' });
        }
    },

    //Mostra uma atividade pelo ID
    async show(req, res) {
        const ActivityId = req.params.id;

        if (!ActivityId) {
            return res.json({ status: 2, error: 'O ID da atividade é necessário' });
        }

        const response = await Atv.findOne({
            where: {
                id: ActivityId,
                idUsuario: req.user.id
            }
        });

        if (!response) {
            return res.json({ status: 2, error: 'Atividade não encontrada: Provavelmente não pertence a esse usuário ou não existe.' });
        }

        return res.json({ status: 1, response });
    },

};
