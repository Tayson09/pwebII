const dadosPerfil = {
    nome: 'Tayson Silva',
    foto: './eu.jpg',
    descricao: 'Desenvolvedor Full Stack e estudante de Sistemas de Informação.',
    habilidades: [
        'Java',
        'JavaScript',
        'Python',
        'PHP',
        'HTML',
        'CSS',
        'C'
    ]
};

function criarCard(dados) {

    const card = document.createElement('article');
    card.className = 'Card';

    const profile = document.createElement('div');
    profile.className = 'Profile';

    const foto = document.createElement('img');
    foto.src = dados.foto;
    foto.alt = `Foto de ${dados.nome}`;

    const nome = document.createElement('h2');
    nome.textContent = dados.nome;

    const descricao = document.createElement('p');
    descricao.textContent = dados.descricao;

    const habilidades = document.createElement('div');
    habilidades.className = 'Habilidades';

    dados.habilidades.forEach(habilidade => {

        const skill = document.createElement('span');

        skill.textContent = habilidade;

        habilidades.appendChild(skill);
    });

    profile.appendChild(foto);
    profile.appendChild(nome);
    profile.appendChild(descricao);
    profile.appendChild(habilidades);

    card.appendChild(profile);

    return card;
}


const container = document.querySelector('#perfil');
const card = criarCard(dadosPerfil);
container.appendChild(card);