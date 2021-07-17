import { Consumer as KafkaConsumer, EachBatchPayload, Kafka, KafkaConfig } from "kafkajs";
import * as topics from "./topics";
import config from "../src/config";
import { WALLET_FINANCE_SERVICE } from "./constants";
import { KafkaService } from "./kafka";
import { WalletCreditMessage } from "./processors/messages/WalletCreditMessage";
import { connect } from "./db/connection";
import app from "./app";
import { Message } from "./processors/messages/interface/message";
import accountService from "../services/account";
import { WALLET_CREDIT } from "./message_types";
import { matchMessage } from "./helpers/messages";
import { AccountService } from "./services/account";


const processWalletMoneyEvents = async ()=>{
    const kafkaService = await KafkaService.getInstance();
    await kafkaService.consumer.subscribe({ topic: topics.WALLET_MONEY_EVENT_TOPIC, });

    await kafkaService.consumer.run({
        autoCommit:true,
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){
                matchMessage(WALLET_CREDIT, message.value.toString(), new WalletCreditMessage(), handleWalletCreditMessage);
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

connect().then(async connection => {
    processWalletMoneyEvents();
    app.listen(config.PORT);
});