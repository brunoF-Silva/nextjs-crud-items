"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./itemDetail.module.css";
import { formatUsaPrice, formatBrlPrice } from "../../../lib/utils";

// 1. Define the types for the data we expect
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
  user: User;
};

export default function ItemDetailPage() {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // 2. Next.js hooks for dynamic routing
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id;

  // 3. Fetch item data when the page loads
  useEffect(() => {
    if (!id) return;

    async function fetchItem() {
      try {
        setLoading(true);
        // Use the environment variable for the GET request
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/items/${id}`);

        if (!res.ok) {
          if (res.status === 404)
            throw new Error("Item not found in the database");
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error(error);
        // Show the actual error message
        setStatusMessage(
          error instanceof Error ? error.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  // 4. Read the status message from the URL (e.g., after an edit)
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "updated") {
      setStatusMessage("Item updated successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, [searchParams]);

  // 5. Delete handler function
  const handleDelete = async () => {
    try {
      // Use the environment variable for the DELETE request
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete item: ${res.status}`);
      }

      router.push("/?status=deleted");
    } catch (error) {
      console.error(error);
      setStatusMessage("Error: Failed to connect to server to delete item.");
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>{statusMessage || "Item not found."}</p>;

  const hasPromo = item.promoPrice != null && item.promoPrice > 0;
  const displayPrice = hasPromo ? item.promoPrice! : item.price;
  const originalPrice = hasPromo ? item.price : null;

  return (
    <div className={styles.container}>
      {statusMessage && (
        <div className={styles.statusMessage}>{statusMessage}</div>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete "{item.name}"? This action cannot
              be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button onClick={handleDelete} className={styles.buttonDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.imageWrapper}>
        <Image src={item.image} alt={item.name} fill className={styles.image} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{item.name}</h1>
        <p className={styles.soldBy}>Sold by: {item.user.name}</p>

        <div className={styles.priceContainer}>
          {/* Using the USA price formatter */}
          <span className={styles.price}>{formatUsaPrice(displayPrice)}</span>
          {originalPrice && (
            <del className={styles.originalPrice}>
              {formatUsaPrice(originalPrice)}
            </del>
          )}
        </div>

        <h3 className={styles.sectionTitle}>Description</h3>
        <p className={styles.longDescription}>{item.longDescription}</p>

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
