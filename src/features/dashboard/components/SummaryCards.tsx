type SummaryCard = {
  label: string
  value: number
  description: string
}

export function SummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    // -mx-8 membatalkan padding kiri-kanan DashboardPage (p-8) khusus untuk
    // baris ini, supaya border-b di bawah benar-benar mentok ke sidebar/tepi
    // layar — sama seperti garis di bawah header, bukan berhenti di batas
    // padding halaman seperti sebelumnya.
    <div className="-mx-8 grid grid-cols-2 border-b border-divider sm:grid-cols-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`py-[5px] text-center ${i === 0 ? 'pl-8 pr-6' : i === cards.length - 1 ? 'pl-6 pr-8' : 'px-6'} ${
            i > 0 ? 'border-l border-divider' : ''
          } ${i < 2 ? 'border-b border-divider sm:border-b-0' : ''}`}
        >
          <p className="eyebrow text-neutral-600">{card.label}</p>
          <p className="mt-1 text-screen font-extrabold text-text">{card.value}</p>
          <p className="mt-1 text-kicker text-neutral-600">{card.description}</p>
        </div>
      ))}
    </div>
  )
}
