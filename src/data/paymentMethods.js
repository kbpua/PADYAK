/** Default payment options (bookings + profile). IDs match AppContext `paymentMethod`. */
export const paymentMethodOptions = [
  { id: 'gcash', label: 'GCash', sub: 'Pay in-app' },
  { id: 'card', label: 'Debit / Credit', sub: 'Visa, Mastercard' },
  { id: 'wallet', label: 'Padyak Wallet', sub: 'Balance: ₱240' },
  { id: 'cash', label: 'Cash on pickup', sub: 'Pay the owner' },
]

/** Human-readable line for ride receipts (snapshot at payment time). */
export function receiptPaymentLabel(methodId) {
  const id = methodId == null || methodId === '' ? 'gcash' : String(methodId)
  if (id === 'gcash') return 'GCash'
  if (id === 'card') return 'Visa · ···· 4242'
  if (id === 'wallet') return 'Padyak Wallet'
  if (id === 'cash') return 'Cash on pickup'
  return paymentMethodOptions.find((o) => o.id === id)?.label ?? id
}
