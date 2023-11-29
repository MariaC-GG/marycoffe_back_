const DataTypes = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('produto', {
    nome_produto:{
        type: DataTypes.STRING(50)
    },
    preco_unidade:{
        type: DataTypes.FLOAT
    },
    qtd_estoque:{
        type: DataTypes.INTEGER
    }
},{
    createdAt: false,
    updatedAt: false
})

// Produto.sync({force:true})

module.exports = Produto