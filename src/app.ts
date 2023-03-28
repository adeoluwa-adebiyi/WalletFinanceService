import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as morgan from "morgan";
import config from "./config";
import BaseRoutes from "./routes";

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.use("/account", BaseRoutes.accountRoutes);

app.use("/transactions", BaseRoutes.transactionsRoutes);

app.use(helmet());

export default app;