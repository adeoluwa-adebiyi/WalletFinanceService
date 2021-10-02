import { Router } from "express";
import transactions from "../controller/transactions";
import { userAuthenticated, userSessionMiddleware } from "../midddlewares/userSession";

const router: Router = Router();

router.get("/inflows",[userSessionMiddleware,userAuthenticated] ,transactions.inflows);

export default router;