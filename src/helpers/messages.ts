
import { MessageHandler } from "..";
import { Message } from "../processors/messages/interface/message";

export const matchMessage = (regex: String,message:String, serializer: Message, messageHandler: MessageHandler) => {
    const obj = JSON.parse(message.toString())
    console.log("OBJECT:");
    console.log(obj);
    const messageName = obj?.name;
    console.log()
    if(RegExp(regex.toString()).test(messageName)){
        console.log("MATCHED: "+regex);
        messageHandler(serializer.deserialize(message.toString()))
    }
}