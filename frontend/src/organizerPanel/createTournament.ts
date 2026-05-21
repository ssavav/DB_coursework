import { CONFIG } from "../config";
import { requireRole, updateHeaderAuth } from "../auth";

updateHeaderAuth();
requireRole("organizer");

const form = document.getElementById("tournament-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Вы не авторизованы!");

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    const startDate = (document.getElementById("t-start") as HTMLInputElement).value;
    const endDate = (document.getElementById("t-end") as HTMLInputElement).value;

    if (new Date(startDate) > new Date(endDate)) {
        alert("Дата начала не может быть позже даты окончания!");
        return;
    }

    try {
        const orgRes = await fetch(`${CONFIG.API_URL}/organizer/user/${userId}`);
        if (!orgRes.ok) throw new Error("Организатор не найден!");
        const orgInfo = await orgRes.json();

        const data = {
            organizerId: orgInfo.id,
            name: (document.getElementById("t-name") as HTMLInputElement).value,
            sport_type: (document.getElementById("t-sport") as HTMLInputElement).value,
            start_date: startDate,
            end_date: endDate,
            prize_pool: Number((document.getElementById("t-prize") as HTMLInputElement).value),
            status: (document.getElementById("t-status") as HTMLSelectElement).value,
        };

        const response = await fetch(`${CONFIG.API_URL}/tournaments`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Ошибка при создании");
        
        alert("Турнир успешно создан!");
        window.location.href = "index.html"; 
    } catch (err) {
        console.error(err);
        alert("Не удалось создать турнир.");
    }
});