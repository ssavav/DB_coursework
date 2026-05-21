import { Request, Response } from 'express'
import { loginUser, registerUser } from '../services/auth.services';
import { ManagerRegisterUserInput, OrganizerRegisterUserInput, UserInput } from '../types/auth.types';


async function loginHandler(req: Request, res: Response) {
    
    // console.log(req.body)
    try{
        const inputData: UserInput = req.body;

        if(!inputData.email || !inputData.passwordRaw) {
            return res.status(400).json({ error: "Email and password required"});
        }
        
        const result = await loginUser(inputData);
        
        res.status(200).json(result);
        
    } catch (error: any){
        if (error.message === "Incorrect email or password"){
            return res.status(401).json({ error: error.message} )
        }
        res.status(500).json({error: "Internal error"})
    }
}

async function registerHandler(req: Request, res: Response) {
    console.log(req.body)
    try{
        const inputData: ManagerRegisterUserInput | OrganizerRegisterUserInput = req.body;

        if(!inputData.email || !inputData.passwordRaw || !inputData.role) {
            return res.status(400).json({ error: "Email,password and role required"});
        }

        if (inputData.role === "organizer") {
            const org = inputData as OrganizerRegisterUserInput;
            if (!org.phone || !org.name) {
                return res.status(400).json({ error: "Phone number and name required for organizer" });
            }
        } else if (inputData.role === "manager") {
            const org = inputData as ManagerRegisterUserInput;
            if (!org.team_name) {
                return res.status(400).json({ error: "Team name required for manager" });
            }
        } else {
            return res.status(400).json({ error: "Incorrect input" });
        }

        const result = await registerUser(inputData);

        res.status(200).json(result);

    } catch (error: any){
        if (error.message === "User already exists"){
            return res.status(401).json({ error: error.message} )
        }
        res.status(500).json({error: "Internal error"})
    }
}



export { loginHandler, registerHandler }