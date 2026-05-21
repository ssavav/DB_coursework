import pool from '../config/db'
import { TournamentFilters } from '../types/tournament.types';


async function getTournamentByID(id: number) {
    try{
        const values: any[] = [];
        let query: string = `
            select 
                t.*,
                o.company_name as organizer_company_name
            from 
                sport.tournament t
            left join 
                sport.organizer o on t.organizer_id = o.id
            where 
                t.id = $1
        `;

        values.push(id)
        // query += ` limit 3;`

        const result = await pool.query(query, values);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error){
        return error;
    }
}

async function getTournamentsByOrganizerID(organizerID: number) {
    
    
    try{
        if(isNaN(organizerID)) return;

        const query = `
            select id, name, sport_type, start_date, end_date, status, prize_pool 
            from sport.tournament 
            where organizer_id = $1
        `;

        const result = await pool.query(query, [organizerID]);

        return result.rows;

    } catch (error){
        return error;
    }
}

async function getAllTournaments(filters: TournamentFilters) {
    try{
        const values: any[] = [];
        let query: string = `select * from sport.tournament where 1=1`;
        let paramIndex: number = 1;

        if(filters.sportType){
            query += ` and sport_type = $${paramIndex}`;
            values.push(filters.sportType);
            paramIndex++;
        }

        if(filters.status){
            query += ` and status = $${paramIndex}`;
            values.push(filters.status);
            paramIndex++;
        }

        if(filters.name){
            query += ` and name ilike '%' || $${paramIndex} || '%'`;
            values.push(filters.name);
            paramIndex++;
        }

        // query += ` limit 3;`

        const result = await pool.query(query, values);
        return result.rows;
    } catch (error){
        return error;
    }
}

async function createTournament(organizerId: number, data: any) {
    try {
        const query = `
            insert into sport.tournament 
            (organizer_id, name, sport_type, start_date, end_date, prize_pool, status) 
            values ($1, $2, $3, $4, $5, $6, $7) returning *;
        `;
        const values = [
            organizerId, data.name, data.sport_type, data.start_date, 
            data.end_date, data.prize_pool, data.status
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function updateTournament(tournamentId: number, organizerId: number, data: any) {
    try {
        const query = `
            update sport.tournament 
            set name = coalesce($1, name),
                sport_type = coalesce($2, sport_type),
                start_date = coalesce($3, start_date),
                end_date = coalesce($4, end_date),
                prize_pool = coalesce($5, prize_pool),
                status = coalesce($6, status)
            where id = $7 
              and organizer_id = $8
            returning *;
        `;
        const values = [
            data.name, data.sport_type, data.start_date, 
            data.end_date, data.prize_pool, data.status, 
            tournamentId, organizerId
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export {
    getTournamentByID,
    getAllTournaments,
    getTournamentsByOrganizerID,
    createTournament,
    updateTournament
};