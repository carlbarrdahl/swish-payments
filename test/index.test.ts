import * as fs from "fs"
import SwishPayment from "../src/"

const serverIP = "213.132.115.94:443"
const swish = new SwishPayment({
  endpoint: "https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1",
  serverIP,
  cert: {
    pfx: fs.readFileSync(__dirname + "/../ssl/1231181189.p12"),
    passphrase: "swish"
  }
})

describe("Swish payment", () => {
  it("Swish is instantiable", () => {
    expect(swish).toBeInstanceOf(SwishPayment)
  })

  it("handles a payment requests", async () => {
    const token = await swish.paymentRequest({
      message: "",
      callbackUrl: "https://example.com/paymentrequests",
      amount: "100.00",
      currency: "SEK",
      payeeAlias: "1231181189",
      payerAlias: "46700123456"
    })

    expect(token).toBeDefined()

    const payment = await swish.getPayment(token)

    expect(payment.id).toBeDefined()
    expect(payment.status).toBe("CREATED")
  })

  it("handles Swish callback", () => {
    const mockPayment = {
      amount: "100.00",
      customer: "foo"
    }
    const mock = {
      callback: jest.fn(),
      req: { body: mockPayment, connection: { remoteAddress: serverIP } },
      res: { status: jest.fn() }
    }
    const hook = swish.createHook(mock.callback)

    hook(mock.req, mock.res)

    expect(mock.callback).toHaveBeenCalledWith(mockPayment)
    expect(mock.res.status).toHaveBeenCalledWith(201)
  })
})
