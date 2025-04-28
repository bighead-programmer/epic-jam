import axios from "axios"

interface EcocashPaymentParams {
  amount: number
  phoneNumber: string
  reference: string
}

export const ecocashService = {
  async processPayment({ amount, phoneNumber, reference }: EcocashPaymentParams) {
    try {
      // In production, this would be a real API call to EcoCash
      const response = await axios.post(
        process.env.ECOCASH_API_URL || "https://api.ecocash.co.zw/sandbox/payments",
        {
          amount,
          phoneNumber,
          reference,
          merchantId: process.env.ECOCASH_MERCHANT_ID,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ECOCASH_API_KEY}`,
          },
        }
      )

      // Check if the payment was successful
      if (!response.data.success) {
        throw new Error(response.data.message || "EcoCash payment failed")
      }

      return {
        success: true,
        externalId: response.data.transactionId || `ECO-${Date.now()}`,
        reference: reference,
      }
    } catch (error) {
      console.error("EcoCash payment error:", error)
      throw new Error("Failed to process EcoCash payment")
    }
  },

  async processWithdrawal({ amount, phoneNumber, reference }: EcocashPaymentParams) {
    try {
      // In production, this would be a real API call to EcoCash
      const response = await axios.post(
        process.env.ECOCASH_API_URL || "https://api.ecocash.co.zw/sandbox/withdrawals",
        {
          amount,
          phoneNumber,
          reference,
          merchantId: process.env.ECOCASH_MERCHANT_ID,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ECOCASH_API_KEY}`,
          },
        }
      )

      // Check if the withdrawal was successful
      if (!response.data.success) {
        throw new Error(response.data.message || "EcoCash withdrawal failed")
      }

      return {
        success: true,
        externalId: response.data.transactionId || `ECO-WD-${Date.now()}`,
        reference: reference,
      }
    } catch (error) {
      console.error("EcoCash withdrawal error:", error)
      throw new Error("Failed to process EcoCash withdrawal")
    }
  },

  async checkPaymentStatus(externalId: string) {
    try {
      // In production, this would be a real API call to EcoCash
      const response = await axios.get(
        `${process.env.ECOCASH_API_URL || "https://api.ecocash.co.zw/sandbox"}/payments/${externalId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ECOCASH_API_KEY}`,
          },
        }
      )

      return {
        status: response.data.status || "COMPLETED",
        externalId,
      }
    } catch (error) {
      console.error("EcoCash status check error:", error)
      throw new Error("Failed to check EcoCash payment status")
    }
  },
}
