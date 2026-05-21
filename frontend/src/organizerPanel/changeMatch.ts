import { requireRole, updateHeaderAuth } from '../auth.js';
import { CONFIG } from '../config.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tournamentId = urlParams.get('tournamentId');

updateHeaderAuth()
requireRole("organizer")

let currentEditMatch: any = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!tournamentId) {
        alert("ID турнира не указан в URL!");
        return;
    }
    loadTournamentMatches(tournamentId);

    const form = document.getElementById('match-edit-form') as HTMLFormElement;
    form.addEventListener('submit', handleMatchUpdate);
});

async function loadTournamentMatches(id: string) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/matches/tournament/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        renderMatchesEditTable(data);
    } catch(err) {
        console.error("Ошибка загрузки матчей:", err);
    }
}

function renderMatchesEditTable(matches: any[]) {
    const tbody = document.getElementById("matchesTableBody");
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (matches.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Матчи еще не сгенерированы</td></tr>`;
        return;
    }

    matches.forEach(m => {
        const tr = document.createElement("tr");

        const score1 = m.team1_score !== null ? m.team1_score : '-';
        const score2 = m.team2_score !== null ? m.team2_score : '-';
        const dateObj = new Date(m.match_date);
        const formattedDate = dateObj.toLocaleString("ru-RU", { 
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        tr.innerHTML = `
            <td>${m.stage_name || ''}</td>
            <td>${m.status || 'scheduled'}</td>
            <td>${m.team1_name}</td>
            <td>${m.team2_name}</td>
            <td><div style="text-align: center; white-space: nowrap;">${score1} : ${score2}</div></td>
            <td>${formattedDate}</td>
            <td>${m.location_city || '—'}, ${m.location_name || 'Не назначено'}</td>
            <td>
                <button class="submit-btn edit-btn" style="padding: 5px 10px; font-size: 14px; margin-top: 0;">Редактировать</button>
            </td>
        `;

        const editBtn = tr.querySelector('.edit-btn');
        editBtn?.addEventListener('click', () => openEditForm(m));

        tbody.appendChild(tr);
    });
}

function openEditForm(matchData: any) {
    currentEditMatch = matchData;
    const form = document.getElementById('match-edit-form') as HTMLFormElement;
    form.style.display = 'grid';

    document.getElementById('m-edit-title')!.textContent = `(ID: ${matchData.match_id})`;
    document.getElementById('lbl-team1')!.textContent = matchData.team1_name;
    document.getElementById('lbl-team2')!.textContent = matchData.team2_name;

    (document.getElementById('m-team1-score') as HTMLInputElement).value = matchData.team1_score !== null ? matchData.team1_score : '';
    (document.getElementById('m-team2-score') as HTMLInputElement).value = matchData.team2_score !== null ? matchData.team2_score : '';
    (document.getElementById('m-stage') as HTMLInputElement).value = matchData.stage_name;
    (document.getElementById('m-status') as HTMLSelectElement).value = matchData.status;

    const d = new Date(matchData.match_date);
    const dateLocal = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    (document.getElementById('m-date') as HTMLInputElement).value = dateLocal;

    (document.getElementById('m-location') as HTMLInputElement).value = matchData.location_id || '';
}

async function handleMatchUpdate(e: Event) {
    e.preventDefault();
    if (!currentEditMatch) return;

    const payload = {
        team1_id: currentEditMatch.team1_id,
        team2_id: currentEditMatch.team2_id,
        team1_score: (document.getElementById('m-team1-score') as HTMLInputElement).value,
        team2_score: (document.getElementById('m-team2-score') as HTMLInputElement).value,
        match_date: (document.getElementById('m-date') as HTMLInputElement).value,
        location_id: (document.getElementById('m-location') as HTMLInputElement).value,
        stage_name: (document.getElementById('m-stage') as HTMLInputElement).value,
        status: (document.getElementById('m-status') as HTMLSelectElement).value
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${CONFIG.API_URL}/matches/${currentEditMatch.match_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Матч успешно обновлен!");
            (document.getElementById('match-edit-form') as HTMLFormElement).style.display = 'none';
            loadTournamentMatches(tournamentId!);
        } else {
            const data = await response.json();
            alert("Ошибка обновления: " + (data.error || ""));
        }
    } catch(err) {
        console.error(err);
        alert("Ошибка сети");
    }
}