
import { MessageHandler } from "..";
import { Message } from "../processors/messages/interface/message";

export const matchMessage = (regex: String,message:String, serializer: Message, messageHandler: MessageHandler, key: any= null) => {
    const obj = JSON.parse(message.toString())
    const messageName = obj?.name;
    if(RegExp(regex.toString()).test(messageName)){
        console.log("MATCHED: "+regex);
        messageHandler(serializer.deserialize(JSON.stringify({...JSON.parse(message.toString()), key})))
    }
}