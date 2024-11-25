export type TransactionType = {
  vendor?: string
  vendor_logo: string
  creditor?: string
  amount: number
  date: Date
  id: string
  is_debit?: boolean
  is_credit?: boolean
}
