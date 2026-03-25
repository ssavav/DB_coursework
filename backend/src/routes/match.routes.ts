import { Router } from "express";
import getMatcheshandler from "../controllers/match.controllers";

const matchRoutes = Router();

matchRoutes.get('/', getMatcheshandler);

export default matchRoutes;