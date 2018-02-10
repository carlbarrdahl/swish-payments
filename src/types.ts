export type PaymentResponseType = {
  id: string
  paymentReference: string
  callbackUrl: string
  payerAlias?: string
  payeeAlias: string
  amount: string
  currency: string
  message: string
  status: string
  dateCreated: string
  datePaid?: string
  errorCode?: string
  errorMessage?: string
  additionalInformation?: string
}

export type PaymentRequestType = {
  payeePaymentReference?: string
  callbackUrl: string
  payerAlias?: string
  payeeAlias: string
  amount: string
  currency?: string
  message?: string
}

export type RefundRequestType = {
  payerPaymentReference?: string
  originalPaymentReference: string
  paymentReference?: string
  callbackUrl: string
  payerAlias?: string
}
