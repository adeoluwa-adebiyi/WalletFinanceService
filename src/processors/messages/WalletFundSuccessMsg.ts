import { Message } from "./interface/message";

export interface WalletFundPaymentSuccessParams {
    userId: String;
}

export class WalletFundPaymentSuccessMessage implements Message, WalletFundPaymentSuccessParams {

    constructor(params?: WalletFundPaymentSuccessParams) {

    }
    
    entityId: String;
    version: string;
    name: String;
    data: any;
    userId: String;

    getVersion(): string {
        return this.version;
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
                
            }
        })
    }

    deserialize(json: string): WalletFundPaymentSuccessMessage {
        const obj = JSON.parse(json);
        const data = obj.data;
        this.userId = data.userId;
        return this;
    }

}