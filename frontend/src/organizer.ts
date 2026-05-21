import { CONFIG } from "./config";
import type { Tournament, Organizer } from "./interfaces";
import { renderTable } from "./index";
import { updateHeaderAuth } from "./auth";

type organizerWithTournaments = Organizer & { tournaments: Tournament[]};

const queryString: string = window.location.search;

const urlParams = new URLSearchParams(queryString);

const organizerID = urlParams.get('id');

// updateHeaderAuth()

if (!organizerID) {
    //  ААААААААААААА ОШИБКУ ААААААААААА
    // document.body.innerHTML = "<h1>Ошибка: Турнир не найден!</h1> <a href='/'>На главную</a>";
} else {
    loadTournamentDetails(organizerID);
}

async function loadTournamentDetails(id:string) {
    try{
        const response = await fetch(`${CONFIG.API_URL}/organizer/${id}`);

        if(!response.ok) throw new Error("Ошибка при обращении к серверу");
        const data: organizerWithTournaments = await response.json();

        renderOrganizerPage(data);
    } catch(error){
        console.log(error);
    }
}


function renderOrganizerPage(expandedOrganizer: organizerWithTournaments){
    // console.log(tournament);
    const titleElement = document.getElementById("organizer-name-tag");
    if (titleElement) {
        titleElement.textContent = expandedOrganizer.company_name;
    }

    const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;

    const infoElement = document.getElementById("organizer-details") as HTMLDivElement;
    if (infoElement){
        infoElement.innerHTML = '';


        const phoneTag = document.createElement("div");
        phoneTag.classList.add("param-name");
        phoneTag.textContent = "Номер телефона";
        infoElement.appendChild(phoneTag);

        const phoneTagValue = document.createElement("div");
        phoneTagValue.classList.add("param-value");
        phoneTagValue.textContent = expandedOrganizer.phone;
        infoElement.appendChild(phoneTagValue);

        const emailTag = document.createElement("div");
        emailTag.classList.add("param-name");
        emailTag.textContent = "Электронная почта";
        infoElement.appendChild(emailTag);

        const emailTagValue = document.createElement("div");
        emailTagValue.classList.add("param-value");
        emailTagValue.textContent = expandedOrganizer.email;
        infoElement.appendChild(emailTagValue);
    }

    renderTable(expandedOrganizer.tournaments, tableBody);
}