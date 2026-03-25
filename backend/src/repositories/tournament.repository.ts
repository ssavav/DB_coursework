import pool from '../config/db'
import { TournamentFilters } from '../types/tournament.types';
// тут получается взаимодействем с бд
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

        query += ` limit 3;`

        const result = await pool.query(query, values);
        return result.rows;
    } catch (error){
        return error;
    }
}

export default getAllTournaments;