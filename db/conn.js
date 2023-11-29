const Sequelize = require('sequelize')
const sequelize = new Sequelize('marycoffe', 'root', 'senai', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.sync().then(()=>{
    console.log('Tudo certo ao conectar ao banco de dados')
}).catch((error)=>{
    console.error('Não foi possível conectar ao banco de dados. Confira o erro: ' + error)
})

module.exports = sequelize

