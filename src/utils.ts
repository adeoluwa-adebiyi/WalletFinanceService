import { Message } from "./processors/messages/interface/message";

export const createMessage = <T extends Message,KeyType>(
        messageType: { new (params:any): T; },
        params: Partial<T>,
        key: KeyType
    ): T => {
    const message = new messageType({...params});
    message.setKey(key);
    return message;
}