export interface Message{

    entityId: String;

    version: String;

    name: String;

    data: any;

    getVersion(): string;

    getKey(): string;

    serialize(): string;

    deserialize(json: string): Message;

}