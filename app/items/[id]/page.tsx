'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './itemDetail.module.css';

// 1. Define the types for the data we expect
// We add the 'user' object here
type User = {
  name: string;
};

type Item = {
  id: number;
  name: string;
  longDescription: string;
  shortDescription: string;
  image: string;
  price: number;
  promoPrice?: number | null;
  user: User; // The included user object
};

// Helper function to format price (you can move this to a shared 'utils.ts' file)
function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function ItemDetailPage() {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); // For success/error messages

  // 2. Next.js hooks for dynamic routing
  const params = useParams(); // Gets { id: '...' } from the URL
  const router = useRouter(); // Used for redirecting
  const searchParams = useSearchParams(); // Used for reading query params (e.g., ?status=updated)
  const id = params.id;

  // 3. Fetch item data when the page loads
  useEffect(() => {
    if (!id) return; // Don't fetch if id isn't ready

    async function fetchItem() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/items/${id}`);
        if (!res.ok) {
          throw new Error('Item not found');
        }
        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error(error);
        setStatusMessage('Error: Item not found.');
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]); // Re-run if 'id' changes

  // 4. Read the status message from the URL (e.g., after an edit)
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'updated') {
      setStatusMessage('Item updated successfully!');
      // Optional: clear the message after a few seconds
      setTimeout(() => setStatusMessage(''), 3000);
    }
  }, [searchParams]);

  // 5. Delete handler function
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:4000/items/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete item');
      }

      // Success! Redirect to the homepage with a status message
      // We can't stay on this page, as the item is gone.
      router.push('/?status=deleted');
    } catch (error) {
      console.error(error);
      setStatusMessage('Error: Failed to delete item.');
      setShowDeleteModal(false); // Close modal on error
    }
  };

  // --- Render logic ---
  if (loading) return <p>Loading...</p>;
  if (!item) return <p>{statusMessage || 'Item not found.'}</p>;

  // Price logic from your ItemCard
  const hasPromo = item.promoPrice != null && item.promoPrice > 0;
  const displayPrice = hasPromo ? item.promoPrice! : item.price;
  const originalPrice = hasPromo ? item.price : null;

  return (
    <div className={styles.container}>
      {/* 6. Status Message (for updates or errors) */}
      {statusMessage && (
        <div className={styles.statusMessage}>{statusMessage}</div>
      )}

      {/* 7. The Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete "{item.name}"? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={styles.buttonDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Main Item Content */}
      <div className={styles.imageWrapper}>
        <Image src={item.image} alt={item.name} fill className={styles.image} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{item.name}</h1>
        <p className={styles.soldBy}>Sold by: {item.user.name}</p>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(displayPrice)}</span>
          {originalPrice && (
            <del className={styles.originalPrice}>
              {formatPrice(originalPrice)}
            </del>
          )}
        </div>
        
        <h3 className={styles.sectionTitle}>Description</h3>
        <p className={styles.longDescription}>{item.longDescription}</p>

        {/* 9. Action Buttons */}
        <div className={styles.actions}>
          <Link href={`/items/${id}/edit`} className={styles.buttonPrimary}>
            Edit Item
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className={styles.buttonDelete}
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}