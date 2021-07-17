import { Consumer as KafkaConsumer, EachBatchPayload, Kafka, KafkaConfig } from "kafkajs";
import * as topics from "./topics";
import config from "../src/config";
import { WALLET_FINANCE_SERVICE } from "./constants";
import { KafkaService } from "./kafka";
import { WalletFundPaymentSuccessMessage, WalletFundPaymentSuccessParams } from "./processors/messages/WalletFundSuccessMsg";
import { connect } from "./db/connection";
import app from "./app";

// const kafka:Kafka = new Kafka(<KafkaConfig>{
//    clientId: WALLET_API_SERVICE,
//    brokers: [
//        config.KAFKA_BOOTSTRAP_SERVER
//    ]
// });

// const consumer: KafkaConsumer = kafka.consumer({
//     groupId: WALLET_API_SERVICE,
// });

const processWalletFundEvents = async ()=>{
    const kafkaService = await KafkaService.getInstance();
    await kafkaService.consumer.subscribe({ topic: topics.WALLET_MONEY_EVENT_TOPIC, });

    await kafkaService.consumer.run({
        autoCommit:true,
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){

            }
        }
    })
}


connect().then(async connection => {
    // processWalletFundEvents();
    app.listen(config.PORT);
});