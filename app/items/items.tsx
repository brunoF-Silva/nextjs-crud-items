'use client'; // Necessário no Next.js para usar hooks
import { useState, useEffect } from 'react';

export default function ItemPage() {
  // 1. Onde vamos guardar os dados
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. O pedido (quando a página carrega)
  useEffect(() => {
    async function fetchItems() {
      try {
        // 3. O "fetch" para o seu back-end (que está na porta 3000)
        const response = await fetch('http://localhost:4000/items');
        const data = await response.json();
        setItems(data); // 4. Guarda os dados no estado
      } catch (error) {
        console.error('Falha ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []); // O array vazio [] significa "só rode uma vez"

  if (loading) {
    return <p>Carregando...</p>;
  }

  // 5. Mostra os dados na tela
  return (
    <div>
      <h1>Lista de Itens</h1>
      <ul>
        {items.map((item: any) => (
          <li key={item.id}>{item.name} ({item.email})</li>
        ))}
      </ul>
    </div>
  );
}
