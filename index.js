const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario.js')
const Produto = require('./models/Produto.js')

const PORT = 3000
const hostname = 'localhost'

let administrador = false
let log = false
let msg = ''
let id_usuario = ''
let usuario = ''
let tipoUsuario = ''
let tipoAdm = false

// configuração do express
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

// configuração do express-handlebars
app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs.engine())
// ------------------------------------------------------------------
// ------------------adm
app.get('/administrador', (req,res)=>{
    res.render('administrador', {log})
})
// =========ATUALIZAR =======================
app.post('/atualizar_produto', async (req,res)=>{
    const nome_produto = req.body.nome_produto
    const novo_nome = req.body.novo_nome
    const qtde_estoque = Number(req.body.qtd_estoque)
    const preco_unidade = Number(req.body.preco_unidade)
    let msg = 'Dados cadastrados!'

    const dado_nome = await Produto.findOne({raw:true, where: {nome:nome}})

    if(dado_nome != null){
        const dados = {
            nome_produto: novo_nome,
            qtde_estoque: qtde_estoque,
            preco_unidade: preco_unidade
        }
        if((typeof nome ==='string')&&(typeof qtde_produto ==='number')&&(typeof preco_unidade ==='number')){
            await Produto.update(dados, {where: {nome:nome}})
            res.render('atualizar_produto')
        }else{
            res.render('atualizar_produto', {msg})
        }
    }else{
        res.render('atualizar_produto', {msg})
    }
    // res.redirect('/atualizar')
})

app.get('/atualizar_produto', (req,res)=>{
    res.render('atualizar_produto')
})





// ===========EXCLUIR PRODUTO =====================
app.post('/excluir_produto', async(req,res)=>{
    const nome_produto = req.body.nome_produto

    const pesq = await Produto.findOne({raw:true, where:{nome_produto:nome_produto}})
    let msg ='os dados foram excluidos'
    if(pesq === null){
        res.render('excluir_produto', {log})
    }else{
        Produto.destroy({where:{nome_produto:nome_produto}})
    }
})

app.get('/excluir_produto', (req,res)=>{
    res.render('excluir_produto', {log})
})

// =============LISTAR PRODUTO ============
app.get('/listar_produto', async(req,res)=>{
    const dados = await Produto.findAll({raw:true})
    res.render('listar_produto', {log, valores:dados})
})
// ----------LISTAR CLIENTE
app.get('/listar_cliente', async(req,res)=>{
    const dados = await Usuario.findAll({raw:true})
    res.render('listar_cliente', {log, valores:dados})
})

// ========CADASTRO======================
app.post('/cadastrar', async (req, res)=>{
    const nome_usuario = req.body.nome_usuario
    const telefone = req.body.telefone
    const email = req.body.email
    const senha = req.body.senha
    
    bcrypt.hash(senha, 10, async (err, hash)=>{
        if(err){
            console.error('Erro ao criar o hash da senha: ' + err)
            msg = 'Erro ao cadastrar sua senha. Tente novamente.'
            res.render('cadastrar', {log, msg, id_usuario, usuario, tipoUsuario, administrador})
            return
        }
        try{
            await Usuario.create({nome_usuario:nome_usuario, telefone:telefone, email:email, senha:hash, tipo:'cliente'})            
            const pesq = await Usuario.findOne({raw:true, where:{nome_usuario:nome_usuario, senha:hash}})
            
            log = true
            usuario = pesq.nome_usuario
            msg = 'Usuário cadastrado'
            res.render('produto', {log, msg, id_usuario, usuario, administrador})
        }catch(error){
            console.error('Erro ao criar novo cadastro '+ error)
            msg = 'Erro ao criar novo cadastro. Tente novamente.'
            res.render('cadastrar', {log, msg, id_usuario, usuario, administrador})
        }
    })
})

app.get('/cadastrar', (req, res)=>{
    res.render('cadastrar', {log, id_usuario, usuario, administrador})
})
// usuário-----

// produto-------
app.post('/cadastrar_produto', async (req, res)=>{
    const nome_produto = req.body.nome_produto
    const preco_unidade = req.body.preco_unidade
    const qtd_estoque = req.body.qtd_estoque
        await Produto.create({nome_produto:nome_produto, preco_unidade:preco_unidade, qtd_estoque:qtd_estoque})
        msg = 'Dados Cadastrados'
        res.render('cadastrar_produto', {log, usuario, tipoUsuario, msg})
    })
    
    app.get('/cadastrar_produto', (req,res)=>{
        res.render('cadastrar_produto', {log, usuario, tipoUsuario})
    })

// ========ENTRAR======================
app.post('/entrar', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const pesq = await Usuario.findOne({raw:true, where:{email:email}})
    
    if(pesq == null){
        msg = 'Usuário não cadastrado'
        res.render('entrar', {log, msg})
    }else{
        // comparando a senha com o uso de hash
        bcrypt.compare(senha, pesq.senha, (err,resultado)=>{
            if(err){
                console.error('Erro ao comparar a senha',err)
                res.render('entrar', {log})
            }else if(resultado){
                if(pesq.tipo === 'administrador'){
                    log = true
                    id_usuario = Number(pesq.id)
                    usuario = pesq.nome_usuario
                    tipoUsuario = pesq.tipo
                    administrador = true
                    tipoAdm = true
                    res.render('produto', {log, id_usuario, usuario, administrador, tipoAdm})        
                }else if(pesq.tipo === 'cliente'){
                    log = true
                    id_usuario = Number(pesq.id)
                    usuario = pesq.nome_usuario
                    tipoUsuario = pesq.tipo
                    res.render('produto', {log, id_usuario, usuario, administrador})
                }else{
                    id_usuario = Number(pesq.id)
                    usuario = pesq.nome_usuario
                    console.log(pesq.nome_usuario)
                    res.render('home', {log, id_usuario, usuario, administrador})
                }
            }else{
                console.log('senha incorreta')
                msg = 'Senha incorreta'
                res.render('entrar', {log, msg})
            }
        })
    }
})
app.get('/entrar', (req, res)=>{
    res.render('entrar', {log, id_usuario, usuario, administrador})
})


// ========CARRINHO======================
app.get('/carrinho', (req, res)=>{
    res.render('carrinho') 
    // colocar log depois
})

// ========HOME======================
app.get('/home', (req, res)=>{
    res.render('home') 
    // colocar log depois
})

// ========PRODUTO======================
app.get('/produto', (req, res)=>{
    res.render('produto') 
    // colocar log depois
})



app.get('/', (req, res)=>{
    res.render('home') 
    // colocar log depois
})

// sincronizar
conn.sync().then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando em ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Algo deu errado' + error)
})
