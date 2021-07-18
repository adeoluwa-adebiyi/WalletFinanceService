import * as dotenv from "dotenv";

dotenv.config()

export default {
    KAFKA_BOOTSTRAP_SERVER: process.env.KAFKA_BOOTSTRAP_SERVER,
    DB_URL: process.env.DB_URL,
    APP_SECRET: process.env.APP_SECRET,
    PORT: process.env.POST,
    ...process.env
};