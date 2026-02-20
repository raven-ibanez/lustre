export function Shipping() {
  return (
    <div id="shipping" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title mb-4">Shipping & Returns</h1>
        <p className="text-center text-muted-foreground mb-12">
          Everything you need to know about delivery and returns
        </p>

        {/* Shipping Info */}
        <div className="bg-white p-8 mb-8">
          <h2 className="font-serif text-xl mb-6">Shipping Information</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                We offer free nationwide shipping for all orders over ₱5,000.
                For orders below this amount, a flat shipping fee of ₱150 applies.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Delivery Time</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>&#10022; Metro Manila: 2-3 business days</li>
                <li>&#10022; Luzon: 3-5 business days</li>
                <li>&#10022; Visayas & Mindanao: 5-7 business days</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                All orders are processed within 1-2 business days. You will receive
                a tracking number via email once your order has been shipped.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">International Shipping</h3>
              <p className="text-sm text-muted-foreground">
                We currently ship to select international destinations. Please contact
                us at hello@lustrelab.com for international shipping rates and delivery times.
              </p>
            </div>
          </div>
        </div>

        {/* Returns Info */}
        <div className="bg-white p-8 mb-8">
          <h2 className="font-serif text-xl mb-6">Returns & Exchanges</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Return Policy</h3>
              <p className="text-sm text-muted-foreground">
                We accept returns within 14 days of delivery. Items must be unused,
                in their original packaging, and in the same condition as received.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">How to Return</h3>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>1. Contact us at hello@lustrelab.com to initiate a return</li>
                <li>2. Pack the item securely in its original packaging</li>
                <li>3. Include the original receipt or order confirmation</li>
                <li>4. Ship the item to our return address</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">Refunds</h3>
              <p className="text-sm text-muted-foreground">
                Refunds will be processed within 5-7 business days after we receive
                and inspect the returned item. The refund will be issued to the original
                payment method.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Non-Returnable Items</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>&#10022; Custom or personalized orders</li>
                <li>&#10022; Items showing signs of wear or damage</li>
                <li>&#10022; Gift cards</li>
                <li>&#10022; Sale items (unless defective)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-background border border-white/5 text-white p-8 text-center">
          <h2 className="font-serif text-xl mb-4">Need Help?</h2>
          <p className="text-sm text-white/80 mb-4">
            If you have any questions about shipping or returns, please don't hesitate to contact us.
          </p>
          <a href="#contact" className="inline-block border border-white text-white px-6 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-primary-dark transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
