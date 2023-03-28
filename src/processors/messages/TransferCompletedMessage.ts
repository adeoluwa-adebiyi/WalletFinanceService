import { Message } from "./interface/message";

export interface TransferCompletedMessageParams{
    transferRequestId: String;
}

export class TransferCompletedMessage implements Message, TransferCompletedMessageParams {
    key?: String;
    entityId: String;
    version: String = "1";
    name: String = "transfer-completed";
    data: any;

    transferRequestId: String;

    constructor(params?: TransferCompletedMessageParams) {
        if (params) {
            this.transferRequestId = params.transferRequestId;
        }
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
            data: {
                transferRequestId: this.transferRequestId,
            },
            key: this.key
        })
    }

    deserialize(json: string): Message {
        const object: any = JSON.parse(json);
        const data: any = object.data;
        this.version = data.version;
        this.name = object.name;
        this.transferRequestId = data.transferRequestId;
        this.key = object.key;
        return this;
    }
}