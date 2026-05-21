import { updateHeaderAuth } from "../auth";


updateHeaderAuth();

const historyBtn = document.getElementById("get-history-btn") as HTMLButtonElement;
const matchesBtn = document.getElementById("find-matches-btn") as HTMLButtonElement;

historyBtn.addEventListener('click', () => {
    window.location.href = '/match-history.html'
})

matchesBtn.addEventListener('click', () => {
    window.location.href = '/team-matches.html'
})
