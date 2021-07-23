import { Message } from "./interface/message";

export interface WalletCreatedMessageParams{
    userId: String;
    walletId: String;
    currency: String;
}

export class WalletCreatedMessage implements Message{

    entityId: String;
    version: String = "1";
    name: String = "wallet-created";
    data: any;

    userId: String;
    walletId: String;
    currency: String;

    constructor(params?: WalletCreatedMessageParams){
        this.walletId = params?.walletId;
        this.userId = params?.userId;
        this.currency = params?.currency;
    }

    getVersion(): string {
        throw new Error("Method not implemented.");
    }
    getKey(): string {
        throw new Error("Method not implemented.");
    }
    serialize(): string {
        return JSON.stringify({
            entityId: this.entityId,
            version: this.version,
            name: this.name,
            data: {
                userId: this.userId,
                walletId: this.walletId,
                currency: this.currency
            }
        })
    }
    deserialize(json: string): Message {
        const obj:any = JSON.stringify(json);
        const { data } = obj;
        this.name = obj.name;
        this.version = obj.version;
        this.userId = data.userId;
        this.walletId = data.walletId;
        this.currency = data.currency;
        return this;
    }

}