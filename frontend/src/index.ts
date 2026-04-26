import { CONFIG } from "./config";
import type{ Tournament } from "./interfaces";

const tableBody = document.getElementById('tableBody') as HTMLTableSectionElement;
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
const nameInput = document.getElementById('name-inpt') as HTMLInputElement;
const statusInput = document.getElementById('status-inpt') as HTMLInputElement;


async function loadTournaments(nameQuery: string | null = null, status: string | null = null) {
    if(!(nameQuery || status)){
        nameInput.style.color = 'red';
        statusInput.style.color = 'red';

        nameInput.style.border = 'solid 2px red';
        statusInput.style.border = 'solid 2px red';
        return;
    }
    
    nameInput.style.color = 'black';
    statusInput.style.color = 'black';

    nameInput.style.border = 'solid 2px black';
    statusInput.style.border = 'solid 2px black';

    try{
        let url = `${CONFIG.API_URL}/tournaments`;
        const params = new URLSearchParams();

        if(nameQuery) params.append("name", nameQuery);
        if(status) params.append("status", status);

        url += `?${params.toString()}`;
        
        const response = await fetch(url);
        
        if(!response.ok) throw new Error("Ошибка при запросе к серверу");
        const data: Tournament[] = await response.json();
        renderTable(data, tableBody);
    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan=5>Произошла ошибка</td></tr>`;

    }
}

function chooseBadge(status: string){
    const statuses: Record<string, string> = {
        'registration': '<span class="badge registration">Регистрация</span>',
        'active': '<span class="badge active">Активный</span>',
        'completed': '<span class="badge completed">Завершён</span>',
        'cancelled': '<span class="badge cancelled">Отменён</span>'
    };
    
    return statuses[status] || `<span class="badge active">${status}</span>`;
}

function renderTable(tournaments: Tournament[], container: HTMLTableSectionElement) {
    container.innerHTML = '';

    if (tournaments.length === 0){
        container.innerHTML = `<tr><td colspan=5>Турниров не найдено!</td></tr>`;
        return;
    }

    console.log(tournaments.length)
    tournaments.forEach(tournament => {
        const tr = document.createElement("tr");

        const dateObj = new Date(tournament.start_date);
        const formattedDate = dateObj.toLocaleDateString("ru-RU");
        
        tr.innerHTML = `
            <td><a href="/tournament.html?id=${tournament.id}"><strong>${tournament.name}</strong></a></td>
            <td>${tournament.sport_type}</td>
            <td>${formattedDate}</td>
            <td>${chooseBadge(tournament.status)}</td>
            <td>${tournament.prize_pool} ₽</td>`
        
        container.appendChild(tr)
    });
}

if(searchBtn){
    searchBtn.addEventListener('click', () => {
        const nameQuery: string | null = nameInput.value;
        const statusQuery: string | null= statusInput.value;
    
        // console.log(nameQuery, statusQuery);
    
        loadTournaments(nameQuery, statusQuery);
    });
}

export { renderTable }