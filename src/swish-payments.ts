import fs from "fs"
import fetch from "node-fetch"
import https, { AgentOptions } from "https"

import { Request, Response } from "express"
import { ServerResponse } from "http"
import { ErrorRequestHandler } from "express-serve-static-core"

const SWISH_ENDPOINT = "https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1"
const SWISH_PAYMENT_IP = process.env.NODE_ENV === "production" ? "194.242.111.220:443" : ""

export type PaymentRequestType = {
  payeePaymentReference?: string
  callbackUrl: string
  payerAlias?: string
  payeeAlias: string
  amount: string
  currency?: string | "SEK"
  message?: string
}

export default class SwishPayments {
  constructor(private cert: AgentOptions) {}
  getPayment(token: string) {
    return fetch(`${SWISH_ENDPOINT}/paymentrequests/${token}`, {
      agent: new https.Agent(this.cert)
    })
      .then((res: any) => res.json())
      .catch(handleError)
  }
  paymentRequest(data: PaymentRequestType) {
    return fetch(`${SWISH_ENDPOINT}/paymentrequests`, {
      agent: new https.Agent(this.cert),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(handleToken)
      .catch(handleError)
  }

  createHook(onPayment: Function) {
    return (req: Request, res: Response): ServerResponse => {
      const ip = (req.connection && req.connection.remoteAddress) || ""

      if (!ip.includes(SWISH_PAYMENT_IP)) {
        return res.status(401).send("not authorized")
      }

      onPayment(req.body)
      return res.status(201)
    }
  }
}

function handleToken(res: any) {
  try {
    return res.headers.get("location").split("paymentrequests/")[1]
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

function handleError(err: Error) {
  console.log(err)
  return err
}
