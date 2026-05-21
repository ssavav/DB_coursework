import { updateHeaderAuth } from "../auth";
import { CONFIG } from "../config";

updateHeaderAuth();

const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const teamNameInput = document.getElementById("team-inpt") as HTMLInputElement;

searchBtn.addEventListener("click", async () => {
    const teamName = teamNameInput.value.trim();
    if(!teamName) return;

    try {
        const res = await fetch(`${CONFIG.API_URL}/match?team_name=${encodeURIComponent(teamName)}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);

        tableBody.innerHTML = '';
        data.forEach((m: any) => {
            const row = document.createElement("tr");

            const name1Td = document.createElement('td');
            name1Td.innerHTML  = `<a href="/team-card.html?id=${m.team1_id}">${m.team1_name}</a>`;
            name1Td.className = "team-tag";
            
            const name2Td = document.createElement('td');
            name2Td.innerHTML  = `<a href="/team-card.html?id=${m.team2_id}">${m.team2_name}</a>`;
            name2Td.className = "team-tag";

            const score = document.createElement("td");
            score.textContent = m.team1_score !== null && m.team2_score !== null 
                ? `${m.team1_score} : ${m.team2_score}` 
                : "-:-";

            const winner = document.createElement("td");
            winner.className = "team-tag";
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


            const loc = document.createElement("td");
            loc.textContent = m.location_city ? `${m.location_name} (${m.location_city})` : "TBA";

            row.appendChild(name1Td);
            row.appendChild(name2Td);
            row.appendChild(score);
            row.appendChild(winner);
            row.appendChild(loc);
            
            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
    }
});