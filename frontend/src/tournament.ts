import { CONFIG } from "./config";
import type { Tournament } from "./interfaces";
type TournamentWithOrganizer = Tournament & { organizer_company_name?: string };

const queryString: string = window.location.search;

const urlParams = new URLSearchParams(queryString);

const tournamentID = urlParams.get('id');


if (!tournamentID) {
    //  ААААААААААААА ВЫСРАТЬ ОШИБКУ ААААААААААА
    // document.body.innerHTML = "<h1>Ошибка: Турнир не найден!</h1> <a href='/'>На главную</a>";
} else {
    loadTournamentDetails(tournamentID);
}

async function loadTournamentDetails(id:string) {
    try{
        const response = await fetch(`${CONFIG.API_URL}/tournaments/${id}`);

        if(!response.ok) throw new Error("Ошибка при обращении к серверу");
        const data: Tournament = await response.json();

        renderTournamentPage(data);
    } catch(error){
        console.log(error);
        // ААААААААА ВЫСРАТЬ ОШИБКУ ААААААААААА
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
        'cancelled': '<span class="badge cancelled">Отменён</span>'
    };
    
    return statuses[status] || `<span class="badge active">${status}</span>`;
}

