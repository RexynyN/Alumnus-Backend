const express = require('express');

const UsuarioController = require('./controllers/UsuarioController');
const AtividadeController = require('./controllers/AtividadeController');


const routes = express.Router();

//Todas as rotas, retornam 1 caso a requisição for bem sucedida, 2 caso dê algum erro.

//Usuário
routes.post('/user/signup', UsuarioController.signup);
routes.post('/user/login', UsuarioController.login);
//routes.patch('/user/edit/:id', UsuarioController.edit);
routes.delete('/user/delete/:id', UsuarioController.delete);
routes.get('/user/show/:id', UsuarioController.show);
routes.get('/user/list/:page', UsuarioController.list);

//Atividade
routes.post('/activity/create', AtividadeController.create);
//routes.post('/activity/close-activity/:id', AtividadeController.closeActivity);
//routes.patch('/activity/edit/:id', AtividadeController.edit);
routes.delete('/activity/delete/:id', AtividadeController.delete);
routes.get('/activity/show/:id', AtividadeController.show);
routes.get('/activity/list/:page', AtividadeController.list);

//routes.get('/database', AtividadeController.createDatabase);



// routes.post('/user/create', UsuarioController.create);
// routes.get('/user/index', UsuarioController.index);



module.exports = routes;
