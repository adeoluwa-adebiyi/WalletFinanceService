import { Message } from "./interface/message";

export class WalletCreditMessage implements Message{
    entityId: String;
    version: String = "1";
    name: String = "credit";
    data: any;

    amount: Number;
    currency: String;
    walletId: String;
    userId: String;

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
            data:{
                amount: this.amount,
                currency: this.currency,
                walletId: this.walletId,
                userId: this.userId
            }
        })
    }

    deserialize(json: string): Message {
        const object: any = JSON.parse(json);
        const data: any = object.data;
        this.version = data.version;
        this.name = object.name;
        this.amount = data.amount;
        this.currency = data.currency;
        this.walletId = data.walletId;
        this.userId = data.userId;
        return this;
    }
}