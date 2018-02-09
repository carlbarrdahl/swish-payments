# Swish Payments Library

The Swish Payments library provides convenient access to Swish API from server-side applications.

## Documentation

## Installation

Install the package with:

    npm install swish-payments --save

## Usage

The package needs to be configured with your Swish certificate and passphrase.

```js
import Swish from "swish-payments"

const swish = new Swish({
  pfx: __dirname + "/ssl/1231181189.p12",
  passphrase: "swish"
})

// Setup payment request webook
app.post("/paymentrequests", swish.createHook(payment =>
  console.log("incoming payment :", payment)
))

const token = await swish.paymentRequest({
  callbackUrl: "https://example.com/hooks/payments/",
  payerAlias: "46700123456",
  payeeAlias: "1231181189",
  amount: "100.00",
  message: "message",
})
// 900D843722644C149995AC246E14D8C6

const payment = await swish.getPayment(token)
/*
{ errorCode: null,
  errorMessage: null,
  id: 'D59CD1A48F764B88BE852F4B8ED944B3',
  payeePaymentReference: null,
  paymentReference: null,
  callbackUrl: 'https://example.com/hooks/payments/',
  payerAlias: '46700123456',
  payeeAlias: '1231181189',
  amount: 100,
  currency: 'SEK',
  message: 'message',
  status: 'CREATED',
  dateCreated: '2018-02-09T16:49:40.201Z',
  datePaid: null }
*/
```
