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
import TransferService, { TransferRequestMessage } from "./services/transferService";
import { AccountService } from "./services/account";
import { WalletCreatedMessage } from "./processors/messages/account-created-msg";
import { WalletTransferMoneyMessage } from "./processors/messages/wallet-transfer-money-message";
import { TransferCompletedMessage } from "./processors/messages/TransferCompletedMessage";
import { BankPayoutMessage } from "./processors/messages/bank-payout-msg";

export const WALLET_TRANSFER_REQUEST_MSG = "wallet-transfer-money-message";
export const BANK_TRANSFER_REQUEST_MSG = "bank-payout";

const processWalletMoneyEvents = async ()=>{
    const WALLET_MONEY_EVENTS_GROUP = `${WALLET_FINANCE_SERVICE}-wallet-money-events`;
    const kafkaService = await KafkaService.getInstance(WALLET_MONEY_EVENTS_GROUP);
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
    const WALLET_STATE_EVENTS_GROUP = `${WALLET_FINANCE_SERVICE}-wallet-state-events`
    const kafkaService = await KafkaService.getInstance(WALLET_STATE_EVENTS_GROUP);
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

const TRANSFER_COMPLETED_MSG = "transfer-completed";
const processTransferRequestMessage = async ()=>{
    const WALLET_STATE_EVENTS_GROUP = `${WALLET_FINANCE_SERVICE}-trx-events`
    const kafkaService = await KafkaService.getInstance(WALLET_STATE_EVENTS_GROUP);
    await kafkaService.consumer.subscribe({ topic: topics.WALLET_TRX_EVENTS_TOPIC, });

    await kafkaService.consumer.run({
        autoCommit:true,
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){
                console.log(message);
                matchMessage(WALLET_TRANSFER_REQUEST_MSG, message.value.toString(), new WalletTransferMoneyMessage(), handleTransferRequestMessage);
                matchMessage(BANK_TRANSFER_REQUEST_MSG, message.value.toString(), new BankPayoutMessage(), handleTransferRequestMessage);
                matchMessage(TRANSFER_COMPLETED_MSG, message.value.toString(), new TransferCompletedMessage(), handleTransferCompletedEvent);
            }
        }
    });
}

const handleTransferRequestMessage = async(message: TransferRequestMessage) => {
    TransferService.processTransferRequestMessage(message);
}

const handleTransferCompletedEvent = async(message: TransferCompletedMessage) => {
    console.log("TRANS_COMPLETED");
    TransferService.processTransferCompletedMessage(message);
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
    processWalletStateEvents();
    processTransferRequestMessage();
    app.listen(config.PORT);
});