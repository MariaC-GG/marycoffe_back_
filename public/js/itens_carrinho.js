const adicionar_carrinho = document.querySelectorAll(".adicionar-ao-carrinho")

adicionar_carrinho.forEach((botao) => {
    botao.addEventListener("click", () => {
      const id = botao.getAttribute("id")
      const nome = botao.getAttribute("data-nome")
      const qtde = Number(botao.getAttribute("data-qtde"))
      const preco = Number(botao.getAttribute("data-preco"))
      const item = {nome, qtde, preco, id};

      // Recupere o carrinho atual do Local Storage
      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

      // Adicione o item ao carrinho
      carrinho.push(item)
      console.log(carrinho)

      // Atualize o carrinho no Local Storage
      localStorage.setItem("carrinho", JSON.stringify(carrinho))

      // Atualize o ícone do carrinho na página principal
      const carrinho_icone = document.getElementById("carrinho-icon")
      carrinho_icone.src = "../img/carrinho_cheio.png"
    })
})
