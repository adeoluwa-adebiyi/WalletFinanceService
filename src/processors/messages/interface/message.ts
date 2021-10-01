export interface Message{

    entityId: String;

    version: String;

    name: String;

    data: any;

    key?: String

    getVersion(): string;

    getKey(): String;

    setKey(key: any): void;

    serialize(): string;

    deserialize(json: string): Message;

}