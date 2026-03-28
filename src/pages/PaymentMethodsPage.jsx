import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { paymentMethodOptions } from '../data/paymentMethods'

export function PaymentMethodsPage() {
  const { paymentMethod, setPaymentMethod } = useApp()

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-4 lg:max-w-2xl lg:px-0 lg:pb-12 lg:pt-6">
      <div className="flex items-start gap-2">
        <Link
          to="/profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal transition hover:bg-charcoal/10 active:scale-95 lg:h-11 lg:w-11"
          aria-label="Back to profile"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>
        <div className="min-w-0 flex-1 pt-0.5">
          <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-2xl">Payment methods</h1>
          <p className="mt-1 text-sm text-charcoal/55">
            Your default choice for new bookings. You can still review it at checkout.
          </p>
        </div>
      </div>

      <div className="mt-6 lg:mt-8">
        <p className="text-xs font-bold uppercase tracking-wide text-charcoal/45">Default method</p>
        <div className="mt-2 space-y-2">
          {paymentMethodOptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPaymentMethod(p.id)}
              className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition active:scale-[0.99] lg:px-5 lg:py-4 ${
                paymentMethod === p.id
                  ? 'border-primary bg-primary/5'
                  : 'border-charcoal/10 bg-white shadow-sm ring-1 ring-charcoal/5'
              }`}
            >
              <div>
                <p className="font-heading text-sm font-bold text-charcoal lg:text-base">{p.label}</p>
                <p className="text-xs text-charcoal/50 lg:text-sm">{p.sub}</p>
              </div>
              <span
                className={`h-5 w-5 shrink-0 rounded-full border-2 lg:h-6 lg:w-6 ${
                  paymentMethod === p.id ? 'border-primary bg-primary' : 'border-charcoal/20'
                }`}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
