import { TransferVerificationParams } from "../../db/models/transferRequestVerification";
import { TransferType } from "../../db/schemas/transferRequestVerification";
import { Message } from "./interface/message";

export class TransferVerificationMessage implements Message, TransferVerificationParams {
    key?: String;
    entityId: String;
    version: String = "1";
    name: String = "transfer-verification-message";
    data: any;

    transferRequestId: String;
    approved: Boolean;
    type: TransferType;
    transferData: any;

    constructor(params?: TransferVerificationParams) {
        if (params) {
            this.transferRequestId = params.transferRequestId;
            this.approved = params.approved;
            this.type = params.type;
            this.transferData = params.transferData;
        }
    }


    getVersion(): string {
        return this.version.toString();
    }

    getKey(): string {
        return "";
        // return this.userId.toString();
    }

    serialize(): string {
        return JSON.stringify({
            entityId: this.entityId,
            version: this.version,
            name: this.name,
            data: {
                transferRequestId: this.transferRequestId,
                approved: this.approved,
                type: this.type,
                transferData: this.transferData
            }
        })
    }

    deserialize(json: string): Message {
        const object: any = JSON.parse(json);
        const data: any = object.data;
        this.version = data.version;
        this.name = object.name;
        this.transferRequestId = data.transferRequestId;
        this.approved = data.approved;
        this.type = data.type;
        this.transferData = data.transferData;
        return this;
    }
}