const express = require('express');

const UsuarioController = require('./controllers/UsuarioController');
const AtividadeController = require('./controllers/AtividadeController');
const PublicacaoController = require('./controllers/PublicacaoController');
const MetaController = require('./controllers/MetaController');
const DenunciaController = require('./controllers/DenunciaController');
const Auth = require('./controllers/AuthController');

const routes = express.Router();

//Todas as rotas, retornam 1 caso a requisição for bem sucedida, 2 caso dê algum erro.

// //teste
// // routes.post('/user', UsuarioController.create);
// routes.get('/user', UsuarioController.list);
// routes.post('/atv', AtividadeController.create);
// routes.get('/atv/:id', AtividadeController.show);


//Auth
routes.post('/login', Auth.login);
routes.post('/logout', Auth.logout);
routes.post("/token", Auth.token);

//Usuário
routes.post('/user/signup', UsuarioController.signup);
routes.post('/user/signupADM', Auth.validate, UsuarioController.signupADM);
routes.post('/user/edit/', Auth.validate, UsuarioController.edit);
routes.post('/user/delete/', Auth.validate, UsuarioController.delete);
routes.post('/user/editPassword/', Auth.validate, UsuarioController.editPassword);
routes.get('/user/show/', Auth.validate, UsuarioController.show);
routes.get('/user/list/', Auth.validate, UsuarioController.list);
routes.get('/user/ranking/', UsuarioController.ranking);


//Atividade
routes.post('/activity/create', Auth.validate, AtividadeController.create);
routes.post('/activity/close/', Auth.validate, AtividadeController.closeActivity);
routes.post('/activity/cancel/', Auth.validate, AtividadeController.cancelActivity);
routes.post('/activity/edit/', Auth.validate, AtividadeController.edit);
routes.post('/activity/delete/:id', Auth.validate, AtividadeController.delete);
routes.get('/activity/show/:id', Auth.validate, AtividadeController.show);
routes.get('/activity/list/', Auth.validate, AtividadeController.index);
routes.get('/activity/agenda/', Auth.validate, AtividadeController.agenda);

//Meta
routes.post('/meta/create', Auth.validate, MetaController.create);
routes.post('/meta/close/', Auth.validate, MetaController.closeMeta);
routes.get('/meta/list/:id', Auth.validate, MetaController.list);

//Denuncia
routes.post('/denuncia/create/usuario', Auth.validate, DenunciaController.denunciaUsuario);
routes.post('/denuncia/create/post', Auth.validate, DenunciaController.denunciaPub);
routes.post('/denuncia/judge/usuario', Auth.validate, DenunciaController.julgaUsuario);
routes.post('/denuncia/judge/post', Auth.validate, DenunciaController.julgaPub);
routes.get('/denuncia/get/usuario', Auth.validate, DenunciaController.getUsuarios);
routes.get('/denuncia/get/post', Auth.validate, DenunciaController.getPubs);

//Publicação
routes.post('/post/create', Auth.validate, PublicacaoController.create);
routes.post('/post/edit/', Auth.validate, PublicacaoController.edit);
routes.post('/post/delete/:id', Auth.validate, PublicacaoController.delete);
routes.get('/post/show/:id', Auth.validate, PublicacaoController.show);
routes.get('/post/feed/', Auth.validate, PublicacaoController.feed);
routes.get('/post/like/:id', Auth.validate, PublicacaoController.like);
routes.get('/post/unlike/:id', Auth.validate, PublicacaoController.unlike);




//routes.get('/database', AtividadeController.createDatabase);
// routes.post('/user/create', UsuarioController.create);
// routes.get('/user/index', UsuarioController.index);

module.exports = routes;
