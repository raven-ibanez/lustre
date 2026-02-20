import { createContext, useContext, useState, useCallback } from 'react';
import type { Product, CartItem, OrderDetails } from '@/types';
import { supabase } from '@/lib/supabase';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkout: (orderDetails: OrderDetails) => Promise<boolean>;
  orderComplete: boolean;
  setOrderComplete: (complete: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.discount_active && item.discount_price ? item.discount_price : item.base_price) * item.quantity,
    0
  );

  const checkout = useCallback(async (orderDetails: OrderDetails): Promise<boolean> => {
    const messengerId = import.meta.env.VITE_MESSENGER_ID || 'your_messenger_id';
    const shipping = totalPrice >= 5000 ? 0 : 150;
    const totalWithShipping = totalPrice + shipping;

    try {
      // 0. Handle Payment Proof Upload (if applicable)
      let paymentProofUrl = null;
      if (orderDetails.paymentProofFile) {
        const file = orderDetails.paymentProofFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Payment proof storage upload error:', uploadError);
          if (uploadError.message.includes('bucket not found')) {
            alert("Error: 'payment_proofs' storage bucket not found. Your order was created, but please contact us to provide proof of payment.");
          } else {
            alert(`Payment proof upload failed: ${uploadError.message}. Your order was created, but we may need you to provide proof of payment.`);
          }
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('payment_proofs')
            .getPublicUrl(filePath);
          paymentProofUrl = publicUrl;
        }
      }

      // 1. Create Order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          first_name: orderDetails.firstName,
          last_name: orderDetails.lastName,
          email: orderDetails.email,
          phone: orderDetails.phone,
          address: orderDetails.address,
          city: orderDetails.city,
          postal_code: orderDetails.postalCode,
          payment_method: orderDetails.paymentMethod,
          total_amount: totalWithShipping,
          shipping_fee: shipping,
          payment_proof_url: paymentProofUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order insertion error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!order) {
        throw new Error('Order was created but no data was returned. This might be an RLS policy issue.');
      }

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.discount_active && item.discount_price ? item.discount_price : item.base_price,
        raw_price: item.raw_price || 0,
        markup_type: item.markup_type
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items insertion error:', itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // 3. Format order message for Messenger
      let message = `New Order from Lustre Lab\n\n`;
      message += `Order ID: ${order.id}\n`;
      message += `Customer: ${orderDetails.firstName} ${orderDetails.lastName}\n`;
      message += `Phone: ${orderDetails.phone}\n`;
      message += `Email: ${orderDetails.email}\n`;
      message += `Address: ${orderDetails.address}, ${orderDetails.city} ${orderDetails.postalCode}\n\n`;
      message += `Order Items:\n`;

      items.forEach(item => {
        const price = item.discount_active && item.discount_price ? item.discount_price : item.base_price;
        message += `- ${item.name} x${item.quantity} (₱${(price * item.quantity).toLocaleString()})\n`;
      });

      message += `\nSubtotal: ₱${totalPrice.toLocaleString()}\n`;
      message += `Shipping: ₱${shipping.toLocaleString()}\n`;
      message += `Total: ₱${totalWithShipping.toLocaleString()}\n`;
      message += `Payment Method: ${orderDetails.paymentMethod.toUpperCase()}\n`;

      if (paymentProofUrl) {
        message += `Payment Proof: ${paymentProofUrl}\n`;
      }

      const encodedMessage = encodeURIComponent(message);
      const messengerUrl = `https://m.me/${messengerId}?text=${encodedMessage}`;

      // Redirect to Messenger after saving
      window.open(messengerUrl, '_blank');
      clearCart();
      setOrderComplete(true);
      return true;
    } catch (error: any) {
      console.error('Checkout error details:', error);
      alert(`There was an error processing your order: ${error.message || 'Please try again.'}`);
      return false;
    }
  }, [items, totalPrice, clearCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        checkout,
        orderComplete,
        setOrderComplete,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
