async function buscarUsuario() {
    const username = document.getElementById("insert-text").value; // Captura o texto digitado
    const userData = document.getElementById("user-data"); // Elemento onde os dados serão exibidos

    try {

        const response = await fetch(`https://api.github.com/users/${username}`);
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events`);
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);


        if (!response.ok || !eventsResponse.ok || !reposResponse.ok) {
            throw new Error("Usuário ou eventos não encontrados");
        }


        const data = await response.json();
        const dataEvents = await eventsResponse.json();
        const repos = await reposResponse.json();

        let reposList = repos 
    .slice(0, 10)
    .map(repo => `<li>
        <div class="info">
            <a href="${repo.html_url}" target="_blank" class="link">${repo.name}
                <br>
                <span class="forks-count">🍴${repo.forks_count}</span> |
                <span class="stargazers-count">⭐${repo.stargazers_count}</span> |
                <span class="watchers-count">👀${repo.watchers_count}</span>
                <span class="language">👨‍💻${repo.language}</span>
            </a>
        </div>
          </li>`)
    .join("");

        let eventsList = "";

dataEvents.slice(0, 10).forEach(event => {
    if (event.type === "PushEvent") {
        eventsList += `
            <li>
                <span class="repo-name" >${event.repo.name} - </span>
                ${event.payload.commits
                    .map(commit => `<span style="color: grey;">${commit.message}</span>`)
                    .join(", ")}
            </li>
        `;
    } else if (event.type === "CreateEvent") {
        eventsList += `
            <li>
                <span class="repo-name">${event.repo.name}</span> 
                <span style="color: grey">  -  Sem mensagem de commit</span>
            </li>
        `;
    } else {
        eventsList += `
            <li>
                ${event.type} - <span>Informações adicionais não disponíveis.</span>
            </li>
        `;
    }
});



        if (!eventsList) {
            eventsList = "<li>Nenhum evento encontrado</li>";
        }

        userData.innerHTML = `
    <img src="${data.avatar_url}" alt="Imagem do usuário" width="150">
    <h2>${data.name || "Nome não disponível"}</h2>
    <p style="color:grey">${data.login}</p>
    <p>${data.bio || "Sem bio disponível"}</p>
    <p>${data.followers} Seguidores | ${data.following} Seguindo</p>
    <h3>Repositórios:</h3>
    <ol>${reposList}</ol>
    <h3>Eventos:</h3>
    <ul>${eventsList}</ul>

    
`;


    } catch (error) {

        console.error("Ops, aparentemente algo deu errado!");
        userData.innerHTML = `<p style="color:red;">${error.message}</p>`;

    }
}


document.getElementById("search-button").addEventListener("click", buscarUsuario);
