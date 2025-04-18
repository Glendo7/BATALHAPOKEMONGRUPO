const chefe = {
  nome: "charizard",
  dados: null
};

const fila = [];
const ranking = [];

const filaLista = document.getElementById("fila-lista");
const rankingLista = document.getElementById("ranking-lista");
const chefeImg = document.getElementById("chefe-img");
const chefeInfo = document.getElementById("chefe-info");
const resultadoDiv = document.getElementById("resultado-batalha");


async function iniciar() {
  await carregarChefe();
  for (let i = 0; i < 5; i++) {
    await adicionarDesafiante();
  }
  atualizarFila();
}

async function carregarChefe() {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${chefe.nome}`);
    const dados = await res.json();
    chefe.dados = dados;
    chefeImg.src = dados.sprites.front_default;
    chefeInfo.innerText = `${dados.name.toUpperCase()} - Tipo: ${dados.types[0].type.name}`;
  } catch (err) {
    chefeInfo.innerText = "Erro ao carregar chefe.";
    console.error("Erro ao carregar chefe:", err);
  }
}

async function adicionarDesafiante() {
  try {
    const idAleatorio = Math.floor(Math.random() * 150) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
    const dados = await res.json();
    fila.push(dados);
  } catch (err) {
    console.error("Erro ao adicionar desafiante:", err);
  }
}

function atualizarFila() {
  filaLista.innerHTML = "";
  fila.forEach(pokemon => {
    const li = document.createElement("li");
    li.textContent = `${pokemon.name.toUpperCase()} - Tipo: ${pokemon.types[0].type.name}`;
    filaLista.appendChild(li);
  });
}

document.getElementById("batalhar-btn").addEventListener("click", () => {
  if (fila.length === 0) {
    alert("A fila está vazia!");
    return;
  }

  const desafiante = fila.shift();
  atualizarFila();

  const resultado = simularBatalha(desafiante, chefe.dados);
  resultadoDiv.innerHTML = `
    <p><strong>${desafiante.name.toUpperCase()}</strong> vs <strong>${chefe.dados.name.toUpperCase()}</strong></p>
    <p><strong>${resultado.vencedor.toUpperCase()} venceu!</strong></p>
    <img src="${desafiante.sprites.front_default}" alt="${desafiante.name}">
  `;

  if (resultado.vencedor === desafiante.name) {
    ranking.push(desafiante.name);
    atualizarRanking();
  }
});

function simularBatalha(desafiante, chefe) {
  const poderDesafiante = desafiante.base_experience;
  const poderChefe = chefe.base_experience;

  const chanceDesafiante = poderDesafiante / (poderDesafiante + poderChefe);
  const aleatorio = Math.random();

  return {
    vencedor: aleatorio < chanceDesafiante ? desafiante.name : chefe.name
  };
}

function atualizarRanking() {
  rankingLista.innerHTML = "";
  ranking.forEach((nome, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}º - ${nome.toUpperCase()}`;
    rankingLista.appendChild(li);
  });
}

iniciar();
