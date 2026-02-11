import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const denominations = [
  { value: 1000, label: '₱1,000' },
  { value: 3000, label: '₱3,000' },
  { value: 5000, label: '₱5,000' },
  { value: 10000, label: '₱10,000' },
];

export function GiftVoucher() {
  const [selectedDenomination, setSelectedDenomination] = useState(3000);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="animate-slide-right">
            <img
              src="/images/gift-voucher.jpg"
              alt="Lustre Lab Gift Card"
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div className="animate-slide-left">
            <h2 className="font-serif text-3xl mb-2">The Perfect Gift</h2>
            <h3 className="text-lg text-muted-foreground mb-6">Lustre Lab Gift Card</h3>
            
            <p className="text-2xl font-medium mb-8">
              ₱{formatPrice(selectedDenomination)}
            </p>

            <p className="text-sm text-muted-foreground mb-6">
              Give the gift of choice with a Lustre Lab gift card. Perfect for birthdays, 
              anniversaries, or any special occasion. Our gift cards never expire and can 
              be used on any item in our collection.
            </p>

            {/* Denominations */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider mb-3">Select Amount:</p>
              <div className="flex flex-wrap gap-3">
                {denominations.map((denom) => (
                  <button
                    key={denom.value}
                    onClick={() => setSelectedDenomination(denom.value)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      selectedDenomination === denom.value
                        ? 'border-forest bg-forest text-white'
                        : 'border-gray-300 hover:border-forest'
                    }`}
                  >
                    {denom.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wider mb-3">Quantity:</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-forest transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-forest transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="btn-primary w-full">
              Add to Cart - ₱{formatPrice(selectedDenomination * quantity)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
