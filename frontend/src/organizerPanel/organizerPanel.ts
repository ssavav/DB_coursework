import { requireRole, updateHeaderAuth } from "../auth";


updateHeaderAuth();
requireRole("organizer")


const createTournamentBtn = document.getElementById("create-tournament-btn") as HTMLButtonElement;
const changeTournamentBtn = document.getElementById("change-tournament-btn") as HTMLButtonElement;
const checkRequestsBtn = document.getElementById("check-requests-btn") as HTMLButtonElement;
const addMatchBtn = document.getElementById("add-match-btn") as HTMLButtonElement;
const changeMatchBtn = document.getElementById("change-match-btn") as HTMLButtonElement;


createTournamentBtn.addEventListener('click', () => {
    window.location.href = '/create-tournament.html'
})

changeTournamentBtn.addEventListener('click', () => {
    window.location.href = '/change-tournament.html'
})

checkRequestsBtn.addEventListener('click', () => {
    window.location.href = '/tournament-requests.html'
})

addMatchBtn.addEventListener('click', () => {
    window.location.href = '/create-match.html'
})

changeMatchBtn.addEventListener('click', () => {
    window.location.href = '/change-match.html'
})

