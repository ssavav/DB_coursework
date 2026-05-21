import pool from "../config/db";
import type { CreatePlayerInput } from "../types/team.types";

async function getTeamSquad(teamId: number) {
    const query = `
        select id, real_name, birth_date 
        from sport.player 
        where team_id = $1;
    `;
    const result = await pool.query(query, [teamId]);
    return result.rows; 
}

async function deleteTeamPlayer(playerId: number){
    const query = `
    delete from sport.player where id = $1
    `;

    const result = await pool.query(query, [playerId]);

    return (result.rowCount ?? 0) > 0;
}


async function createTeamPlayer(data: CreatePlayerInput) {
  const query = `
    insert into sport.player (team_id, real_name, birth_date)
    values ($1, $2, $3)
    returning *`;

  const result = await pool.query(query, [data.teamId, data.realName, data.birthDate]);
  return result.rows[0];
}

async function getTeamIDByName(teamName: string) {

    const query = `select id from sport.team where name ilike $1 limit 1`;
    const result = await pool.query(query, [teamName]);

    if (result.rows.length > 0) {
        return result.rows[0].id;
    }

    throw new Error("Team not found")
}

async function getTeamNameByID(id: number) {

    const findQuery = `select name from sport.team where id = $1`;
    const findResult = await pool.query(findQuery, [id]);

    if (findResult.rows.length > 0) {
        return findResult.rows[0].name;
    }

    throw new Error("Team not found")
}
async function getTeamIDByUserID(userId: number) {
    const query = `select team_id from sport.manager where user_id = $1;`;
    const result = await pool.query(query, [userId]);
    return result.rows.length > 0 ? result.rows[0].team_id : null;
}

async function getTeamFullInfo(teamId: number) {
    const teamRes = await pool.query(`select * from sport.team where id = $1`, [teamId]);
    if (teamRes.rows.length === 0) return null;
    const team = teamRes.rows[0];

    const playersRes = await pool.query(`select id, real_name, birth_date from sport.player where team_id = $1`, [teamId]);
    
    const coachesRes = await pool.query(`select id, first_name, last_name, experience_years from sport.coach where team_id = $1`, [teamId]);

    return {
        ...team,
        players: playersRes.rows,
        coaches: coachesRes.rows
    };
}

export {getTeamSquad,
    deleteTeamPlayer,
    createTeamPlayer,
    getTeamIDByName,
    getTeamNameByID,
    getTeamIDByUserID,
    getTeamFullInfo}