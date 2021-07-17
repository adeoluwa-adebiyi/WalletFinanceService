export interface Message{

    entityId: String;

    version: String;

    name: String;

    data: any;

    key?: String

    getVersion(): string;

    getKey(): string;

    serialize(): string;

    deserialize(json: string): Message;

}