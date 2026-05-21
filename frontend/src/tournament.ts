import { updateHeaderAuth } from "./auth";
import { CONFIG } from "./config";
import type { Tournament } from "./interfaces";
type TournamentWithOrganizer = Tournament & { organizer_company_name?: string };

const queryString: string = window.location.search;

const urlParams = new URLSearchParams(queryString);

const tournamentID = urlParams.get('id');

updateHeaderAuth()

if (!tournamentID) {
    //  ААААААААААААА ОШИБКУ ААААААААААА
    // document.body.innerHTML = "<h1>Ошибка: Турнир не найден!</h1> <a href='/'>На главную</a>";
} else {
    loadTournamentDetails(tournamentID);
    loadTournamentMatches(tournamentID);
}

async function loadTournamentDetails(id:string) {
    try{
        const response = await fetch(`${CONFIG.API_URL}/tournaments/${id}`);

        if(!response.ok) throw new Error("Ошибка при обращении к серверу");
        const data: Tournament = await response.json();

        renderTournamentPage(data);
    } catch(error){
        console.log(error);
        // ААААААААА ОШИБКУ ААААААААААА
    }
}

function renderTournamentPage(tournament: TournamentWithOrganizer){
    // console.log(tournament);
    const titleElement = document.getElementById("tournament-name-tag");
    if (titleElement) {
        titleElement.textContent = tournament.name;
    }

    const infoElement = document.getElementById("tournament-details") as HTMLDivElement;
    if (infoElement){
        infoElement.innerHTML = '';

        const org = document.createElement("div");
        org.classList.add("param-name");
        org.textContent = "Организатор";
        infoElement.appendChild(org);

        const orgValue = document.createElement("div");
        orgValue.classList.add("param-value", "organizer-tag");
        orgValue.innerHTML = `<a href="organizer.html?id=${tournament.organizer_id}">${tournament.organizer_company_name || tournament.organizer_company_name}</a>`;
        infoElement.appendChild(orgValue);


        const sportTypeTag = document.createElement("div");
        sportTypeTag.classList.add("param-name");
        sportTypeTag.textContent = "Вид спорта";
        infoElement.appendChild(sportTypeTag);

        const sportTypeValue = document.createElement("div");
        sportTypeValue.classList.add("param-value");
        sportTypeValue.textContent = tournament.sport_type;
        infoElement.appendChild(sportTypeValue);


        const dateObjStart = new Date(tournament.start_date);
        const formattedDateStart = dateObjStart.toLocaleDateString("ru-RU");

        const end_date_str = (tournament as any).end_date; 
        const dateObjEnd = new Date(end_date_str);
        const formattedDateEnd = end_date_str ? dateObjEnd.toLocaleDateString("ru-RU") : "Уточняется";

        const datesTag = document.createElement("div");
        datesTag.classList.add("param-name");
        datesTag.textContent = "Даты проведения";
        infoElement.appendChild(datesTag);

        const datesValue = document.createElement("div");
        datesValue.classList.add("param-value");
        datesValue.textContent = `с ${formattedDateStart} по ${formattedDateEnd}`;
        infoElement.appendChild(datesValue);


        const prizeTag = document.createElement("div");
        prizeTag.classList.add("param-name");
        prizeTag.textContent = "Призовой фонд";
        infoElement.appendChild(prizeTag);

        const prizeValue = document.createElement("div");
        prizeValue.classList.add("param-value");
        prizeValue.textContent = `${tournament.prize_pool} ₽`;
        infoElement.appendChild(prizeValue);


        const statusTag = document.createElement("div");
        statusTag.classList.add("param-name");
        statusTag.textContent = "Статус";
        infoElement.appendChild(statusTag);

        const statusValue = document.createElement("div");
        statusValue.classList.add("param-value");
        statusValue.innerHTML = chooseBadge(tournament.status);
        infoElement.appendChild(statusValue);
    }
}

