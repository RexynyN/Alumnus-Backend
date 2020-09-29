// const Dev = require('../models/Dev');

module.exports = {

  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
        $and: [
            { _id: { $ne: user } },
            { _id: { $nin: loggedDev.likes } },
            { _id: { $nin: loggedDev.dislikes } },
        ],
    })

    return res.json(users);
},

async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
        return res.json(userExists);
    }

    const response = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
        name,
        user: username,
        bio,
        avatar
    })

    return res.json(dev);
}
};





if (email && senha && confirmaSenha) {
    if (senha.length < 8 || senha.length > 32) {
        return res.json({ Mensagem: 'A senha não atende os padrões para criar um usuário.' });
    }

    if(senha != confirmaSenha){
        return res.json({ Mensagem: 'As senhas digitadas não coincidem'});
    }

    let sql = "SELECT IdUsuario, Email FROM usuario WHERE Email = ?";
    db.query(sql, email, (err, result) => {
        if (err) return res.json({ Mensagem: 'Houve um problema para criar o usuário.' });

        if (result.length > 0) {
            return res.json({ Mensagem: 'Já existe um usuário com esse email' });
        }
        
        else {
            let post = { Email: email, Senha: senha, Nickname: nickname};
            sql = 'INSERT INTO usuario SET ?';
            db.query(sql, post, (err, result) => {
                if (err) return res.json({ Mensagem: 'Houve um problema para criar o usuário.' });


                if (result.insertId != 0) {
                    return res.json({ Mensagem: 'Usuário criado' });
                } else {
                    return res.json({ Mensagem: 'Houve um problema para criar o usuário.' });
                }
            });
        }
    });
} else {
    return res.json({ Mensagem: 'Coloque um usuário e senha' })
}
