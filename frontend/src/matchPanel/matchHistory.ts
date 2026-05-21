import { updateHeaderAuth } from "../auth";
import { CONFIG } from "../config";

updateHeaderAuth();

const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const getHistoryBtn = document.getElementById("search-btn") as HTMLButtonElement;

const team1Input = document.getElementById("team1-inpt") as HTMLInputElement;
const team2Input = document.getElementById("team2-inpt") as HTMLInputElement;

getHistoryBtn.addEventListener("click", async () => {
    const t1Name = team1Input.value.trim();
    const t2Name = team2Input.value.trim();

    if (!t1Name || !t2Name) {
        alert("Введите оба названия команд!");
        return;
    }

    try {
        const res1 = await fetch(`${CONFIG.API_URL}/team/search?name=${encodeURIComponent(t1Name)}`);
        if (!res1.ok) { alert(`Команда "${t1Name}" не найдена!`); return; }
        const data1 = await res1.json();
        
        const res2 = await fetch(`${CONFIG.API_URL}/team/search?name=${encodeURIComponent(t2Name)}`);
        if (!res2.ok) { alert(`Команда "${t2Name}" не найдена!`); return; }
        const data2 = await res2.json();

        const h2hRes = await fetch(`${CONFIG.API_URL}/match/history/${data1.id}/${data2.id}`);
        if (!h2hRes.ok) throw new Error("Не удалось получить историю");
        const matchData = await h2hRes.json();

        renderHistoryTable(matchData);

    } catch (err) {
        console.error(err);
        alert("Ошибка при получении истории матчей.");
    }
});

function renderHistoryTable(matches: any[]) {
    tableBody.innerHTML = '';
    
    if(matches.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Истории встреч нет</td></tr>';
        return;
    }

    matches.forEach(m => {
        const row = document.createElement('tr');

        const name1Td = document.createElement('td');
        name1Td.innerHTML  = `<a href="/team-card.html?id=${m.team1_id}">${m.team1_name}</a>`;
        name1Td.className = "team-tag";
        
        const name2Td = document.createElement('td');
        name2Td.innerHTML  = `<a href="/team-card.html?id=${m.team2_id}">${m.team2_name}</a>`;
        name2Td.className = "team-tag";

        const scoreTd = document.createElement('td');
        scoreTd.textContent = `${m.team1_score} : ${m.team2_score}`;

        const winnerTd = document.createElement('td');
        if (m.team1_score > m.team2_score) winnerTd.textContent = m.team1_name;
        else if (m.team2_score > m.team1_score) winnerTd.textContent = m.team2_name;
        else winnerTd.textContent = "Ничья";

        const locTd = document.createElement('td');
        locTd.textContent = new Date(m.match_date).toLocaleDateString("ru-RU");

        row.appendChild(name1Td);
        row.appendChild(name2Td);
        row.appendChild(scoreTd);
        row.appendChild(winnerTd);
        row.appendChild(locTd);

        tableBody.appendChild(row);
    });
}