function chooseBadge(status: string){
    const statuses: Record<string, string> = {
        'registration': '<span class="badge registration">Регистрация</span>',
        'active': '<span class="badge active">Активный</span>',
        'completed': '<span class="badge completed">Завершён</span>',
        'cancelled': '<span class="badge cancelled">Отменён</span>',

    };
    
    return statuses[status] || `<span class="badge active">${status}</span>`;
}

async function loadTournamentMatches(id: string) {
    try {
        const res = await fetch(`${CONFIG.API_URL}/match/tournament/${id}`);
        if (!res.ok) throw new Error("Не удалось загрузить матчи");
        const data = await res.json();
        
        renderMatchesTable(data);
    } catch(err) {
        console.error(err);
    }
}

function chooseMatchBadge(status: string) {
    const statuses: Record<string, string> = {
        'scheduled': '<span class="badge scheduled">Запланирован</span>',
        'ongoing': '<span class="badge active">Активный</span>',
        'finished': '<span class="badge completed">Завершён</span>',
        'cancelled': '<span class="badge cancelled">Отменён</span>'
    };
    
    return statuses[status] || `<span class="badge scheduled">${status}</span>`;
}


function renderMatchesTable(matches: any[]) {
    const tbody = document.getElementById("matchesTableBody");
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (matches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Матчи пока не запланированы</td></tr>';
        return;
    }

    matches.forEach(m => {
        const row = document.createElement("tr");

        const stageTd = document.createElement("td");
        stageTd.innerHTML = `<b>${m.stage_name || "-"}</b>`;

        const statusTd = document.createElement("td");
        statusTd.innerHTML = chooseMatchBadge(m.status);

        const name1Td = document.createElement('td');
        name1Td.className = "organizer-tag";
        if (m.team1_id) {
            name1Td.innerHTML = `<a href="/team-card.html?id=${m.team1_id}">${m.team1_name}</a>`;
        } else {
            name1Td.textContent = m.team1_name || "TBA";
        }

        const name2Td = document.createElement('td');
        name2Td.className = "organizer-tag";
        if (m.team2_id) {
            name2Td.innerHTML = `<a href="/team-card.html?id=${m.team2_id}">${m.team2_name}</a>`;
        } else {
            name2Td.textContent = m.team2_name || "TBA";
        }

        const score = document.createElement("td");
        score.style.fontWeight = "bold";
        score.textContent = m.team1_score !== null && m.team2_score !== null 
            ? `${m.team1_score} : ${m.team2_score}` 
            : "-:-";

        const winner = document.createElement("td");
        winner.className = "organizer-tag";
        if (m.team1_score !== null && m.team2_score !== null) {
            if (m.team1_score > m.team2_score) {
                winner.innerHTML = `<a href="/team-card.html?id=${m.team1_id}">${m.team1_name}</a>`;
            } else if (m.team2_score > m.team1_score) {
                winner.innerHTML = `<a href="/team-card.html?id=${m.team2_id}">${m.team2_name}</a>`;
            } else {
                winner.textContent = "Ничья";
            }
        } else {
            winner.textContent = "-";
        }

        const dateTd = document.createElement("td");
        dateTd.textContent = m.match_date ? new Date(m.match_date).toLocaleString("ru-RU", {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : "-";

        const locTd = document.createElement("td");
        if (m.location_city && m.location_name) {
            locTd.textContent = `${m.location_name} (${m.location_city})`;
        } else if (m.location_city) {
            locTd.textContent = m.location_city;
        } else if (m.location_name) {
            locTd.textContent = m.location_name;
        } else {
            locTd.textContent = "TBA";
        }

        row.appendChild(stageTd);
        row.appendChild(statusTd);
        row.appendChild(name1Td);
        row.appendChild(name2Td);
        row.appendChild(score);
        row.appendChild(winner);
        row.appendChild(dateTd);
        row.appendChild(locTd);
        
        tbody.appendChild(row);
    });
}

