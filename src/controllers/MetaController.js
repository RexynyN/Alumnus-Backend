const Meta = require('../models/Meta');
const Atv = require('../models/Atividade');
const User = require('../models/Usuario');


module.exports = {
    async create(req, res) {
        const { idAtividade, descricao } = req.body;

        if (!idAtividade) {
            return res.status(400).json({ status: 2, error: "Falta o id da atividade" });
        }

        if (!descricao) {
            return res.status(400).json({ status: 2, error: "Falta a descrição da Meta" });
        }

        const atividade = await Atv.findOne({ where: { id: idAtividade, idUsuario: req.user.id } });

        if (!atividade) {
            return res.status(400).json({ status: 2, error: "A atividade não foi encontrada, provavelmente não é deste usuário ou não existe" });
        }

        if (atividade.statusAtividade !== 1) {
            return res.status(400).json({ status: 2, error: "A atividade já foi fechada" });
        }

        const metas = await Meta.findAll({ where: { idAtividade: idAtividade } });

        if (!metas) {
            return res.status(400).json({ status: 2, error: "Houve um erro ao retornar metas para avaliação" });
        }

        if (metas.length >= 3) {
            return res.status(400).json({ status: 2, error: "Máximo de metas para essa atividade atingido" });
        }

        if (descricao.length > 255) {
            return res.status(400).json({ status: 2, error: "A descricao do usuário deve ter no máximo 255 caracteres" });
        }

        let data = {
            idAtividade: idAtividade,
            descricaoMeta: descricao,
            pontosMeta: 0,
            situacaoMeta: 0
        };

        const meta = await Meta.create(data);

        if (!meta) {
            return res.status(400).json({ status: 2, error: "Houve um erro ao criar a meta" });
        }

        return res.json({ status: 1, meta });
    },


    async list(req, res) {
        const idAtividade = req.params.id;

        if (!idAtividade) {
            return res.status(400).json({ status: 2, error: "Falta o parâmetro 'id da atividade'" });
        }

        const atividade = await Atv.findOne({ where: { id: idAtividade, idUsuario: req.user.id } });

        if (!atividade) {
            return res.status(400).json({ status: 2, error: "A atividade não foi encontrada, provavelmente não é deste usuário ou não existe" });
        }

        const metas = await Meta.findAll({ where: { idAtividade: idAtividade } });

        if (!metas) {
            return res.status(400).json({ status: 2, error: "Houve um erro ao retornar as metas" });
        }

        return res.json({ status: 1, metas });
    },

    // Codigos: 
    // 0: Meta aberta
    // 1: Meta não alcançada
    // 2: Meta alcançada
    async closeMeta(req, res) {
        const idAtividade = req.body.idAtividade;
        const ids = req.body.ids;
        const situacoes = req.body.situacoes;

        if (!idAtividade) {
            return res.status(400).json({ status: 2, error: "Falta o id da atividade" });
        }

        if (!ids) {
            return res.status(400).json({ status: 2, error: "Faltam os ids das metas" });
        }

        if (!situacoes) {
            return res.status(400).json({ status: 2, error: "Faltam as situcoes das metas" });
        }

        const atividade = await Atv.findOne({ where: { id: idAtividade, idUsuario: req.user.id } });

        if (!atividade) {
            return res.status(400).json({ status: 2, error: "A atividade não foi encontrada, provavelmente não é deste usuário ou não existe" });
        }

        let somaPontos = 0;
        for (let i = 0; i < ids.length; i++) {
            let id = Number(ids[i]);
            let situacao = Number(situacoes[i]);

            console.log(id + " - " + situacao);

            if (id && situacao) {
                let find = await Meta.findOne({ where: { id: id, idAtividade: idAtividade } });

                if (!find) {
                    return res.status(400).json({ status: 2, error: "Não foi possível achar a meta de ID " + id + " para a atividade de ID " + idAtividade });
                }

                if (find.situacaoMeta == 0) {
                    if (situacao != 1 && situacao != 2) {
                        situacao = 1;
                    }

                    let pontos = 0;
                    if (situacao == 2) {
                        pontos = 3;
                    }else if (situacao == 1){
                        pontos = 0
                    }

                    let data = {
                        pontosMeta: pontos,
                        situacaoMeta: situacao
                    };

                    let close = await Meta.update(data, { where: { id: id, idAtividade: idAtividade } });

                    if (!close) {
                        return res.status(400).json({ status: 2, error: "Não foi possivel fechar a meta de ID" + id });
                    }

                    somaPontos += pontos;
                }
            }
        }

        if (somaPontos > 0) {
            const change = await atividade.update({
                pontos: (atividade.pontos + somaPontos),
            });

            if (!change) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao atribuir os pontos à atividade' });
            }


            const user = await User.findOne({ where: { id: req.user.id, } });

            if (!user) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao buscar o usuário para atribuir os pontos' });
            }

            const points = await user.update({
                pontuacao: (user.pontuacao + somaPontos)
            },
                {
                    where: {
                        id: req.user.id,
                    }
                }
            );

            if (!points) {
                return res.status(400).json({ status: 2, error: 'Houve um erro ao atribuir os pontos.' });
            }
        }

        return res.json({ status: 1, pontos: somaPontos });
    },


}

