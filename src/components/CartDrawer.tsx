import { useState, useEffect } from 'react';
import { Truck, Wallet, ShoppingBag, X, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import type { OrderDetails, PaymentMethod } from '@/types';

export function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    checkout,
    orderComplete,
    setOrderComplete
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
    paymentProofFile: null,
  });

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching payment methods:', error);
          return;
        }
        if (data) setPaymentMethods(data);
      } catch (err) {
        console.error('Failed to fetch payment methods:', err);
      }
    }
    fetchPaymentMethods();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    try {
      const success = await checkout(orderDetails);
      if (success) {
        // Success handled by context and orderComplete state
      }
    } catch (err) {
      console.error('Checkout handler error:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (orderComplete) {
      setOrderComplete(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-background h-full overflow-auto animate-slide-left border-l border-foreground/10 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-foreground/5 pb-6">
            <h2 className="font-serif text-2xl flex items-center gap-2 text-foreground">
              <ShoppingBag className="w-5 h-5 text-gold" />
              Your Cart ({totalItems})
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {orderComplete ? (
            /* Order Complete */
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-foreground">Order Confirmed!</h3>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. We&apos;ll send you an email confirmation shortly.
              </p>
              <button
                onClick={handleClose}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
              <h3 className="font-serif text-xl mb-2 text-foreground">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Discover our beautiful collection and add something special.
              </p>
              <button
                onClick={handleClose}
                className="btn-primary"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout */
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-foreground/5 border border-foreground/5">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover border border-foreground/10"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-foreground/5 flex items-center justify-center border border-foreground/10">
                        <ShoppingBag className="w-6 h-6 text-foreground/20" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
                      <p className="text-sm text-gold font-medium">
                        ₱{formatPrice(item.discount_active && item.discount_price ? item.discount_price : item.base_price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-foreground/10 flex items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-8 text-center text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-foreground/10 flex items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-foreground/10 pt-6 mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subtotal</span>
                  <span className="text-sm text-foreground">₱{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shipping</span>
                  <span className="text-sm text-foreground">{totalPrice >= 5000 ? 'FREE' : '₱150'}</span>
                </div>
                <div className="flex justify-between items-center bg-foreground/5 -mx-6 px-6 py-4 border-y border-foreground/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold text-foreground/40">Total Amount</span>
                  <span className="text-xl font-serif text-gold">₱{formatPrice(totalPrice >= 5000 ? totalPrice : totalPrice + 150)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-6">
                <h3 className="font-serif text-xl text-foreground">Checkout Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Juan"
                      value={orderDetails.firstName}
                      onChange={(e) => setOrderDetails({ ...orderDetails, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:border-gold outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dela Cruz"
                      value={orderDetails.lastName}
                      onChange={(e) => setOrderDetails({ ...orderDetails, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:border-gold outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="juan@example.com"
                    value={orderDetails.email}
                    onChange={(e) => setOrderDetails({ ...orderDetails, email: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:border-gold outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0917 XXX XXXX"
                    value={orderDetails.phone}
                    onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:border-gold outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Delivery Address</label>
                  <textarea
                    placeholder="Street Name, Barangay, Landmark"
                    value={orderDetails.address}
                    onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:border-gold outline-none transition-colors resize-none"
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={orderDetails.city}
                      onChange={(e) => setOrderDetails({ ...orderDetails, city: e.target.value })}
                      className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:border-gold outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="1234"
                      value={orderDetails.postalCode}
                      onChange={(e) => setOrderDetails({ ...orderDetails, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:border-gold outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4 pt-4 border-t border-foreground/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Payment Method</p>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all hover:bg-gold/5 ${orderDetails.paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-foreground/10 bg-foreground/5 rounded-none'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={orderDetails.paymentMethod === 'cod'}
                        onChange={() => setOrderDetails({ ...orderDetails, paymentMethod: 'cod', paymentProofFile: null })}
                        className="hidden"
                      />
                      <Truck className={`w-5 h-5 ${orderDetails.paymentMethod === 'cod' ? 'text-gold' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${orderDetails.paymentMethod === 'cod' ? 'text-foreground' : 'text-muted-foreground'}`}>Cash on Delivery</span>
                        <p className="text-[10px] text-muted-foreground/60">Pay when your order arrives</p>
                      </div>
                    </label>

                    {paymentMethods.map((method) => (
                      <div key={method.id} className="space-y-3">
                        <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all hover:bg-gold/5 ${orderDetails.paymentMethod === method.id ? 'border-gold bg-gold/5' : 'border-foreground/10 bg-foreground/5'}`}>
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={orderDetails.paymentMethod === method.id}
                            onChange={() => setOrderDetails({ ...orderDetails, paymentMethod: method.id })}
                            className="hidden"
                          />
                          <Wallet className={`w-5 h-5 ${orderDetails.paymentMethod === method.id ? 'text-gold' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <span className={`text-sm font-medium ${orderDetails.paymentMethod === method.id ? 'text-foreground' : 'text-muted-foreground'}`}>{method.name}</span>
                            <p className="text-[10px] text-muted-foreground/60">Fast & Secure Digital Payment</p>
                          </div>
                        </label>

                        {orderDetails.paymentMethod === method.id && (
                          <div className="p-4 bg-foreground/5 border border-foreground/5 animate-in fade-in slide-in-from-top-2 duration-300">
                            {(method.qr_code_url || method.account_number) && (
                              <div className="text-center mb-6">
                                {method.qr_code_url && (
                                  <div className="bg-white p-2 inline-block shadow-sm mb-4">
                                    <img
                                      src={method.qr_code_url}
                                      alt={`${method.name} QR Code`}
                                      className="w-48 h-48 object-contain"
                                    />
                                  </div>
                                )}
                                {method.account_name && <p className="text-xs text-gold font-bold uppercase tracking-widest">{method.account_name}</p>}
                                {method.account_number && <p className="text-[10px] text-muted-foreground font-mono mt-1">Number: {method.account_number}</p>}
                              </div>
                            )}

                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Upload Proof of Payment</label>
                              <div className="relative group">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setOrderDetails({ ...orderDetails, paymentProofFile: e.target.files?.[0] || null })}
                                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-gold file:text-primary-dark hover:file:bg-gold/90 transition-colors cursor-pointer"
                                  required
                                />
                              </div>
                              {orderDetails.paymentProofFile && (
                                <p className="text-[10px] text-gold font-bold uppercase tracking-widest flex items-center gap-1">
                                  <Check className="w-3 h-3" /> {orderDetails.paymentProofFile.name} attached
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full btn-primary py-5 disabled:opacity-50 text-[10px] font-bold uppercase tracking-widest text-primary-dark"
                >
                  {isCheckingOut ? 'Processing Transaction...' : `Complete Order • ₱${formatPrice(totalPrice >= 5000 ? totalPrice : totalPrice + 150)}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
