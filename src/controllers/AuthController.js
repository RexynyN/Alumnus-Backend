const jwt = require('jsonwebtoken');
const User = require('../models/Usuario');
const crypto = require('crypto');


module.exports = {   
    //Para criar chaves hash
    //require('crypto').randomBytes(64).toString('hex')
    async login(req, res) {
        const { email, senha } = req.body;

        const hashSenha = crypto.createHash('sha256').update(senha).digest('hex');

        const user = await User.findOne({ where: { email, senha: hashSenha } });

        if (!user) {
            return res.json({ status: 2, error: 'Email ou senha estão incorretos'});
        }

        let userData = {
            email,
            senha,
            nickname: user.nickname,
            id: user.id,
            tipoUsuario: user.tipoUsuario
        }

        const acessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET)

        const response = await User.update({ loginToken: refreshToken }, { where: { id: user.id } });

        if (!response) {
            return res.json({ status: 2, error: 'Houve um erro ao fazer login' });
        }

        return res.json({ status: 1, tipoUsuario: user.tipoUsuario, accessToken: acessToken, refreshToken: refreshToken });
    },

    async directLogin(id, email, senha, nickname, tipoUsuario) {

        let userData = {
            email: email,
            senha: senha,
            nickname: nickname,
            id: id,
            tipoUsuario: tipoUsuario
        }

        const acessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET)

        const response = await User.update({ loginToken: refreshToken }, { where: { id: id } });

        if (!response) {
            return { status: 2, error: 'Houve um erro ao fazer login' };
        }

        return { status: 1, tipoUsuario: tipoUsuario, accessToken: acessToken, refreshToken: refreshToken };
    },

    async logout(req, res) {
        const refreshToken = req.body.refreshToken;

        const response = await User.update({ loginToken: "" }, { where: { loginToken: refreshToken } });

        if (!response) {
            return res.json({ status: 2, error: 'Não foi possível sair da conta' });
        }

        res.json({ status: 1, message: 'O logout foi bem sucedido' });
    },
 
    async token(req, res) {
        const refreshToken = req.body.token;

        if (!refreshToken) return res.json({ status: 2, error: 'Nenhum token foi enviado' });

        const user = await User.findOne({ where: { loginToken: refreshToken } });

        if (!user) return res.json({ status: 2, error: 'O token não é valido' });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.json({ status: 2, error: 'O token não é valido' });
            
            let userData = {
                email: user.email,
                senha: user.senha,
                nickname: user.nickname,
                id: user.id,
                tipoUsuario: user.tipoUsuario
            }

            const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);

            res.json({ status: 1, tipoUsuario: user.tipoUsuario, accessToken: accessToken })
        })
    },

    validate(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.json({ status: 3, error: 'Nenhum token foi enviado' });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.json({ status: 3, error: 'O token enviado é inválido ou expirou' });
            req.user = user;
            next();
        });
    },



    // authenticateToken (req, res, next){
    //     next();
    // }

};

