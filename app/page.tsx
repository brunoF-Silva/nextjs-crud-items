'use client';
// 1. Added useSearchParams to the imports
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import ItemCard from '@/components/ItemCard';
import styles from './page.module.css';

// Item type definition
type Item = {
  id: number;
  name: string;
  shortDescription: string;
  image: string;
  price: number;
  promoPrice?: number | null;
};

export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // Get the search params
  const searchParams = useSearchParams();

  // Main useEffect for fetching items based on page
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/items?page=${currentPage}`,
        );
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Debug: see what the API returns
        setItems(data.data || data || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Falha ao buscar itens:", error);
        setItems([]); // Ensure items is always an array
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [currentPage]); // Re-run when 'currentPage' changes

  // Pagination handler functions
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  if (loading && items.length === 0) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2 className={styles.title}>Avaliable Items</h2>
      {/* 2. Added the status message display here */}
      {statusMessage && (
        <div className={styles.statusMessage}>{statusMessage}</div>
      )}

      {/* Show a message if loading next page */}
      {loading && items.length > 0 && <p>Carregando próxima página...</p>}

      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination buttons UI */}
      <div className={styles.paginationControls}>
        <button onClick={handlePrevPage} disabled={currentPage <= 1}>
          &larr; Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Próxima &rarr;
        </button>
      </div>
    </div>
  );
}