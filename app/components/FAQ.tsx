'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'Can foreigners buy property in Sri Lanka?',
    answer:
      'Foreign nationals can generally purchase apartments/condominium units on or above the 4th floor freehold, and can lease land (including for houses and land parcels) for up to 99 years. Direct freehold purchase of land by foreigners is restricted under current regulations. We recommend confirming the latest rules with a local lawyer before proceeding — regulations can change.',
  },
  {
    question: 'What documents do I need to buy a property?',
    answer:
      'Typically you will need a valid passport or National Identity Card, proof of funds, and — for foreign buyers — any required exchange control approvals. Our agents can walk you through the exact document checklist for your specific property type.',
  },
  {
    question: 'How does the payment process work?',
    answer:
      'Most sales proceed through a signed Agreement to Sell, followed by a deposit, then final payment and transfer of title at a licensed notary. For rentals, a security deposit plus advance rent is standard, agreed directly with the property owner or agent.',
  },
  {
    question: 'Are the listed prices negotiable?',
    answer:
      'Many listed prices are open to reasonable negotiation, particularly for land and older buildings. Use the "Message Agent" button on any listing to start a conversation directly with the seller or their representative.',
  },
  {
    question: 'What is included in the price shown?',
    answer:
      'Unless a listing states otherwise, the displayed price covers the property itself only — it does not include stamp duty, legal fees, notary fees, or any applicable taxes. Toggle currencies in the top navigation to see an approximate converted price; final transactions are settled in LKR.',
  },
  {
    question: 'How accurate are the land and building sizes shown?',
    answer:
      'Sizes are provided by the listing owner or agent and are shown in square meters by default (switchable to square feet or perches). We recommend an independent survey before finalizing any land purchase, as boundary and size discrepancies are common in older deeds.',
  },
  {
    question: "Can I visit a property before deciding?",
    answer:
      'Yes — use "View on Map" to see the exact location, or contact the listing agent via WhatsApp to arrange an in-person or virtual viewing.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
        <i className="fa-solid fa-circle-question" style={{ marginRight: '8px', color: '#6b7280' }}></i>
        Frequently Asked Questions
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {item.question}
                <i
                  className="fa-solid fa-chevron-down"
                  style={{
                    fontSize: '12px',
                    color: '#dc2626',
                    flexShrink: 0,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                ></i>
              </button>

              {isOpen && (
                <div style={{ padding: '0 20px 18px', fontSize: '13px', lineHeight: 1.6, color: '#4b5563' }}>
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}