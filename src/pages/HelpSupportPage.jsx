import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Clock, Mail, MessageCircle, Shield } from 'lucide-react'

const faqs = [
  {
    q: 'How do I cancel or change a booking?',
    a: 'Message the bike owner from your chat as soon as you can. They can confirm changes or release the slot for another rider.',
  },
  {
    q: 'What if the bike has a problem at pickup?',
    a: 'Do not start the ride. Contact the owner in-app and use Help below if you need a refund or swap.',
  },
  {
    q: 'How does Kalsada reporting work?',
    a: 'Submit hazards or infrastructure issues from the Kalsada screen. Other riders can upvote so the community sees what matters.',
  },
]

const quickLinks = [
  { to: '/activity', label: 'Trip history & receipts', icon: Clock },
  { to: '/kalsada', label: 'Kalsada & road reports', icon: Shield },
  { to: '/messages', label: 'My messages', icon: MessageCircle },
]

export function HelpSupportPage() {
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
          <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-2xl">Help &amp; Support</h1>
          <p className="mt-1 text-sm text-charcoal/55">
            Answers, shortcuts, and how to reach us
          </p>
        </div>
      </div>

      <a
        href="mailto:support@padyak.app?subject=Padyak%20support"
        className="mt-6 flex items-center gap-3 rounded-2xl bg-primary p-4 text-white shadow-lg shadow-primary/25 transition hover:bg-primary/95 active:scale-[0.99] lg:mt-8 lg:p-5"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <Mail className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-heading text-sm font-bold lg:text-base">Email support</span>
          <span className="mt-0.5 block text-xs text-white/85 lg:text-sm">support@padyak.app — we reply within 1–2 business days</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 opacity-90" strokeWidth={2} />
      </a>

      <div className="mt-6 lg:mt-8">
        <p className="text-xs font-bold uppercase tracking-wide text-charcoal/45">In the app</p>
        <ul className="mt-2 space-y-2">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-charcoal/10 transition hover:bg-surface hover:ring-charcoal/15 lg:px-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal/[0.06]">
                  <Icon className="h-5 w-5 text-charcoal/70" strokeWidth={2} />
                </span>
                <span className="flex-1 font-heading text-sm font-bold text-charcoal lg:text-base">{label}</span>
                <ChevronRight className="h-5 w-5 shrink-0 text-charcoal/35" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 lg:mt-10">
        <p className="text-xs font-bold uppercase tracking-wide text-charcoal/45">Common questions</p>
        <ul className="mt-3 space-y-3">
          {faqs.map((item) => (
            <li
              key={item.q}
              className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-charcoal/10 lg:px-5 lg:py-4"
            >
              <p className="font-heading text-sm font-bold text-charcoal lg:text-base">{item.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{item.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
