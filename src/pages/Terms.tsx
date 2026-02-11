export function Terms() {
  return (
    <div id="terms" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title mb-4">Terms & Conditions</h1>
        <p className="text-center text-muted-foreground mb-12">
          Please read these terms carefully before using our services
        </p>

        <div className="bg-white p-8 space-y-8">
          <section>
            <h2 className="font-serif text-lg mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground">
              By accessing and using the Lustre Lab website, you agree to be bound by these 
              Terms and Conditions. If you do not agree with any part of these terms, 
              please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">2. Products and Pricing</h2>
            <p className="text-sm text-muted-foreground">
              All products are subject to availability. We reserve the right to discontinue 
              any product at any time. Prices are subject to change without notice. 
              All prices are in Philippine Peso (₱) and include applicable taxes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">3. Orders and Payment</h2>
            <p className="text-sm text-muted-foreground">
              By placing an order, you agree to provide accurate and complete information. 
              We accept various payment methods including Cash on Delivery, GCash, and Bank Transfer. 
              Orders are confirmed only after payment is received or verified.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">4. Shipping and Delivery</h2>
            <p className="text-sm text-muted-foreground">
              We strive to deliver orders within the estimated timeframes. However, 
              delivery times are estimates and not guaranteed. We are not responsible 
              for delays caused by circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">5. Returns and Refunds</h2>
            <p className="text-sm text-muted-foreground">
              Returns are accepted within 14 days of delivery for eligible items. 
              Custom and personalized items cannot be returned unless defective. 
              Refunds will be processed to the original payment method within 5-7 business days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">6. Intellectual Property</h2>
            <p className="text-sm text-muted-foreground">
              All content on this website, including images, text, and designs, is the 
              property of Lustre Lab and protected by copyright laws. Unauthorized use 
              of any content is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">7. Privacy Policy</h2>
            <p className="text-sm text-muted-foreground">
              We respect your privacy and are committed to protecting your personal information. 
              Please refer to our Privacy Policy for details on how we collect, use, and 
              safeguard your data.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">8. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground">
              Lustre Lab shall not be liable for any indirect, incidental, or consequential 
              damages arising from the use of our products or services. Our liability is 
              limited to the purchase price of the product.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">9. Governing Law</h2>
            <p className="text-sm text-muted-foreground">
              These terms are governed by the laws of the Philippines. Any disputes shall 
              be resolved in the courts of Makati City, Philippines.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg mb-3">10. Changes to Terms</h2>
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes will be 
              effective immediately upon posting on the website. Continued use of our 
              services constitutes acceptance of the updated terms.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              If you have any questions about these terms, please contact us at{' '}
              <a href="mailto:hello@lustrelab.com" className="text-forest underline">
                hello@lustrelab.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
