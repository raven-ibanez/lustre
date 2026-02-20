const ringSizeGuide = [
  { size: 4, diameter: 14.9, circumference: 46.8 },
  { size: 5, diameter: 15.7, circumference: 49.3 },
  { size: 6, diameter: 16.5, circumference: 51.8 },
  { size: 7, diameter: 17.3, circumference: 54.4 },
  { size: 8, diameter: 18.1, circumference: 56.9 },
  { size: 9, diameter: 18.9, circumference: 59.4 },
  { size: 10, diameter: 19.7, circumference: 61.9 },
  { size: 11, diameter: 20.5, circumference: 64.4 },
  { size: 12, diameter: 21.3, circumference: 66.9 },
];

export function RingSizeGuide() {
  return (
    <div id="ring-size-guide" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title mb-4">Ring Size Guide</h1>
        <p className="text-center text-muted-foreground mb-12">
          Find your perfect fit with our comprehensive ring size guide
        </p>

        {/* Size Chart */}
        <div className="bg-white p-8 mb-12">
          <h2 className="font-serif text-xl mb-6">Standard Ring Sizes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Size</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Diameter (mm)</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody>
                {ringSizeGuide.map((size) => (
                  <tr key={size.size} className="border-b border-gray-100 hover:bg-white/5">
                    <td className="py-3 px-4">{size.size}</td>
                    <td className="py-3 px-4">{size.diameter}</td>
                    <td className="py-3 px-4">{size.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8">
            <h2 className="font-serif text-xl mb-4">Method 1: String or Paper</h2>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-medium">1.</span>
                <span>Wrap a piece of string or paper around the base of your finger</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">2.</span>
                <span>Mark where the string or paper overlaps</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">3.</span>
                <span>Measure the length in millimeters</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">4.</span>
                <span>Match the circumference to our size chart</span>
              </li>
            </ol>
          </div>

          <div className="bg-white p-8">
            <h2 className="font-serif text-xl mb-4">Method 2: Existing Ring</h2>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-medium">1.</span>
                <span>Find a ring that fits the finger you want to measure</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">2.</span>
                <span>Measure the inside diameter in millimeters</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">3.</span>
                <span>Match the diameter to our size chart</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium">4.</span>
                <span>When in doubt, size up for comfort</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-primary-dark/50 border border-gold/20 p-8 mt-8">
          <h2 className="font-serif text-xl mb-4 text-gold">Helpful Tips</h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li><span className="text-gold">&#10022;</span> Measure your finger at the end of the day when it's at its largest</li>
            <li><span className="text-gold">&#10022;</span> Avoid measuring when your hands are cold, as fingers shrink</li>
            <li><span className="text-gold">&#10022;</span> If you're between sizes, we recommend sizing up</li>
            <li><span className="text-gold">&#10022;</span> Wide bands fit more snugly, consider sizing up by half a size</li>
            <li><span className="text-gold">&#10022;</span> Contact us for a complimentary ring sizer sent to your address</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
