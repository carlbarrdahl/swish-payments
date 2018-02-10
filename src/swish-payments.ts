import fs from "fs"
import fetch from "node-fetch"
import https, { AgentOptions } from "https"

import { Request, Response, RequestHandler } from "express"
import { ServerResponse } from "http"

const SWISH_ENDPOINT = "https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1"
const SWISH_PAYMENT_IP = process.env.NODE_ENV === "production" ? "194.242.111.220:443" : ""

import { PaymentRequestType, PaymentResponseType, RefundRequestType } from "./types"

export default class SwishPayments {
  constructor(private cert: AgentOptions) {}
  /**
   * Get payment from payment request token
   *
   * @param  {string} token
   * @returns PaymentResponseType
   */
  getPayment(token: string): Promise<PaymentResponseType> {
    return fetch(`${SWISH_ENDPOINT}/paymentrequests/${token}`, {
      agent: new https.Agent(this.cert)
    })
      .then(res => res.json())
      .catch(handleError)
  }
  /**
   * Request a payment and return a token. This token is used to launch Swish from the client
   *
   * @param  {PaymentRequestType} data
   * @returns Promise
   */
  paymentRequest(data: PaymentRequestType): Promise<string> {
    return fetch(`${SWISH_ENDPOINT}/paymentrequests`, {
      agent: new https.Agent(this.cert),
      method: "POST",
      body: JSON.stringify({ ...data, currency: "SEK" }),
      headers: { "Content-Type": "application/json" }
    })
      .then(handleToken)
      .catch(handleError)
  }
  /**
   * Request a refund
   *
   * @param  {RefundRequestType} data
   * @returns Promise
   */
  refundRequest(data: RefundRequestType): Promise<any | Error> {
    return fetch(`${SWISH_ENDPOINT}/paymentrequests`, {
      agent: new https.Agent(this.cert),
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }).catch(handleError)
  }
  /**
   * Create a function Swish will call as callbackUrl on payment and refund requests
   *
   * @param  {Function} callback
   */
  createHook(callback: Function) {
    return (req: Request, res: Response): ServerResponse => {
      const ip = (req.connection && req.connection.remoteAddress) || ""

      if (!ip.includes(SWISH_PAYMENT_IP)) {
        return res.status(401).send("not authorized")
      }

      callback(req.body)
      return res.status(201)
    }
  }
}

function handleToken(res: any) {
  if (res.status === 201) {
    return res.headers.get("location").split("paymentrequests/")[1]
  }

  throw new Error(res.statusText)
}

function handleError(err: Error) {
  console.log("handleError", err)
  return err
}
