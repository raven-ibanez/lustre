import { useState, useRef, useEffect } from 'react';
import { Sparkles, Upload, ChevronRight, ChevronLeft, Instagram, ShieldCheck, Gem } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Section = 1 | 2 | 3 | 4 | 5;

export function CustomRingQuotation() {
    const [step, setStep] = useState<Section>(1);
    const [submitted, setSubmitted] = useState(false);
    const [quotationResult, setQuotationResult] = useState<any>(null);
    const [calculating, setCalculating] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('quotation_settings').select('*');
        if (data) {
            const settingsObj = data.reduce((acc: any, curr: any) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
            setSettings(settingsObj);
        }
    };

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
        socialHandle: '',
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

    const calculateQuotation = () => {
        // 1. Determine Path
        let path = 'center_stone';
        if (formData.creationType === 'Plain band (no stones)') path = 'plain_band';
        if (formData.creationType === 'Eternity ring (no center stone)') path = 'eternity';

        let cost = 0;
        const margin = (settings.margin || 165) / 100 + 1; // e.g. 1.65 + 1 = 2.65

        // Helper: Get Metal Price per Gram
        const getMetalPrice = () => {
            if (formData.metal.includes('10k')) return settings.gold_price_10k || 5000;
            if (formData.metal.includes('14k')) return settings.gold_price_14k || 6500;
            if (formData.metal.includes('18k')) return settings.gold_price_18k || 8500;
            if (formData.metal.includes('Silver')) return settings.silver_price || 280;
            return 6500; // Default 14k
        };

        // Helper: Gold Weight Logic
        const getFinalGoldWeight = () => {
            let baseWeight = 3.5; // Medium
            if (formData.bandThickness.includes('Thin')) baseWeight = 3;
            if (formData.bandThickness.includes('Thick')) baseWeight = 4;

            const size = parseFloat(formData.ringSize) || 6;
            const sizeDiff = size - 6;
            const adjustment = Math.floor(sizeDiff) * 0.25;
            return baseWeight + adjustment;
        };

        if (path === 'center_stone') {
            // 1. Stone Cost
            let stoneBaseCarat = settings.stone_moissanite || 1000;
            if (formData.stoneType.includes('Lab-grown diamond')) stoneBaseCarat = settings.stone_lab_diamond || 9000;
            if (formData.stoneType.includes('sapphire')) stoneBaseCarat = settings.stone_sapphire || 1500;
            if (formData.stoneType.includes('emerald')) stoneBaseCarat = settings.stone_emerald || 1800;

            // Carat weight parsing
            let carat = 1.0;
            const ctMatch = formData.caratWeight.match(/([\d.]+)\s*–\s*([\d.]+)/);
            if (ctMatch) {
                carat = (parseFloat(ctMatch[1]) + parseFloat(ctMatch[2])) / 2;
            } else if (formData.otherCarat) {
                carat = parseFloat(formData.otherCarat) || 1.0;
            }

            cost += (stoneBaseCarat * carat);

            // Adjustments
            if (formData.shape === 'Marquise') cost += 2000;

            if (formData.stoneType.includes('Lab-grown diamond') || formData.stoneType.includes('Moissanite')) {
                if (formData.colorPreference.includes('D–F')) cost += 500;
                if (formData.colorPreference.includes('G–H')) cost += 100;
                if (formData.colorPreference.includes('Fancy')) cost += 11800;

                if (formData.clarityPreference.includes('VS')) cost -= 150;
                if (formData.clarityPreference.includes('SI')) cost -= 200;
            }

            if (formData.stoneType.includes('Lab-grown diamond') && formData.certification === 'No') {
                cost -= 200;
            }

            // 2. Setting Cost
            cost += (settings.base_craftsmanship || 2500);

            const styleAddons: any = {
                'Hidden halo': 4500,
                'Halo': 4500,
                'Three-stone': 5000,
                'Bezel': 5000,
                'Cathedral': 4500,
                'Petal': 4500,
                'Basket': 5500
            };
            Object.keys(styleAddons).forEach(key => {
                if (formData.settingStyle.includes(key)) cost += styleAddons[key];
            });

            // Side stones
            if (formData.sideStones.includes('accent')) cost += 3000;
            if (formData.sideStones.includes('Halo')) cost += 3000;
            if (formData.sideStones.includes('baguettes')) cost += 7000;
            if (formData.sideStones.includes('Three-stone')) cost += 15000;

            // 3. Metal Cost
            cost += (getFinalGoldWeight() * getMetalPrice());

        } else if (path === 'plain_band') {
            cost += (getFinalGoldWeight() * getMetalPrice());
            cost += (settings.base_craftsmanship || 2500);

        } else if (path === 'eternity') {
            // Path C: Eternity
            let stonePricePerCt = settings.stone_moissanite || 1000;
            if (formData.stoneType.includes('Lab-grown diamond')) stonePricePerCt = settings.stone_lab_diamond || 9000;
            if (formData.stoneType.includes('sapphire')) stonePricePerCt = settings.stone_sapphire || 1500;

            // Base stone count (Size 6)
            let baseCount = 32; // Default 1.5mm
            let stoneCt = 0.02; // Default 1.5mm
            if (formData.bandThickness.includes('1.0mm')) { baseCount = 48; stoneCt = 0.01; }
            if (formData.bandThickness.includes('1.3mm')) { baseCount = 38; stoneCt = 0.015; }
            if (formData.bandThickness.includes('2.0mm')) { baseCount = 24; stoneCt = 0.03; }
            if (formData.bandThickness.includes('2.5mm')) { baseCount = 18; stoneCt = 0.05; }

            const size = parseFloat(formData.ringSize) || 6;
            const sizeDiff = size - 6;
            const countAdjustment = Math.floor(sizeDiff) * 2;
            const finalCount = baseCount + countAdjustment;

            const totalCarat = stoneCt * finalCount;
            cost += (totalCarat * stonePricePerCt);

            // Metal Cost
            cost += (getFinalGoldWeight() * getMetalPrice());

            // Labor
            cost += 2500;
        }

        const finalTotal = cost * margin;
        const low = Math.round(finalTotal * 0.98 / 100) * 100;
        const high = Math.round(finalTotal * 1.10 / 100) * 100;

        let tier = 'Refined Minimal';
        if (finalTotal >= 250000) tier = 'Heirloom Tier';
        else if (finalTotal >= 150000) tier = 'Statement Collection';
        else if (finalTotal >= 80000) tier = 'Signature Luxe';

        return { low, high, tier, path };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCalculating(true);

        try {
            const result = calculateQuotation();
            setQuotationResult(result);

            // Save to Supabase
            const { error } = await supabase.from('quotation_results').insert([
                {
                    customer_name: formData.fullName,
                    customer_email: formData.email,
                    customer_phone: formData.phoneNumber,
                    path: result.path,
                    form_data: formData,
                    final_price_low: result.low,
                    final_price_high: result.high,
                    tier: result.tier
                }
            ]);

            if (error) console.error('Error saving quotation:', error);

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Calculation error:', err);
        } finally {
            setCalculating(false);
        }
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

    if (submitted && quotationResult) {
        return (
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen flex items-center justify-center">
                <div className="max-w-2xl w-full bg-card p-8 sm:p-12 shadow-2xl border border-primary-dark/10 animate-fade-in relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Gem className="w-32 h-32 text-gold" />
                    </div>

                    <div className="text-center relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <ShieldCheck className="w-8 h-8 text-gold" />
                        </div>

                        <h2 className="font-serif text-3xl mb-2 text-primary-dark italic">Your Custom Design Proposal</h2>
                        <p className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-8">Generated Exclusively for {formData.fullName}</p>

                        <div className="bg-primary-dark/5 border border-primary-dark/10 p-8 mb-8 backdrop-blur-sm">
                            <span className="text-[10px] uppercase tracking-widest text-primary-dark/40 mb-2 block font-bold">Estimated Investment</span>
                            <div className="font-serif text-4xl sm:text-5xl text-gold mb-2">
                                ₱{quotationResult.low.toLocaleString()} – ₱{quotationResult.high.toLocaleString()}
                            </div>
                            <div className="inline-block px-4 py-1 bg-gold text-primary-dark text-[10px] font-bold uppercase tracking-widest rounded-full">
                                {quotationResult.tier}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                            <div className="p-4 border border-primary-dark/5 bg-primary-dark/[0.02]">
                                <h4 className="text-[10px] uppercase font-bold text-primary-dark/40 mb-2 tracking-widest">Specifications</h4>
                                <ul className="text-xs space-y-2 text-primary-dark/80">
                                    <li className="flex justify-between"><span>Type:</span> <span className="text-primary-dark font-medium">{formData.creationType}</span></li>
                                    <li className="flex justify-between"><span>Metal:</span> <span className="text-primary-dark font-medium">{formData.metal}</span></li>
                                    {formData.stoneType && <li className="flex justify-between"><span>Stone:</span> <span className="text-primary-dark font-medium">{formData.stoneType}</span></li>}
                                </ul>
                            </div>
                            <div className="p-4 border border-primary-dark/5 bg-primary-dark/[0.02]">
                                <h4 className="text-[10px] uppercase font-bold text-primary-dark/40 mb-2 tracking-widest">Next Steps</h4>
                                <p className="text-[11px] text-primary-dark/60 leading-relaxed font-medium">
                                    Our master craftsmen have received your vision. A concierge will reach out via <span className="text-gold font-bold">{formData.preferredComm}</span> to finalize your design.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.hash = 'home'}
                                className="btn-primary w-full py-4 text-xs tracking-[0.2em]"
                            >
                                CLOSE & RETURN HOME
                            </button>

                            <div className="flex items-center justify-center gap-6 pt-4 border-t border-primary-dark/5">
                                <a
                                    href="https://instagram.com/lustrelab"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary-dark/40 hover:text-gold transition-colors"
                                >
                                    <Instagram className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Follow @lustrelab</span>
                                </a>
                            </div>
                        </div>
                    </div>
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
                        ${formData.aestheticPreference === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="aestheticPreference"
                                                    value={option}
                                                    checked={formData.aestheticPreference === option}
                                                    onChange={(e) => setFormData({ ...formData, aestheticPreference: e.target.value })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${formData.aestheticPreference === option ? 'bg-gold border-gold' : 'border-foreground/20'}`} />
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
                        ${formData.stoneType === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="stoneType"
                                                    value={option}
                                                    checked={formData.stoneType === option}
                                                    onChange={(e) => setFormData({ ...formData, stoneType: e.target.value })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${formData.stoneType === option ? 'bg-gold border-gold' : 'border-foreground/20'}`} />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                    {formData.stoneType === 'Other gemstone (please specify)' && (
                                        <input
                                            type="text"
                                            placeholder="Specify gemstone..."
                                            className="mt-3 w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm text-foreground bg-transparent placeholder:text-foreground/40"
                                            value={formData.otherStone}
                                            onChange={(e) => setFormData({ ...formData, otherStone: e.target.value })}
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Preferred shape</label>
                                        <select
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm bg-transparent text-foreground"
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
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm bg-transparent text-foreground"
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
                                                className="mt-2 w-full border-b border-foreground/20 py-1 focus:border-gold outline-none text-sm text-foreground bg-transparent placeholder:text-foreground/40"
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
                                                className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm bg-transparent text-foreground"
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
                                                className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm bg-transparent text-foreground"
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
                        ${formData.sideStones === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
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
                          ${formData.certification === opt.value ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
                        `}>
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="certification"
                                                        value={opt.value}
                                                        checked={formData.certification === opt.value}
                                                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                                                    />
                                                    <div className={`w-3 h-3 rounded-full border ${formData.certification === opt.value ? 'bg-gold border-gold' : 'border-foreground/20'}`} />
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
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm bg-transparent text-foreground"
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
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm bg-transparent text-foreground"
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
                          ${formData.bandThickness === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
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
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm text-foreground bg-transparent placeholder:text-foreground/40"
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
                          ${formData.bandStyle === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
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
                        ${formData.budgetRange === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
                      `}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="budgetRange"
                                                    value={option}
                                                    checked={formData.budgetRange === option}
                                                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${formData.budgetRange === option ? 'bg-gold border-gold' : 'border-foreground/20'}`} />
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
                        ${formData.timeline === option ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-foreground/10 hover:border-gold/50'}
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
                                        className="border-2 border-dashed border-foreground/10 p-8 text-center cursor-pointer hover:border-gold transition-colors"
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
                                        className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm text-foreground bg-transparent placeholder:text-foreground/40"
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
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm text-foreground bg-transparent"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Contact number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm text-foreground bg-transparent"
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
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm text-foreground bg-transparent"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-4 uppercase tracking-wider">Preferred communication</label>
                                        <select
                                            className="w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm bg-transparent text-foreground"
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

                                {(formData.preferredComm === 'Instagram' || formData.preferredComm === 'Facebook') && (
                                    <div className="animate-fade-in space-y-4">
                                        <div className="bg-gold/5 border border-gold/10 p-4">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gold mb-2">
                                                {formData.preferredComm} {formData.preferredComm === 'Instagram' ? 'Handle' : 'Account Name'}
                                            </label>
                                            <div className="relative">
                                                {formData.preferredComm === 'Instagram' && (
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/40 text-sm">@</span>
                                                )}
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder={formData.preferredComm === 'Instagram' ? 'username' : 'Full Name on Facebook'}
                                                    className={`w-full border-b border-foreground/20 py-2 focus:border-gold outline-none text-sm text-foreground bg-transparent placeholder:text-foreground/40 ${formData.preferredComm === 'Instagram' ? 'pl-4' : ''}`}
                                                    value={formData.socialHandle}
                                                    onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                                                />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-2 italic">So we can find you and send your design proposal!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t border-foreground/10">
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
                                disabled={calculating}
                                className="btn-primary px-12 relative flex items-center justify-center min-w-[160px]"
                            >
                                {calculating ? (
                                    <div className="w-5 h-5 border-2 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin" />
                                ) : (
                                    'Request Quote'
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
