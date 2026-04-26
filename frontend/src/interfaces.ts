export interface Tournament {
    id: number;
    organizer_id: number;
    name: string;
    sport_type: string;
    start_date: string;
    end_date: string;
    status: string;
    prize_pool: number;
    // organizer_company_name: string;
}

export interface Organizer {
    id: number;
    company_name: string;
    email: string;
    phone: string;
}