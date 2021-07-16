import { Message } from "../../messages/interface/message";

export interface MessageHandler<T extends Message>{
    process(message: Message);
}