"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ItemCard from "@/components/ItemCard";
import styles from "./page.module.css";

type Item = {
  id: number;
  name: string;
  shortDescription: string;
  image: string;
  price: number;
  promoPrice?: number | null;
};

export default function ItemsContent() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "deleted") {
      setStatusMessage("Item deleted successfully!");
      setShowToast(true);
      // Hide toast after 3s
      setTimeout(() => {
        setShowToast(false);
        setStatusMessage("");
      }, 3000);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/items?page=${currentPage}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setItems(data.data || data || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [currentPage]);

  const handleNextPage = () => setCurrentPage((p) => p + 1);
  const handlePrevPage = () => setCurrentPage((p) => p - 1);

  if (loading && items.length === 0) return <p>Loading...</p>;

  return (
    <div>
      <h2 className={styles.title}>Available Items</h2>
      {/* Inline status (fallback) */}
      {statusMessage && !showToast && (
        <div className={styles.statusMessage}>{statusMessage}</div>
      )}
      {/* Floating toast */}
      {showToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {statusMessage}
        </div>
      )}
      {loading && items.length > 0 && <p>Loading next page...</p>}

      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.paginationControls}>
        <button onClick={handlePrevPage} disabled={currentPage <= 1}>
          &larr; Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
