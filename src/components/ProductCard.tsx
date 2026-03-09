import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH');
  };

  const effectivePrice = product.discount_active && product.discount_price
    ? product.discount_price
    : product.base_price;

  return (
    <div className="product-card">
      <div className="product-card-image relative">
        <img
          src={product.image_url || '/images/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Badges */}
        {!product.available && (
          <span className="badge-sold-out">Sold out</span>
        )}
        {product.discount_active && product.available && (
          <span className="badge-sale">On sale</span>
        )}
        {product.popular && product.available && !product.discount_active && (
          <span className="badge-new">Popular</span>
        )}

        {/* Quick Actions */}
        {showQuickView && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className="w-8 h-8 bg-primary text-primary-foreground border border-primary/10 flex items-center justify-center hover:bg-gold hover:text-primary-dark hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-sm font-medium">
            ₱{formatPrice(effectivePrice)}
          </span>
          {product.discount_active && product.discount_price && (
            <span className="text-sm text-muted-foreground line-through">
              ₱{formatPrice(product.base_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
