import Link from 'next/link';
import Image from 'next/image'; // Import the special Next.js Image component
import styles from './ItemCard.module.css';

// Define the "shape" of the data our component expects.
// This is based on your Prisma schema.
type ItemProps = {
  id: number;
  name: string;
  shortDescription: string;
  image: string;           // This *must* be a URL to an image
  price: number;
  promoPrice?: number | null; // It can be number, null, or undefined
};

/**
 * A simple helper function to format a number into BRL currency.
 * e.g., 999.9 -> "R$ 999,90"
 */
// function formatPrice(price: number) {
//   return price.toLocaleString('pt-BR', {
//     style: 'currency',
//     currency: 'BRL',
//   });
// }
function formatPrice(price: number) {
  return Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


// Note: This is a Server Component (no 'use client')
// We are just receiving props and displaying them.
export default function ItemCard({ item }: { item: ItemProps }) {
  // Check if there is a valid promotional price
  const hasPromo = item.promoPrice != null && item.promoPrice > 0;

  // Set the prices to display
  const displayPrice = hasPromo ? item.promoPrice! : item.price;
  const originalPrice = hasPromo ? item.price : null;

  return (
    // The entire card is a link to the item's detail page
    <Link href={`/items/${item.id}`} className={styles.card}>
      
      {/* 1. The Image */}
      <div className={styles.imageWrapper}>
        <Image
          // We assume item.image is a full URL
          // e.g., "https://my-storage.com/image.png"
          src={item.image} 
          alt={item.name}
          fill // This is the magic! Tells the image to fill its parent
          className={styles.image} // We'll use this for object-fit
        />
      </div>

      {/* 2. The Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{item.name}</h3>
        <p className={styles.description}>{item.shortDescription}</p>
        
        {/* 3. The Price */}
        <div className={styles.priceContainer}>
          <span className={styles.price}>
            {formatPrice(displayPrice)}
          </span>
          {/* Only show the original price if it exists (i.e., there's a promo) */}
          {originalPrice && (
            <del className={styles.originalPrice}>
              {formatPrice(originalPrice)}
            </del>
          )}
        </div>
      </div>
    </Link>
  );
}