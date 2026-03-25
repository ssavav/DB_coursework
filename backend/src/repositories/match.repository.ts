import pool from "../config/db";
import { MatchFilters } from "../types/match.types";

async function getMatches(filters: MatchFilters){
    try{
        let values:any[] = [];
        let valueIndex:number = 1;
        
        let query = `
            select 
                t1.name as team1_name,
                t2.name as team2_name,
                m.match_date
            from sport.match m
            join sport.location l on m.location_id = l.id
            join sport.match_participant mp1 on m.id = mp1.match_id
            join sport.match_participant mp2 on m.id = mp2.match_id and mp1.team_id < mp2.team_id
            join sport.team t1 on mp1.team_id = t1.id
            join sport.team t2 on mp2.team_id = t2.id
            where 1=1
        `;

        if(filters.location?.name){
            query += ` and l.name = $${valueIndex}`;
            values.push(filters.location.name);
            valueIndex++;
        }

        if(filters.location?.city){
            query += ` and l.city = $${valueIndex}`;
            values.push(filters.location.city);
            valueIndex++;
        }

        if(filters.date){
            query += ` and m.match_date::date = $${valueIndex}`;
            values.push(filters.date);
            valueIndex++;
        }

        if(filters.status){
            query += ` and m.status = $${valueIndex}`;
            values.push(filters.status);
            valueIndex++;
        }

        const res = await pool.query(query, values);

        return res.rows;

    }catch(error){
        throw error;
    }
}

export default getMatches;