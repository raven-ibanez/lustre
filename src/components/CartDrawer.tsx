import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Check, CreditCard, Truck, Wallet } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { OrderDetails } from '@/types';

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
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    await checkout(orderDetails);
    setIsCheckingOut(false);
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
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full overflow-auto animate-slide-left">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Cart ({totalItems})
            </h2>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {orderComplete ? (
            /* Order Complete */
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Order Confirmed!</h3>
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
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-serif text-xl mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Discover our beautiful collection and add something special.
              </p>
              <a 
                href="#shop" 
                onClick={handleClose}
                className="btn-primary"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            /* Cart Items & Checkout */
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-cream">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.currency}{formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:border-forest"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:border-forest"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₱{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{totalPrice >= 5000 ? 'Free' : '₱150'}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₱{formatPrice(totalPrice >= 5000 ? totalPrice : totalPrice + 150)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <h3 className="font-serif text-lg">Checkout Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={orderDetails.firstName}
                    onChange={(e) => setOrderDetails({...orderDetails, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={orderDetails.lastName}
                    onChange={(e) => setOrderDetails({...orderDetails, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                    required
                  />
                </div>
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={orderDetails.email}
                  onChange={(e) => setOrderDetails({...orderDetails, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                  required
                />
                
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={orderDetails.phone}
                  onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                  required
                />
                
                <textarea
                  placeholder="Delivery Address"
                  value={orderDetails.address}
                  onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none resize-none"
                  rows={2}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={orderDetails.city}
                    onChange={(e) => setOrderDetails({...orderDetails, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={orderDetails.postalCode}
                    onChange={(e) => setOrderDetails({...orderDetails, postalCode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Method</p>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${orderDetails.paymentMethod === 'cod' ? 'border-forest bg-forest/5' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={orderDetails.paymentMethod === 'cod'}
                        onChange={() => setOrderDetails({...orderDetails, paymentMethod: 'cod'})}
                        className="hidden"
                      />
                      <Truck className="w-5 h-5" />
                      <span className="text-sm">Cash on Delivery</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${orderDetails.paymentMethod === 'gcash' ? 'border-forest bg-forest/5' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="gcash"
                        checked={orderDetails.paymentMethod === 'gcash'}
                        onChange={() => setOrderDetails({...orderDetails, paymentMethod: 'gcash'})}
                        className="hidden"
                      />
                      <Wallet className="w-5 h-5" />
                      <span className="text-sm">GCash</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${orderDetails.paymentMethod === 'bank' ? 'border-forest bg-forest/5' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={orderDetails.paymentMethod === 'bank'}
                        onChange={() => setOrderDetails({...orderDetails, paymentMethod: 'bank'})}
                        className="hidden"
                      />
                      <CreditCard className="w-5 h-5" />
                      <span className="text-sm">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full btn-primary py-4 disabled:opacity-50"
                >
                  {isCheckingOut ? 'Processing...' : `Place Order - ₱${formatPrice(totalPrice >= 5000 ? totalPrice : totalPrice + 150)}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
