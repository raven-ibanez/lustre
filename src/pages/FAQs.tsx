import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What materials do you use?',
    answer: 'We use high-quality 18k gold vermeil, ethically sourced gemstones, and premium moissanite stones. All our materials are carefully selected for their beauty and durability.',
  },
  {
    question: 'How do I find my ring size?',
    answer: 'You can use our Ring Size Guide which provides detailed instructions on measuring your finger. We also offer complimentary ring sizers that can be sent to your address.',
  },
  {
    question: 'Do you offer custom designs?',
    answer: 'Yes! We specialize in custom jewelry design. Contact us with your vision and our master craftsmen will work with you to create a one-of-a-kind piece.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 14 days of delivery for unused items in their original packaging. Custom and personalized items cannot be returned unless defective.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Metro Manila: 2-3 business days, Luzon: 3-5 business days, Visayas & Mindanao: 5-7 business days. Free shipping for orders over ₱5,000.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'We currently ship to select international destinations. Please contact us at hello@lustrelab.com for international shipping rates and information.',
  },
  {
    question: 'How should I care for my jewelry?',
    answer: 'Store your jewelry in a cool, dry place, clean regularly with mild soap and water, and avoid exposure to harsh chemicals. Visit our Jewelry Care page for detailed instructions.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash on Delivery, GCash, and Bank Transfer. All transactions are secure and encrypted.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes! Once your order is shipped, you will receive an email with a tracking number that you can use to monitor your delivery.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, all orders come in our signature Lustre Lab packaging, perfect for gifting. We also offer gift cards in various denominations.',
  },
];

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div id="faqs" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title mb-4">Frequently Asked Questions</h1>
        <p className="text-center text-muted-foreground mb-12">
          Find answers to common questions about our products and services
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <a href="#contact" className="btn-secondary">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
