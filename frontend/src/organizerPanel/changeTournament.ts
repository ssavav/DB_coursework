import { CONFIG } from "../config";
import { requireRole, updateHeaderAuth } from "../auth";

updateHeaderAuth();
requireRole("organizer");

const selectElem = document.getElementById("tournament-select") as HTMLSelectElement;
const loadBtn = document.getElementById("load-btn") as HTMLButtonElement;
const form = document.getElementById("tournament-form") as HTMLFormElement;

let currentOrganizerId: number | null = null;
let currentTournamentId: number | null = null;

async function init() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Вы не авторизованы!");

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    try {
        const orgRes = await fetch(`${CONFIG.API_URL}/organizer/user/${userId}`);
        if (!orgRes.ok) throw new Error("Вы не являетесь организатором");
        const orgInfo = await orgRes.json();
        currentOrganizerId = orgInfo.id;

        const tourRes = await fetch(`${CONFIG.API_URL}/tournaments/organizer/${currentOrganizerId}`);
        const tournaments = await tourRes.json();

        selectElem.innerHTML = '<option value="">Выберите турнир </option>';
        tournaments.forEach((t: any) => {
            const opt = document.createElement("option");
            opt.value = t.id;
            opt.textContent = `${t.name} (${t.status})`;
            selectElem.appendChild(opt);
        });

    } catch (err) {
        console.error(err);
    }
}
init();

loadBtn.addEventListener("click", async () => {
    const tId = selectElem.value;
    if (!tId) return alert("Выберите турнир из списка");

    try {
        const res = await fetch(`${CONFIG.API_URL}/tournaments/${tId}`);
        if (!res.ok) throw new Error("Не удалось загрузить данные турнира");
        const tournament = await res.json();

        currentTournamentId = tournament.id;
        form.style.display = "grid";

        (document.getElementById("t-name") as HTMLInputElement).value = tournament.name;
        (document.getElementById("t-sport") as HTMLInputElement).value = tournament.sport_type;
        (document.getElementById("t-prize") as HTMLInputElement).value = tournament.prize_pool;
        (document.getElementById("t-status") as HTMLSelectElement).value = tournament.status;

        if (tournament.start_date) {
            (document.getElementById("t-start") as HTMLInputElement).value = new Date(tournament.start_date).toISOString().split('T')[0];
        }
        if (tournament.end_date) {
            (document.getElementById("t-end") as HTMLInputElement).value = new Date(tournament.end_date).toISOString().split('T')[0];
        }
    } catch (err) {
        alert("Ошибка загрузки турнира");
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentTournamentId || !currentOrganizerId) return;

    const startDate = (document.getElementById("t-start") as HTMLInputElement).value;
    const endDate = (document.getElementById("t-end") as HTMLInputElement).value;

    if (new Date(startDate) > new Date(endDate)) {
        alert("Дата начала не может быть позже даты окончания!");
        return;
    }

    const data = {
        organizerId: currentOrganizerId,
        name: (document.getElementById("t-name") as HTMLInputElement).value,
        sport_type: (document.getElementById("t-sport") as HTMLInputElement).value,
        start_date: startDate,
        end_date: endDate,
        prize_pool: Number((document.getElementById("t-prize") as HTMLInputElement).value),
        status: (document.getElementById("t-status") as HTMLSelectElement).value,
    };

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${CONFIG.API_URL}/tournaments/${currentTournamentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Ошибка при обновлении");
        
        alert("Турнир успешно обновлен!");
        window.location.href = `organizer.html?id=${currentOrganizerId}`; 
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
});