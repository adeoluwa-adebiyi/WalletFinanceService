import * as dotenv from "dotenv";

dotenv.config()

export default {
    KAFKA_BOOTSTRAP_SERVER: process.env.KAFKA_BOOTSTRAP_SERVER,
    FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY,
    FLUTTERWAVE_PUB_KEY: process.env.FLUTTERWAVE_PUB_KEY,
    FL_ENCKEY: process.env.FL_ENCKEY,
    DB_URL: process.env.DB_URL,
    APP_SECRET: process.env.APP_SECRET,
    PORT: process.env.POST,
    ...process.env
};