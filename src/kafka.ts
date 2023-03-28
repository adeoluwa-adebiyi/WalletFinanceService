import { Kafka, KafkaConfig, Consumer as KafkaConsumer, Producer as KafkaProducer, ProducerConfig } from "kafkajs";
import { WALLET_FINANCE_SERVICE } from "./constants";
import config from "../src/config";

export class KafkaService {

    static INSTANCE;

    private kafkaClient: Kafka;

    private kafkaConsumer: KafkaConsumer;

    private kafkaProducer: KafkaProducer;

    constructor(){
        this.kafkaClient = null;
        this.kafkaConsumer = null;
        this.kafkaProducer = null;
    }

    static async getInstance(consumerId=WALLET_FINANCE_SERVICE): Promise<KafkaService>{
        // if(!this.INSTANCE){
        //     this.INSTANCE = new KafkaService();
        //     this.INSTANCE.kafkaClient = new Kafka(<KafkaConfig>{
        //         // clientId: WALLET_API_SERVICE,
        //         brokers: [
        //             config.KAFKA_BOOTSTRAP_SERVER
        //         ]
        //      });
        //     this.INSTANCE.kafkaConsumer = this.INSTANCE.kafkaClient.consumer({
        //         groupId: WALLET_FINANCE_SERVICE
        //     });
        //     this.INSTANCE.kafkaProducer = this.INSTANCE.kafkaClient.producer(<ProducerConfig>{
                
        //     });
        //     await this.INSTANCE.kafkaConsumer.connect();
        //     await this.INSTANCE.kafkaProducer.connect();
        // }
        const instance = new KafkaService();
        instance.kafkaClient = new Kafka(<KafkaConfig>{
            // clientId: WALLET_API_SERVICE,
            brokers: [
                config.KAFKA_BOOTSTRAP_SERVER
            ]
         });
        instance.kafkaConsumer = instance.kafkaClient.consumer({
            groupId: consumerId
        });
        instance.kafkaProducer = instance.kafkaClient.producer(<ProducerConfig>{
            
        });
        await instance.kafkaConsumer.connect();
        await instance.kafkaProducer.connect();
        return instance;
    }

    get consumer(): KafkaConsumer{
        return this.kafkaConsumer;
    }

    get producer(): KafkaProducer{
        return this.kafkaProducer;
    }

    getKafkaClient(): Kafka {
        return  this.kafkaClient;
    }
}