/// <reference types="node" />
/// <reference types="express" />
import { AgentOptions } from "https";
import { RequestHandler } from "express";
export interface PaymentBase {
    amount: string;
    currency: string;
    callbackUrl: string;
    payerAlias?: string;
    payeeAlias: string;
    message: string;
}
export interface PaymentRequest extends PaymentBase {
    payeePaymentReference?: string;
}
export interface PaymentResponse extends PaymentBase {
    id: string;
    paymentReference: string;
    status: string;
    dateCreated: string;
    datePaid?: string;
    errorCode?: string;
    errorMessage?: string;
    additionalInformation?: string;
}
export interface RefundRequest {
    payerPaymentReference?: string;
    originalPaymentReference: string;
    paymentReference?: string;
    callbackUrl: string;
    payerAlias?: string;
}
export default class SwishPayments {
    private cert;
    constructor(cert: AgentOptions);
    /**
     * Get payment from payment request token
     *
     * @param  {string} token
     * @returns PaymentResponseType
     */
    getPayment(token: string): Promise<PaymentResponse>;
    /**
     * Request a payment and return a token. This token is used to launch Swish from the client
     *
     * @param  {PaymentRequestType} data
     * @returns Promise
     */
    paymentRequest(data: PaymentRequest): Promise<string>;
    /**
     * Request a refund
     *
     * @param  {RefundRequestType} data
     * @returns Promise
     */
    refundRequest(data: RefundRequest): Promise<any | Error>;
    /**
     * Create a function Swish will call as callbackUrl on payment and refund requests
     *
     * @param  {Function} callback
     */
    createHook(callback: Function): RequestHandler;
}
