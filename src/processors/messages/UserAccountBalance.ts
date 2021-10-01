import { Message } from "./interface/message";

export interface UserAccountBalanceParams{
    userId: String;
    balance: number;
    time: number;
    walletId: String;
    key?: String;
}

export class UserAccountBalance implements Message, UserAccountBalanceParams {
    entityId: String;
    version: String = "1";
    name: String = "user-account-balance";
    data: any;
    key?: String;

    userId: String;
    balance: number;
    time: number;
    walletId: String;

    constructor(params?: UserAccountBalanceParams){
        this.balance = params?.balance;
        this.userId = params?.userId;
        this.time = params?.time;
        this.walletId = params?.walletId;
    }
    setKey(key: String): void {
        this.key = key;
    }

    getVersion(): string {
        return this.version.toString();
    }

    getKey(): String {
        return this.key;
    }

    serialize(): string {
        return JSON.stringify({
            entityId: this.entityId,
            version: this.version,
            name: this.name,
            data:{
                balance: this.balance,
                time: this.time,
                userId: this.userId,
                walletId: this.walletId
            },
            key: this.key
        })
    }

    deserialize(json: string): Message {
        const object: any = JSON.parse(json);
        const data: any = object.data;
        this.version = data.version;
        this.balance = data.balance;
        this.time = data.time;
        this.userId = data.userId;
        this.walletId = data.walletId;
        this.key = object.key;
        return this;
    }

}