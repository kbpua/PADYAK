/** Default payment options (bookings + profile). IDs match AppContext `paymentMethod`. */
export const paymentMethodOptions = [
  { id: 'gcash', label: 'GCash', sub: 'Pay in-app' },
  { id: 'card', label: 'Debit / Credit', sub: 'Visa, Mastercard' },
  { id: 'wallet', label: 'Padyak Wallet', sub: 'Balance: ₱240' },
  { id: 'cash', label: 'Cash on pickup', sub: 'Pay the owner' },
]
