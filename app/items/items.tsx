"use client"; // Required in Next.js to use hooks
import { useState, useEffect } from "react";

export default function ItemPage() {
  // 1. Where we store the data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. The request (when the page loads)
  useEffect(() => {
    async function fetchItems() {
      try {
        // 3. The "fetch" to your backend
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/items`);
        const data = await response.json();
        setItems(data); // 4. Save data to state
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []); // The empty array [] means "only run once"

  if (loading) {
    return <p>Loading...</p>;
  }

  // 5. Render data on the screen
  return (
    <div>
      <h1>Lista de Itens</h1>
      <ul>
        {items.map((item: any) => (
          <li key={item.id}>
            {item.name} ({item.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
