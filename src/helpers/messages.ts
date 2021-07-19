
import { MessageHandler } from "..";
import { Message } from "../processors/messages/interface/message";

export const matchMessage = (regex: String,message:String, serializer: Message, messageHandler: MessageHandler) => {
    const messageName = JSON.parse(message.toString())?.value?.data;
    if(RegExp(regex.toString()).test(messageName)){
        console.log("MATCHED: "+regex);
        messageHandler(serializer.deserialize(message.toString()))
    }
}