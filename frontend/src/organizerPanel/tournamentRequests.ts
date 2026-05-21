import { CONFIG } from "../config";
import { requireRole, updateHeaderAuth } from "../auth";

updateHeaderAuth();
requireRole("organizer")

const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;

let currentOrganizerId: number | null = null;

async function init() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const orgRes = await fetch(`${CONFIG.API_URL}/organizer/user/${userId}`);
        if (!orgRes.ok) throw new Error("Вы не являетесь организатором");
        
        const orgInfo = await orgRes.json();
        currentOrganizerId = orgInfo.id;

        await loadRequests(currentOrganizerId!);
    } catch(err) {
        console.error(err);
        alert(err);
    }
}

async function loadRequests(organizerId: number) {
    try {
        const res = await fetch(`${CONFIG.API_URL}/tournament-registration/organizer/${organizerId}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error("Не удалось получить заявки");

        renderTable(data);
    } catch(err) {
        console.error(err);
        alert(err);
    }
}

function renderTable(requests: any[]) {
    tableBody.innerHTML = '';

    if (requests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Заявок пока нет </td></tr>';
        return;
    }

    const sortedRequests = requests.sort((a, b) => {
        if (a.status_registration === 'pending' && b.status_registration !== 'pending') return -1;
        if (a.status_registration !== 'pending' && b.status_registration === 'pending') return 1;
        return new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime();
    });

    sortedRequests.forEach(req => {
        const row = document.createElement('tr');

        const tournamentTd = document.createElement('td');
        tournamentTd.className = "organizer-tag";
        tournamentTd.innerHTML = `<a href="/tournament.html?id=${req.tournament_id}">${req.tournament_name}</a>`;

        const teamTd = document.createElement('td');
        teamTd.textContent = req.team_name;

        const dateTd = document.createElement('td');
        dateTd.textContent = new Date(req.registration_date).toLocaleDateString("ru-RU", {
            hour: '2-digit', minute: '2-digit'
        });

        const actionTd = document.createElement('td');
        
        if (req.status_registration === 'pending') {
            const btnGroup = document.createElement('div');
            btnGroup.className = "btn-group";

            const acceptBtn = document.createElement('button');
            acceptBtn.className = "accept-btn";
            acceptBtn.textContent = "Принять";
            acceptBtn.onclick = () => updateStatus(req.tournament_id, req.team_id, "approved");
            const rejectBtn = document.createElement('button');
            rejectBtn.className = "reject-btn";
            rejectBtn.textContent = "Отклонить";
            rejectBtn.onclick = () => updateStatus(req.tournament_id, req.team_id, "rejected");

            btnGroup.appendChild(acceptBtn);
            btnGroup.appendChild(rejectBtn);
            actionTd.appendChild(btnGroup);
        } else {
            const statusSpan = document.createElement('span');
            if (req.status_registration === 'approved' || req.status_registration === 'active' || req.status_registration === 'registered') {
                statusSpan.className = "status-approved";
                statusSpan.textContent = "Одобрена";
            } else {
                statusSpan.className = "status-rejected";
                statusSpan.textContent = "Отклонена";
            }
            actionTd.appendChild(statusSpan);
        }

        row.appendChild(tournamentTd);
        row.appendChild(teamTd);
        row.appendChild(dateTd);
        row.appendChild(actionTd);

        tableBody.appendChild(row);
    });
}

async function updateStatus(tournamentId: number, teamId: number, newStatus: string) {

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${CONFIG.API_URL}/tournament-registration/status`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                tournamentId: tournamentId,
                teamId: teamId,
                newStatus: newStatus
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Не удалось обновить статус");
        }

        alert("Статус заявки обновлен!");

        if (currentOrganizerId) {
            await loadRequests(currentOrganizerId);
        }

    } catch(err: any) {
        console.error(err);
        alert(err.message);
    }
}

document.addEventListener("DOMContentLoaded", init);