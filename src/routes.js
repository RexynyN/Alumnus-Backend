const express = require('express');

const UsuarioController = require('./controllers/UsuarioController');
const AtividadeController = require('./controllers/AtividadeController');
const Auth = require('./controllers/AuthController');



const routes = express.Router();

//Todas as rotas, retornam 1 caso a requisição for bem sucedida, 2 caso dê algum erro.

//teste
// routes.post('/user', UsuarioController.create);
routes.get('/user', UsuarioController.list);
routes.post('/atv', AtividadeController.create);
routes.get('/atv/:id', AtividadeController.show);


//Auth
routes.post('/login', Auth.login);
routes.post('/logout', Auth.logout);
routes.post("/token", Auth.token);

//Usuário
routes.post('/user/signup', Auth.validate , UsuarioController.signup);
routes.post('/user/edit/', Auth.validate, UsuarioController.edit);
routes.post('/user/delete/', Auth.validate, UsuarioController.delete);
routes.post('/user/editPassword/', Auth.validate, UsuarioController.editPassword);
routes.get('/user/show/:id', Auth.validate, UsuarioController.show);
routes.get('/user/list/', Auth.validate, UsuarioController.list);

//Atividade
routes.post('/activity/create', Auth.validate, AtividadeController.create);
//routes.post('/activity/close-activity/:id', Auth.validate, AtividadeController.closeActivity);
//routes.post('/activity/edit/:id', Auth.validate, AtividadeController.edit);
routes.post('/activity/delete', Auth.validate, AtividadeController.delete);
routes.get('/activity/show/:id', Auth.validate, AtividadeController.show);
routes.get('/activity/list/', Auth.validate, AtividadeController.index);




//routes.get('/database', AtividadeController.createDatabase);
// routes.post('/user/create', UsuarioController.create);
// routes.get('/user/index', UsuarioController.index);



module.exports = routes;
