import { Router } from "express";
import accountController from "../controller/account";
import { userAuthenticated, userSessionMiddleware } from "../midddlewares/userSession";

const router: Router = Router();

router.get("/balance/walletId", [userSessionMiddleware, userAuthenticated], accountController.paymentInitController);

export default router;