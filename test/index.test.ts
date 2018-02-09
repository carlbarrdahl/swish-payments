import fs from "fs"
import SwishPayment from "../src/swish-payments"
import { request } from "http"

const swish = new SwishPayment({
  pfx: fs.readFileSync(__dirname + "/../ssl/1231181189.p12"),
  passphrase: "swish"
})
describe("Swish payment", () => {
  it("Swish is instantiable", () => {
    expect(swish).toBeInstanceOf(SwishPayment)
  })

  it("handles a payment requests", async () => {
    const token = await swish.paymentRequest({
      message: "foo",
      callbackUrl: "https://example.com/hooks/payments",
      amount: "100.00",
      payeeAlias: "1231181189",
      payerAlias: "46700123457"
    })
    expect(token).toBeDefined()

    const payment = await swish.getPayment(token)
    expect(payment).toBeDefined()
  })

  it("handles Swish callback", () => {
    const mockPayment = {
      amount: "100.00",
      customer: "foo"
    }
    const mock = {
      callback: jest.fn(),
      req: { body: mockPayment, connection: { remoteAddress: "194.242.111.220:443" } },
      res: { status: jest.fn() }
    }
    const hook = swish.createHook(mock.callback)
    hook(mock.req, mock.res)

    expect(mock.callback).toHaveBeenCalledWith(mockPayment)
    expect(mock.res.status).toHaveBeenCalled()
  })
})
