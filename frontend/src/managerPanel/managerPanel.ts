import { requireRole, updateHeaderAuth } from "../auth";


updateHeaderAuth();
requireRole("manager");

const teamControlBtn = document.getElementById("team-control-btn") as HTMLButtonElement;
const tournamentRegisterBtn = document.getElementById("tournament-register-btn") as HTMLButtonElement;
const checkTournamentRegistrationsBtn = document.getElementById("check-tournament-registrations-btn") as HTMLButtonElement


teamControlBtn.addEventListener('click', () => {
    window.location.href = '/team-control.html'
})

tournamentRegisterBtn.addEventListener('click', () => {
    window.location.href = '/register-to-tournament.html'
})

checkTournamentRegistrationsBtn.addEventListener('click', () => {
    window.location.href = '/team-tournament-registrations.html'
})
