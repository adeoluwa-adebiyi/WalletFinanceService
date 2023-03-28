import {
    Producer as KafkaProducer,
    Consumer as KafkaConsumer,
    ConsumerSubscribeTopic,
    ConsumerRunConfig,
    EachMessagePayload,
    EachBatchPayload,
    KafkaMessage
} from "kafkajs";
import { KafkaService } from "../kafka";
import { Message } from "../processors/messages/interface/message";

export interface MessageHandler {
    ({ message: any }): Promise<void>;
}

export interface MessageBatchHandler {
    ({ messages: Array, commitMessageBatch: Function }): Promise<void>;
}

export interface KafkaMessageMetaData extends KafkaMessage {
}

export type IEventBusMetaData = KafkaMessageMetaData | { topic: string };

export interface IEventBus<MetaData> {
    submitRequest(message: Message, topic: string): Promise<void>;
    handleMessage(topic: string, messageHandler: MessageHandler, metadata: MetaData): Promise<void>;
}

export interface IEventBusBatchHandler {
    handleMessageBatch(topic: string, messageHandler: MessageBatchHandler): Promise<void>;
}

export class KafkaJSEventBus implements IEventBus<KafkaMessageMetaData>, IEventBusBatchHandler {

    private producer: KafkaProducer;

    private consumer: KafkaConsumer;

    constructor(client: KafkaProducer, consumer: KafkaConsumer) {
        this.producer = client;
        this.consumer = consumer;
    }

    async handleMessageBatch(topic: string, messageHandler: MessageBatchHandler): Promise<void> {
        await this.consumer.subscribe(<ConsumerSubscribeTopic>{
            topic
        });

        await this.consumer.run(<ConsumerRunConfig>{
            autoCommit: false,
            eachBatch: async (payload: EachBatchPayload) => {
                await messageHandler({
                    messages: payload.batch.messages,
                    commitMessageBatch: payload.resolveOffset
                })
            }
        });
    }

    async handleMessage(topic: string, messageHandler: MessageHandler): Promise<void> {
        await this.consumer.subscribe(<ConsumerSubscribeTopic>{
            topic
        });
        await this.consumer.run(<ConsumerRunConfig>{
            autoCommit: true,
            eachMessage: async (payload: EachMessagePayload) => {
                await messageHandler({
                    message: payload.message,
                });
            },
        });
    }

    async submitRequest(message: Message, topic: string): Promise<void> {
        await this.producer.send({
            topic,
            messages: [
                {
                    ...{ 
                        key: message?.getKey().toString() ?? null 
                    },
                    value: message.serialize()
                }
            ]
        })
    }

}

let eventBus: IEventBus<IEventBusMetaData>;

const eventBusInitializer = async () => {
    const kafka = await KafkaService.getInstance();
    eventBus = new KafkaJSEventBus(kafka.producer, kafka.consumer);
    return eventBus;
}


export default eventBusInitializer();