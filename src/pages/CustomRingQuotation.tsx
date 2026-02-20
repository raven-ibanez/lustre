import { useState, useRef } from 'react';
import { Sparkles, Upload, ChevronRight, ChevronLeft, CheckCircle2, Instagram } from 'lucide-react';

type Section = 1 | 2 | 3 | 4 | 5;

export function CustomRingQuotation() {
    const [step, setStep] = useState<Section>(1);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        // Section 1: Your Vision
        creationType: '',
        aestheticPreference: '',

        // Section 2: Center Stone
        stoneType: '',
        otherStone: '',
        shape: '',
        caratWeight: '',
        otherCarat: '',
        colorPreference: '',
        clarityPreference: '',
        sideStones: '',
        certification: '',

        // Section 3: Ring Setting & Metal
        settingStyle: '',
        metal: '',
        bandThickness: '',
        bandStyle: '',
        ringSize: '',

        // Section 4: Budget & Timeline
        budgetRange: '',
        timeline: '',

        // Section 5: Final Details
        engraving: '',
        fullName: '',
        phoneNumber: '',
        email: '',
        preferredComm: '',
        inspirationFiles: [] as File[],
    });

    const handleNext = () => {
        // Basic validation before moving to next step
        if (step === 1 && (!formData.creationType || !formData.aestheticPreference)) {
            alert('Please fill in all fields in this section.');
            return;
        }

        // Logic: Skip Section 2 if "Plain band" or "Eternity ring" is selected
        if (step === 1 && (formData.creationType === 'Plain band (no stones)' || formData.creationType === 'Eternity ring (no center stone)')) {
            setStep(3);
        } else {
            setStep((prev) => (prev + 1) as Section);
        }
    };

    const handleBack = () => {
        // Logic: Skip Section 2 back to 1 if coming from 3 and Section 1 choice warrants it
        if (step === 3 && (formData.creationType === 'Plain band (no stones)' || formData.creationType === 'Eternity ring (no center stone)')) {
            setStep(1);
        } else {
            setStep((prev) => (prev - 1) as Section);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({ ...formData, inspirationFiles: Array.from(e.target.files) });
        }
    };

    const renderProgress = () => {
        return (
            <div className="flex justify-between items-center mb-12 max-w-md mx-auto">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${step >= s ? 'bg-gold text-primary-dark border-gold' : 'text-muted-foreground border-white/20'
                            }`}>
                            {s}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (submitted) {
        return (
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen flex items-center justify-center text-center">
                <div className="max-w-md bg-card p-12 shadow-2xl border border-white/5 animate-fade-in">
                    <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
                    <h2 className="font-serif text-3xl mb-4 text-gold italic">Thank You for Designing with Lustre Lab!</h2>
                    <p className="text-muted-foreground mb-8">
                        Your personalized quotation will be sent to your email. We're excited to help bring your vision to life.
                    </p>
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">For urgent requests, contact us via:</p>
                        <a
                            href="https://instagram.com/lustrelab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
                        >
                            <Instagram className="w-5 h-5" />
                            <span className="text-sm font-medium tracking-widest">@lustrelab</span>
                        </a>
                    </div>
                    <button
                        onClick={() => window.location.hash = 'home'}
                        className="mt-12 btn-primary w-full"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-gold mb-4">
                        <Sparkles className="w-5 h-5" />
                        <span className="uppercase tracking-[0.2em] text-xs font-medium">Custom Experience</span>
                    </div>
                    <h1 className="font-serif text-4xl mb-4 italic">Custom Ring Quotation</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Thank you for choosing Lustre Lab. Please answer the following to receive your personalized quotation.
                    </p>
                </div>

                {renderProgress()}

                <form onSubmit={handleSubmit} className="bg-card p-8 sm:p-12 shadow-2xl border border-white/5 space-y-12">
                    {/* Section 1: Your Vision */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h3 className="section-subtitle mb-8">✨ Section 1: Your Vision</h3>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">What are you creating?</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Engagement ring', 'Wedding band', 'Anniversary ring', 'Eternity ring (no center stone)', 'Plain band (no stones)'].map((option) => (
                                            <label key={option} className={`
                        cursor-pointer border p-4 text-sm transition-all flex items-center gap-3
                        ${formData.creationType === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="creationType"
                                                    value={option}
                                                    checked={formData.creationType === option}
                                                    onChange={(e) => setFormData({ ...formData, creationType: e.target.value })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${formData.creationType === option ? 'bg-gold border-gold' : 'border-white/20'}`} />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">What overall aesthetic do you prefer?</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Minimal & timeless', 'Soft & romantic', 'Bold statement', 'Vintage luxury', 'Modern elegance'].map((option) => (
                                            <label key={option} className={`
                        cursor-pointer border p-4 text-sm transition-all flex items-center gap-3
                        ${formData.aestheticPreference === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="aestheticPreference"
                                                    value={option}
                                                    checked={formData.aestheticPreference === option}
                                                    onChange={(e) => setFormData({ ...formData, aestheticPreference: e.target.value })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${formData.aestheticPreference === option ? 'bg-gold border-gold' : 'border-white/20'}`} />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Center Stone */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h3 className="section-subtitle mb-8">💎 Section 2: Center Stone</h3>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Which stone would you like?</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Lab-grown diamond', 'Moissanite', 'Lab-grown sapphire', 'Lab-grown emerald', 'Other gemstone (please specify)'].map((option) => (
                                            <label key={option} className={`
                        cursor-pointer border p-4 text-sm transition-all flex items-center gap-3
                        ${formData.stoneType === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="stoneType"
                                                    value={option}
                                                    checked={formData.stoneType === option}
                                                    onChange={(e) => setFormData({ ...formData, stoneType: e.target.value })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${formData.stoneType === option ? 'bg-gold border-gold' : 'border-white/20'}`} />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                    {formData.stoneType === 'Other gemstone (please specify)' && (
                                        <input
                                            type="text"
                                            placeholder="Specify gemstone..."
                                            className="mt-3 w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm"
                                            value={formData.otherStone}
                                            onChange={(e) => setFormData({ ...formData, otherStone: e.target.value })}
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Preferred shape</label>
                                        <select
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm bg-transparent"
                                            value={formData.shape}
                                            onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                                        >
                                            <option value="">Select shape</option>
                                            {['Round', 'Oval', 'Emerald', 'Cushion', 'Radiant', 'Princess', 'Pear', 'Marquise', 'Asscher'].map(shape => (
                                                <option key={shape} value={shape}>{shape}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Desired carat weight</label>
                                        <select
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm bg-transparent"
                                            value={formData.caratWeight}
                                            onChange={(e) => setFormData({ ...formData, caratWeight: e.target.value })}
                                        >
                                            <option value="">Select carat weight</option>
                                            {['0.30 – 0.50 ct', '0.50 – 0.75 ct', '1.00 – 1.50 ct', '2.00 – 2.90 ct', '3.00 – 3.90 ct', '4.00 – 4.90 ct', '5.00 – 5.90 ct', '6.00 – 6.90 ct', '7.00 – 7.90 ct', 'Other (please specify)'].map(ct => (
                                                <option key={ct} value={ct}>{ct}</option>
                                            ))}
                                        </select>
                                        {formData.caratWeight === 'Other (please specify)' && (
                                            <input
                                                type="text"
                                                placeholder="Specify carat weight..."
                                                className="mt-2 w-full border-b border-white/20 py-1 focus:border-gold outline-none text-sm"
                                                value={formData.otherCarat}
                                                onChange={(e) => setFormData({ ...formData, otherCarat: e.target.value })}
                                            />
                                        )}
                                    </div>
                                </div>

                                {(formData.stoneType === 'Lab-grown diamond' || formData.stoneType === 'Moissanite') && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Color preference</label>
                                            <select
                                                className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm bg-transparent"
                                                value={formData.colorPreference}
                                                onChange={(e) => setFormData({ ...formData, colorPreference: e.target.value })}
                                            >
                                                <option value="">Select color</option>
                                                {['Colorless (D–F)', 'Near colorless (G–H)', 'Warm (I–J)', 'Fancy Pink', 'Fancy Yellow', 'Fancy Green', 'Fancy Blue'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Clarity preference</label>
                                            <select
                                                className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm bg-transparent"
                                                value={formData.clarityPreference}
                                                onChange={(e) => setFormData({ ...formData, clarityPreference: e.target.value })}
                                            >
                                                <option value="">Select clarity</option>
                                                {['VVS (ultra high clarity)', 'VS (eye-clean standard)', 'SI (budget-conscious)'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Would you like side stones?</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {['No', 'Small accent diamonds', 'Halo', 'Side baguettes', 'Three-stone design'].map((option) => (
                                            <label key={option} className={`
                        cursor-pointer border p-3 text-sm transition-all text-center
                        ${formData.sideStones === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="sideStones"
                                                    value={option}
                                                    checked={formData.sideStones === option}
                                                    onChange={(e) => setFormData({ ...formData, sideStones: e.target.value })}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {formData.stoneType === 'Lab-grown diamond' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">📜 Certification Preference</label>
                                        <p className="text-xs text-muted-foreground mb-4">Would you like your lab diamond to be IGI certified?</p>
                                        <div className="space-y-2">
                                            {[
                                                { label: 'Yes, IGI certification is important to me', value: 'Yes' },
                                                { label: 'No, certification is not necessary', value: 'No' }
                                            ].map((opt) => (
                                                <label key={opt.value} className={`
                          cursor-pointer border p-4 text-sm transition-all flex items-center gap-3
                          ${formData.certification === opt.value ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                        `}>
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="certification"
                                                        value={opt.value}
                                                        checked={formData.certification === opt.value}
                                                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                                                    />
                                                    <div className={`w-3 h-3 rounded-full border ${formData.certification === opt.value ? 'bg-gold border-gold' : 'border-white/20'}`} />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Section 3: Ring Setting & Metal */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h3 className="section-subtitle mb-8">✨ Section 3: Ring Setting & Metal</h3>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Setting style</label>
                                        <select
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm bg-transparent"
                                            value={formData.settingStyle}
                                            onChange={(e) => setFormData({ ...formData, settingStyle: e.target.value })}
                                        >
                                            <option value="">Select style</option>
                                            {['Solitaire', 'Hidden halo', 'Halo', 'Three-stone', 'Bezel', 'Pavé band', 'Cathedral', 'Cathedral with Tulip Prongs', 'Basket', 'Open bezel', 'Traditional prongs'].map(style => (
                                                <option key={style} value={style}>{style}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Preferred metal</label>
                                        <select
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm bg-transparent"
                                            value={formData.metal}
                                            onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                                        >
                                            <option value="">Select metal</option>
                                            {['10k White Gold', '10k Yellow Gold', '14k White Gold', '18k White Gold', '14k Yellow Gold', '18k Yellow Gold', 'Rose Gold', 'Silver'].map(metal => (
                                                <option key={metal} value={metal}>{metal}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Band thickness</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Thin (1.5–1.8mm)', 'Medium (2.0–2.3mm)', 'Thick (2.5mm+)'].map(option => (
                                                <label key={option} className={`
                          cursor-pointer border p-2 text-[10px] text-center transition-all leading-tight flex items-center justify-center
                          ${formData.bandThickness === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                        `}>
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="bandThickness"
                                                        value={option}
                                                        checked={formData.bandThickness === option}
                                                        onChange={(e) => setFormData({ ...formData, bandThickness: e.target.value })}
                                                    />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Ring size</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 6.5 US"
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm"
                                            value={formData.ringSize}
                                            onChange={(e) => setFormData({ ...formData, ringSize: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Band style</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {['Plain polished', 'Pavé diamonds', 'Half eternity', 'Full eternity', 'Textured / brushed'].map((option) => {
                                            const isRecommended = formData.creationType === 'Eternity ring (no center stone)' && (option === 'Half eternity' || option === 'Full eternity');
                                            return (
                                                <label key={option} className={`
                          relative cursor-pointer border p-4 text-sm transition-all text-center
                          ${formData.bandStyle === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                          ${isRecommended ? 'border-gold/30 bg-gold/5' : ''}
                        `}>
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="bandStyle"
                                                        value={option}
                                                        checked={formData.bandStyle === option}
                                                        onChange={(e) => setFormData({ ...formData, bandStyle: e.target.value })}
                                                    />
                                                    {option}
                                                    {isRecommended && (
                                                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-primary-dark text-[8px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Recommended</span>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Budget & Timeline */}
                    {step === 4 && (
                        <div className="animate-fade-in">
                            <h3 className="section-subtitle mb-8">💰 Section 4: Budget & Timeline</h3>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Target investment range</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Under ₱50,000', '₱50,000 – ₱100,000', '₱100,000 – ₱200,000', '₱200,000+'].map((option) => (
                                            <label key={option} className={`
                        cursor-pointer border p-4 text-sm transition-all flex items-center gap-3
                        ${formData.budgetRange === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="budgetRange"
                                                    value={option}
                                                    checked={formData.budgetRange === option}
                                                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${formData.budgetRange === option ? 'bg-gold border-gold' : 'border-white/20'}`} />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">When do you need the ring?</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {['Within 2 weeks', '1 month', '2–3 months', 'Just exploring'].map((option) => (
                                            <label key={option} className={`
                        cursor-pointer border p-4 text-xs text-center transition-all flex items-center justify-center
                        ${formData.timeline === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-white/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="timeline"
                                                    value={option}
                                                    checked={formData.timeline === option}
                                                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 5: Final Details */}
                    {step === 5 && (
                        <div className="animate-fade-in">
                            <h3 className="section-subtitle mb-8">📝 Final Details</h3>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Do you have inspiration photos?</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/10 p-8 text-center cursor-pointer hover:border-gold transition-colors"
                                    >
                                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                                        {formData.inspirationFiles.length > 0 && (
                                            <p className="mt-2 text-xs text-gold font-medium">{formData.inspirationFiles.length} file(s) selected</p>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Engraving request</label>
                                    <input
                                        type="text"
                                        placeholder="Enter text here..."
                                        className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm"
                                        value={formData.engraving}
                                        onChange={(e) => setFormData({ ...formData, engraving: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Full name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Contact number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Preferred communication</label>
                                        <select
                                            className="w-full border-b border-white/20 py-2 focus:border-gold outline-none text-sm bg-transparent"
                                            value={formData.preferredComm}
                                            onChange={(e) => setFormData({ ...formData, preferredComm: e.target.value })}
                                        >
                                            <option value="">Select preference</option>
                                            {['Instagram', 'Facebook', 'Email'].map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t border-gray-100">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm uppercase tracking-widest"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                        ) : <div />}

                        {step < 5 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn-primary px-12 group"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn-primary px-12"
                            >
                                Request Quote
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
