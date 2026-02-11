import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH');
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card-image relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        {product.isSoldOut && (
          <span className="badge-sold-out">Sold out</span>
        )}
        {product.isOnSale && !product.isSoldOut && (
          <span className="badge-sale">On sale</span>
        )}
        {product.badge === 'new' && !product.isOnSale && !product.isSoldOut && (
          <span className="badge-new">New</span>
        )}
        
        {/* Quick Actions */}
        {showQuickView && (
          <div
            className={`absolute bottom-3 right-3 flex gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={product.isSoldOut}
              className="w-8 h-8 bg-white flex items-center justify-center hover:bg-forest hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            {product.currency}{formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.currency}{formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
