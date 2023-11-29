const DataTypes = require('sequelize')
const db = require('../db/conn')

const Usuario = db.define('usuario',{
    nome_usuario: {
        type: DataTypes.STRING(50), // nome do usuário
        allowNull: false  // não permite que o campo seja nulo
    },
    email: {
        type: DataTypes.STRING(50),  // nome.sobrenome@gmail.com,
        allowNull: false,  // não permite que o campo seja nulo
        unique: true  // certifica que os emails sejam únicos
    },    
    senha: {
        type: DataTypes.STRING(100),  // sem regras, definida pelo usuário
        allowNull: false  // não permite que o campo seja nulo
    },
    telefone: {
        type: DataTypes.STRING(20),  // (47) 98877-6655
        unique: true  // certifica que os emails sejam únicos

    },
    tipo:{
        type: DataTypes.STRING(15) // cliente e administrador
    }
    // fazer model de endereco com o id do usuario (cliente)
},{
    createdAt: false,
    updatedAt: false
})

// Usuario.sync({force:true})

module.exports = Usuario