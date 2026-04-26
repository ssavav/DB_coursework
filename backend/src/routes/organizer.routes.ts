import { Router } from "express";
import * as organizerControllers from "../controllers/organizer.contollers";

const organizerRoutes = Router();

organizerRoutes.get('/:id', organizerControllers.getOrganizerByIDHandler);

export default organizerRoutes;


