/* Banco de Dados */
create database pds;
use pds;


create table Usuario (
IdUsuario int primary key auto_increment not null,
Email varchar(255) not null,
Senha varchar(32) not null,
Nickname varchar(32) not null,
DescricaoPerfil varchar(800) not null,
Pontuacao int not null,
Avatar int not null,
TipoUsuario int not null,
LoginToken varchar(255),
TokenSpan datetime 
);

create table Atividade (
IdAtividade int primary key auto_increment not null, 
IdUsuario int not null,
TempoCumpridoAtividade time not null,
AgrupadorAtividade varchar(50) not null,
TituloAtividade varchar(100) not null,
DescricaoAtividade varchar(800) not null,
NumeroDeMetas int not null,
Anotacao varchar(800) not null,
PontosAtividade int not null,
TempoPrevistoAtividade time not null,
DataAtividade datetime not null,
SituacaoAtividade tinyint not null,
foreign key (IdUsuario) references Usuario(IdUsuario)
);

create table Meta (
IdMeta int primary key auto_increment not null,
IdAtividade int not null,
DescricaoMeta varchar(800) not null,
PontosMeta int not null,
SituacaoMeta tinyint not null,
foreign key (IdAtividade) references Atividade(IdAtividade)
);

create table Publicacao (
IdPublicacao int primary key auto_increment not null,
IdUsuario int not null,
IdDenunciaPublicacao int not null, 
DataPublicacao datetime not null,
TituloPublicacao varchar(50) not null,
ConteudoPublicacao varchar(90) not null,
ApreciacoesPublicacao int not null,
foreign key (IdUsuario) references Usuario(IdUsuario)
);

create table DenunciaPublicacao (
IdDenunciaPublicacao int primary key auto_increment not null,
IdPublicacao int not null,
foreign key (IdPublicacao) references Publicacao(IdPublicacao)
);

create table DenunciaUsuario (
IdDenunciaUsuario int primary key auto_increment not null,
IdUsuario int not null,
foreign key (IdUsuario) references Usuario(IdUsuario)
);

create table Denuncia (
IdDenuncia int primary key auto_increment not null,
IdUsuario int not null,
IdPublicacao int not null,
DataDenuncia int not null,
Motivo tinyint not null,
Explicacao varchar(800) not null,
foreign key (IdUsuario) references Usuario(IdUsuario),
foreign key (IdPublicacao) references Publicacao(IdPublicacao)
);

create table TagPublicacao (
IdTagPublicacao int primary key auto_increment not null,
IdUsuario int not null,
IdPublicacao varchar(800) not null,
PontosMeta int not null,
SituacaoMeta tinyint not null,
foreign key (IdUsuario) references Usuario(IdUsuario)
);

create table CalendarioMensal (
IdCalendarioMensal int primary key auto_increment not null,
IdAtividade int not null,
IdUsuario int not null,
DataAtividade datetime not null,
foreign key (IdUsuario) references Usuario(IdUsuario),
foreign key (IdAtividade) references Atividade(IdAtividade)
);

create table CronogramaSemanal(
IdCronogramaSemanal int primary key auto_increment not null,
IdUsuario int not null,
IdAtividade int not null,
DataAtividade datetime not null,
foreign key (IdUsuario) references Usuario(IdUsuario),
foreign key (IdAtividade) references Atividade(IdAtividade)
);

create table  RankingSemanal(
IdRankingSemanal int primary key auto_increment not null,
IdUsuario int not null,
PontuacaoUsuario int not null,
Semana int not null,
constraint foreign key (IdUsuario) references Usuario(IdUsuario)
);

ALTER TABLE `Publicacao` ADD CONSTRAINT `fkDenunciaPublicacao` FOREIGN KEY ( `IdDenunciaPublicacao` ) REFERENCES `DenunciaPublicacao` ( `IdDenunciaPublicacao` ) ;

/* Queries */

/* Usuário */
SELECT * FROM Usuario;

INSERT INTO Usuario SET Email = "breno.s.nogueira@hotmail.com",  
Senha = "admin", 
Nickname = "RexynyN", 
DescricaoPerfil = "", 
Pontuacao = 0, 
Avatar = 1, 
TipoUsuario = "1", 
DataCriacao = "2020-04-23 14:05";

/* Atividade */
SELECT * FROM Atividade;

INSERT INTO Atividade SET 
IdUsuario = 1,
TempoCumpridoAtividade = '00:00',
AgrupadorAtividade = 'Matemática',
TituloAtividade = 'Lista de Matemática',
DescricaoAtividade = '', 
NumeroDeMetas = 0,
Anotacao = ' ',
PontosAtividade = 0,
TempoPrevistoAtividade = "01:05",
DataAtividade = "2020-09-29 15:45",
SituacaoAtividade = 1;

SELECT * FROM Atividade WHERE IdUsuario = 1 LIMIT 20 OFFSET 0;
