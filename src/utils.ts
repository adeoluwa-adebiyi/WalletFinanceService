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

export const calculateSkipAndLimit = (page: Number, limit:Number =1): {skip:number, limit: number} =>{
    return page.valueOf() < 1 ? {
        skip: 1*limit.valueOf(),limit: limit.valueOf()} : {
            skip:(page.valueOf()-1) * limit.valueOf(), limit: limit.valueOf()
        };
}