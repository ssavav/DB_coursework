import { createTeamPlayer, deleteTeamPlayer, getTeamNameByID, getTeamIDByUserID, getTeamSquad, getTeamIDByName, getTeamFullInfo } from "../repositories/team.repository";
import { CreatePlayerInput } from "../types/team.types";



async function getTeamSquadByID(teamID: number){
    try{
        const teamSquad = await getTeamSquad(teamID);
        const teamName: string = await getTeamNameByID(teamID);
        return {
            teamId: teamID,
            teamName: teamName,
            squad: teamSquad,
        } ;
    } catch(error){
        throw new Error(String(error));
    }
}
async function getTeamNameByTeamID(teamID: number){
    try{
        const teamName: string = await getTeamNameByID(teamID);
        return {
            teamId: teamID,
            teamName: teamName,
        } ;
    } catch(error){
        throw new Error(String(error));
    }
}

async function deleteTeamPlayerByID(playerID: number){
    try{
        const result: boolean = await deleteTeamPlayer(playerID);

        return result;
    } catch(error){
        throw new Error(String(error));
    }
}

async function createTeamPlayerByData(data: CreatePlayerInput){
    try{
        const result: boolean = await createTeamPlayer(data);

        return result;
    } catch(error){
        console.log(error)
        throw new Error(String(error));
    }
}

async function getTeamIDByUser(userID: number){
    try{
        const result:number = await getTeamIDByUserID(userID);

        return result;
    } catch(error){
        console.log(error)
        throw new Error(String(error));
    }
}

async function getTeamIdByName(teamName: string) {
    try {
        return await getTeamIDByName(teamName);
    } catch(err) {
        throw new Error(String(err));
    }
}

async function getTeamFullInfoById(teamId: number) {
    try {
        return await getTeamFullInfo(teamId);
    } catch(err) {
        throw new Error(String(err));
    }
}

export {
    getTeamSquadByID,
    deleteTeamPlayerByID,
    createTeamPlayerByData,
    getTeamIDByUser,
    getTeamNameByTeamID,
    getTeamIdByName,
    getTeamFullInfoById
};