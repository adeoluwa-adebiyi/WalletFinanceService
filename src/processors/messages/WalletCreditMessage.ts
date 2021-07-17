import { Message } from "./interface/message";

export class WalletCreditMessage implements Message{
    entityId: String;
    version: String = "1";
    name: String;
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
        throw new Error("Method not implemented.");
    }

    deserialize(json: string): Message {
        throw new Error("Method not implemented.");
    }
}