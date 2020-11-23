const Den = require('../models/Denuncia');
const User = require('../models/Usuario');
const Pub = require('../models/Publicacao');
const { Op } = require('sequelize');



module.exports = {
    async denunciaUsuario (req, res) {
        const { idUsuario, motivo, explicacao } = req.body 

        if (!idUsuario) {
            return res.json({ status: 2, error: "Falta o id de usuário" });
        }

        if (!motivo) {
            return res.json({ status: 2, error: "Falta o motivo da denuncia" });
        }

        if (!explicacao) {
            return res.json({ status: 2, error: "Falta a descricao da denuncia" });
        }

        if (explicacao.length > 255) {
            return res.json({ status: 2, error: "A descrição deve ter no máximo 255 caracteres" });
        }

        const user = await User.findOne({ where: { id: idUsuario }});

        if(!user){
            return res.json({ status: 2, error: "Nenhum usuário com esse id foi encontrado" });
        }

        let data = {
            idUsuario: idUsuario,
            idPublicacao: null,
            motivo: motivo,
            explicacao: explicacao
        }

        const den = await Den.create(data);

        if(!den){
            return res.json({ status: 2, error: "Houve um erro ao arquivar a denúncia" });
        }

        return res.json({ status: 1, den})
    },

    async denunciaPub (req, res) {
        const { idPublicacao, motivo, explicacao } = req.body 

        if (!idPublicacao) {
            return res.json({ status: 2, error: "Falta o id de usuário" });
        }

        if (!motivo) {
            return res.json({ status: 2, error: "Falta o motivo da denuncia" });
        }

        if (!explicacao) {
            return res.json({ status: 2, error: "Falta a explicacao da denuncia" });
        }

        if (explicacao.length > 255) {
            return res.json({ status: 2, error: "A descrição deve ter no máximo 255 caracteres" });
        }

        const pub = await Pub.findOne({where: { id: idPublicacao }});

        if(!pub){
            return res.json({ status: 2, error: "Nenhuma publicacão com esse id foi encontrado" });
        }

        let data = {
            idUsuario: pub.idUsuario,
            idPublicacao: idPublicacao,
            motivo: motivo,
            explicacao: explicacao
        }

        const den = await Den.create(data);

        if(!den){
            return res.json({ status: 2, error: "Houve um erro ao arquivar a denúncia" });
        }

        return res.json({ status: 1, den})
    },

    async getUsuarios (req, res) {
        if(req.user.tipoUsuario !== 2){
            return res.json({ status: 2, error: 'Você não tem autorização para esta ação' });
        }

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

        const denuncias = await Den.findAll({
            where:
            {
                idPublicacao: null
            },
            offset: offSet,
            limit: limite,
            order: [['createdAt', 'ASC']]
        });

        if (!denuncias) {
            return res.json({ status: 2, error: 'Não foi possível achar atividades desse usuário' });
        }

        return res.json({ status: 1, denuncias });
    },

    async getPubs (req, res) {
        if(req.user.tipoUsuario !== 2){
            return res.json({ status: 2, error: 'Você não tem autorização para esta ação' });
        }

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

        const pubs = await Den.findAll({
            where:
            {
                idPublicacao: {  [Op.not]: null }
            },
            offset: offSet,
            limit: limite,
            order: [['createdAt', 'ASC']]
        });

        if (!pubs) {
            return res.json({ status: 2, error: 'Não foi possível achar atividades desse usuário' });
        }

        return res.json({ status: 1, pubs });
    },

    // Codigos: 
    // 1: Denuncia Negada (Mantem)
    // 2: Denuncia Aceita (Deleta)
    async julgaUsuario (req, res) {
        if(req.user.tipoUsuario !== 2){
            return res.json({ status: 2, error: 'Você não tem autorização para esta ação' });
        }

        const { idDenuncia, julgamento } = req.body;

        if (!idDenuncia) {
            return res.json({ status: 2, error: 'Falta o id da denúncia' });
        }

        if (!julgamento) {
            return res.json({ status: 2, error: 'Falta o julgamento da denúncia' });
        }

        if(julgamento !== 1 && julgamento !== 2){
            return res.json({ status: 2, error: 'O valor do julgamento não é um valor válido' });
        }

        const den = await Den.findOne({ where: { id: idDenuncia, idPublicacao: {  [Op.is]: null } }});

        if(!den){
            return res.json({ status: 2, error: 'A denuncia de usuário não existe' });  
        }

        if(julgamento === 1){
            const final = await Den.destroy({ where: { idUsuario: den.idUsuario, idPublicacao: {  [Op.is]: null } }});

            if(!final){
                return res.json({ status: 2, error: 'Houve um erro ao fechar a denúncia' }); 
            }

            return res.json({ status: 1 });

        }else if(julgamento === 2){
            const final = await Den.destroy({ where: { idUsuario: den.idUsuario, idPublicacao: {  [Op.is]: null } }});

            if(!final){
                return res.json({ status: 2, error: 'Houve um erro ao fechar a denúncia' }); 
            }

            const user = await User.destroy({ where: { id: den.idUsuario }});

            if(!user){
                return res.json({ status: 2, error: 'Houve um erro ao banir o usuário, provavelmente já foi banido' }); 
            }

            return res.json({ status: 1 });
        }
    },

    // Codigos: 
    // 1: Denuncia Negada (Mantem)
    // 2: Denuncia Aceita (Deleta)
    async julgaPub (req, res) {
        if(req.user.tipoUsuario !== 2){
            return res.json({ status: 2, error: 'Você não tem autorização para esta ação' });
        }

        const { idDenuncia, julgamento } = req.body;

        if (!idDenuncia) {
            return res.json({ status: 2, error: 'Falta o id da denúncia' });
        }

        if (!julgamento) {
            return res.json({ status: 2, error: 'Falta o julgamento da denúncia' });
        }

        if(julgamento !== 1 && julgamento !== 2){
            return res.json({ status: 2, error: 'O valor do julgamento não é um valor válido' });
        }

        const den = await Den.findOne({ where: { id: idDenuncia, idPublicacao: {  [Op.not]: null } }});

        den

        if(!den){
            return res.json({ status: 2, error: 'A denuncia de publicação não existe' });  
        }

        if(julgamento === 1){
            const final = await Den.destroy({ where: { idPublicacao: den.idPublicacao }});

            if(!final){
                return res.json({ status: 2, error: 'Houve um erro ao fechar a denúncia' }); 
            }

            return res.json({ status: 1 });

        }else if(julgamento === 2){
            const final = await Den.destroy({ where: { idPublicacao: den.idPublicacao }});

            if(!final){
                return res.json({ status: 2, error: 'Houve um erro ao fechar a denúncia' }); 
            }

            const pub = await Pub.destroy({ where: { id: den.idPublicacao }});

            if(!pub){
                return res.json({ status: 2, error: 'Houve um erro ao excluir a publicação, provavelmente já foi excluída' }); 
            }

            return res.json({ status: 1 });
        }
    },

}

