import { Consumer as KafkaConsumer, EachBatchPayload, Kafka, KafkaConfig } from "kafkajs";
import * as topics from "./topics";
import config from "../src/config";
import { WALLET_FINANCE_SERVICE } from "./constants";
import { KafkaService } from "./kafka";
import { WalletCreditMessage } from "./processors/messages/WalletCreditMessage";
import { connect } from "./db/connection";
import app from "./app";
import { Message } from "./processors/messages/interface/message";
import accountService from "./services/account";
import { WALLET_CREATED, WALLET_CREDIT } from "./message_types";
import { matchMessage } from "./helpers/messages";
import { AccountService } from "./services/account";
import { WalletCreatedMessage } from "./processors/messages/account-created-msg";


const processWalletMoneyEvents = async ()=>{
    const kafkaService = await KafkaService.getInstance();
    await kafkaService.consumer.subscribe({ topic: topics.WALLET_MONEY_EVENT_TOPIC, });

    await kafkaService.consumer.run({
        autoCommit:true,
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){
                console.log(message);
                matchMessage(WALLET_CREDIT, message.value.toString(), new WalletCreditMessage(), handleWalletCreditMessage);
            }
        }
    })
}

const processWalletStateEvents = async ()=>{
    const kafkaService = await KafkaService.getInstance();
    await kafkaService.consumer.subscribe({ topic: topics.WALLET_STATE_EVENT_TOPIC, });

    await kafkaService.consumer.run({
        autoCommit:true,
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){
                console.log(message);
                matchMessage(WALLET_CREATED, message.value.toString(), new WalletCreditMessage(), handleWalletCreatedMessage);
            }
        }
    })
}

export interface MessageHandler{
    (message: Message): any;
}

const handleWalletCreditMessage = async(message: WalletCreditMessage) => {
    accountService.processCreditAccount(message.walletId, message.amount)
}

const handleWalletCreatedMessage = async(message: WalletCreatedMessage) => {
    accountService.processWalletCreated(message.walletId, message.userId);
}

connect().then(async connection => {
    processWalletMoneyEvents();
    // processWalletStateEvents();
    app.listen(config.PORT);
});