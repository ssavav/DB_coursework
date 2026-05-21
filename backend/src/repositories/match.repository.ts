import pool from "../config/db";
import { MatchFilters } from "../types/match.types";

async function getMatches(filters: MatchFilters){
    try{
        let values:any[] = [];
        let valueIndex:number = 1;
        
        let query = `
            with teams as (
                select
                    mp.match_id,
                    mp.team_id,
                    mp.score,
                    row_number() over (
                        partition by mp.match_id
                        order by mp.team_id
                    ) as rn
                from sport.match_participant mp
            )

            select
                m.id as match_id,
                m.match_date,
                l.name as location_name,
                l.city as location_city,
                t1.name as team1_name,
                t1.id as team1_id,
                mp1.score as team1_score,
                t2.name as team2_name,
                t2.id as team2_id,
                mp2.score as team2_score
            from sport.match m
            left join sport.location l
                on m.location_id = l.id
            left join teams mp1
                on m.id = mp1.match_id
                and mp1.rn = 1
            left join teams mp2
                on m.id = mp2.match_id
                and mp2.rn = 2
            left join sport.team t1
                on mp1.team_id = t1.id
            left join sport.team t2
                on mp2.team_id = t2.id
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

        if(filters.teamName){
            query += ` and (t1.name ilike '%' || $${valueIndex} || '%' or t2.name ilike '%' || $${valueIndex} || '%')`;
            values.push(filters.teamName);
            valueIndex++;
        }

        const res = await pool.query(query, values);
        return res.rows;

    } catch(error) {
        throw error;
    }
}

async function getMatchById(id: number) {
    try {
        const query = `
            select 
                m.*,
                l.name as location_name,
                l.city as location_city,
                t1.name as team1_name,
                mp1.score as team1_score,
                t2.name as team2_name,
                mp2.score as team2_score
            from sport.match m
            left join sport.location l on m.location_id = l.id
            left join sport.match_participant mp1 on m.id = mp1.match_id
            left join sport.match_participant mp2 on m.id = mp2.match_id and mp1.team_id < mp2.team_id
            left join sport.team t1 on mp1.team_id = t1.id
            left join sport.team t2 on mp2.team_id = t2.id
            where m.id = $1
        `;
        const res = await pool.query(query, [id]);
        return res.rows[0] || null;
    } catch(error) {
        throw error;
    }
}

async function getMatchHistory(team1_id: number, team2_id: number) {
    try {
        const query = `
            select 
                m.id as match_id,
                m.match_date,
                m.stage_name,
                m.status,
                t1.name as team1_name,
                t1.id as team1_id,
                mp1.score as team1_score,
                t2.name as team2_name,
                t2.id as team2_id,
                mp2.score as team2_score
            from sport.match m
            join sport.match_participant mp1 on m.id = mp1.match_id
            join sport.match_participant mp2 on m.id = mp2.match_id
            join sport.team t1 on mp1.team_id = t1.id
            join sport.team t2 on mp2.team_id = t2.id
            where mp1.team_id = $1 and mp2.team_id = $2
            order by m.match_date desc
        `;
        const res = await pool.query(query, [team1_id, team2_id]);
        return res.rows;
    } catch(error) {
        throw error;
    }
}

async function getMatchesByTournamentId(tournamentId: number) {
    try {
        const query = `
            with teams as (
                select
                    mp.match_id,
                    mp.team_id,
                    mp.score,
                    row_number() over (
                        partition by mp.match_id
                        order by mp.team_id
                    ) as rn
                from sport.match_participant mp
            )
            select
                m.id as match_id,
                m.match_date,
                m.stage_name,
                m.status,
                l.name as location_name,
                l.city as location_city,
                t1.name as team1_name,
                t1.id as team1_id,
                mp1.score as team1_score,
                t2.name as team2_name,
                t2.id as team2_id,
                mp2.score as team2_score
            from sport.match m
            left join sport.location l on m.location_id = l.id
            left join teams mp1 on m.id = mp1.match_id and mp1.rn = 1
            left join teams mp2 on m.id = mp2.match_id and mp2.rn = 2
            left join sport.team t1 on mp1.team_id = t1.id
            left join sport.team t2 on mp2.team_id = t2.id
            where m.tournament_id = $1
            order by m.match_date asc
        `;
        const res = await pool.query(query, [tournamentId]);
        return res.rows;
    } catch(error) {
        throw error;
    }
}

async function getApprovedTeamsForTournament(tournamentId: number) {
    try {
        const query = `
            select t.id, t.name 
            from sport.team t
            join sport.tournament_registration tr on t.id = tr.team_id
            where tr.tournament_id = $1 and tr.status_registration = 'approved'
        `;
        const res = await pool.query(query, [tournamentId]);
        return res.rows;
    } catch (error) {
        throw error;
    }
}

async function createMatchTransaction(data: any) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const matchQuery = `
            insert into sport.match (tournament_id, location_id, match_date, stage_name, status)
            values ($1, $2, $3, $4, $5)
            returning id
        `;
        const matchValues = [data.tournament_id, data.location_id, data.match_date, data.stage_name, 'scheduled'];
        const matchRes = await client.query(matchQuery, matchValues);
        const matchId = matchRes.rows[0].id;

        const participantQuery = `insert into sport.match_participant (match_id, team_id) values ($1, $2)`;
        await client.query(participantQuery, [matchId, data.team1_id]);
        await client.query(participantQuery, [matchId, data.team2_id]);

        await client.query('COMMIT');
        return matchId;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateMatchTransaction(matchId: number, data: any) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const updateMatchQuery = `
            update sport.match 
            set location_id = coalesce($1, location_id),
                match_date = coalesce($2, match_date),
                stage_name = coalesce($3, stage_name),
                status = coalesce($4, status)
            where id = $5
        `;
        await client.query(updateMatchQuery, [
            data.location_id, 
            data.match_date, 
            data.stage_name, 
            data.status, 
            matchId
        ]);

        if (data.team1_id && data.team1_score !== undefined && data.team1_score !== null && data.team1_score !== '') {
            await client.query(
                `update sport.match_participant set score = $1 where match_id = $2 and team_id = $3`, 
                [data.team1_score, matchId, data.team1_id]
            );
        }
        if (data.team2_id && data.team2_score !== undefined && data.team2_score !== null && data.team2_score !== '') {
            await client.query(
                `update sport.match_participant set score = $1 where match_id = $2 and team_id = $3`, 
                [data.team2_score, matchId, data.team2_id]
            );
        }

        await client.query('COMMIT');
        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export { getMatches, 
        getMatchById,
        getMatchHistory,
        getMatchesByTournamentId,
        getApprovedTeamsForTournament,
        createMatchTransaction,
        updateMatchTransaction,
    };