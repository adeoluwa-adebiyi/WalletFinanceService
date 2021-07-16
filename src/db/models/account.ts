import { model } from "mongoose";
import currencySchema from "../schemas/currency";

export default model("currency", currencySchema);