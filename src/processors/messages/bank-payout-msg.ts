import { Message } from "./interface/message";

export interface BankPayoutParams {
    requestId?: String;
    status?: String;
    bankId: String;
    swiftCode?: String;
    country?: String;
    amount: number;
    sourceWalletId: String;
    destinationAccount: String;
    description: String;
    currency: String;
}

export const BANK_PAYOUT_MSG = "bank-payout";

export class BankPayoutMessage implements Message, BankPayoutParams {
    entityId: string;
    version: string = "1";
    name: String = BANK_PAYOUT_MSG;
    data: any;

    requestId: String;
    status: String;
    bankId: String;
    swiftCode?: String;
    amount: number;
    destinationAccount: String;
    sourceWalletId: String;
    country: String;
    description: String;
    currency: String;

    constructor(params?: BankPayoutParams) {
        this.requestId = params?.requestId;
        this.amount = params?.amount;
        this.currency = params?.currency;
        this.status = params?.status;
        this.bankId = params?.bankId;
        this.swiftCode = params?.swiftCode;
        this.amount = params.amount;
        this.destinationAccount = params?.destinationAccount;
        this.sourceWalletId = params?.sourceWalletId;
        this.country = params?.country;
        this.description = params?.description;
    }

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
                requestId: this?.requestId,
                amount: this?.amount,
                currency: this?.currency,
                status: this?.status,
                bankId: this?.bankId,
                swiftCode: this?.swiftCode,
                destinationAccount: this?.destinationAccount,
                description: this?.description,
                sourceWalletId: this?.sourceWalletId,
                country: this?.country
            }
        })
    }

    deserialize(json: string): BankPayoutMessage {
        const obj = JSON.parse(json);
        const data = obj.data;
        this.amount = data.amount;
        this.requestId = data?.requestId;
        this.status = data?.status;
        this.bankId = data?.bankId;
        this.swiftCode = data?.swiftCode;
        this.amount = data.amount;
        this.destinationAccount = data?.destinationAccount;
        this.sourceWalletId = data?.sourceWalletId;
        this.description = data?.description;
        this.currency = data.currency;
        this.country = data.country;
        return this;
    }

}