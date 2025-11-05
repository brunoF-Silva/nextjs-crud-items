'use client'; // This is required because we use state (useState) and event handlers (onSubmit)

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Used to redirect after success
import styles from './CreateItem.module.css'; // We will create this CSS file next

// This component will be rendered by Next.js when you visit /items/new
export default function CreateItemPage() {
  const router = useRouter(); // Initialize router to redirect

  // State for all our form fields
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [userId, setUserId] = useState(''); // Assuming you'll hardcode or fetch this eventually

  // State for handling errors from the API
  const [error, setError] = useState<string | null>(null);

  // This function runs when the user clicks the submit button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the browser from refreshing the page

    // 1. --- Prepare the Data ---
    // Create the data object to send.
    // We must convert strings from the form into numbers for our DTO.
    const itemData = {
      name,
      shortDescription,
      longDescription,
      image,
      price: parseFloat(price), // Convert string "12.99" to number 12.99
      userId: parseInt(userId, 10), // Convert string "1" to number 1
      // Only include promoPrice if it's not empty
      ...(promoPrice && { promoPrice: parseFloat(promoPrice) }),
    };

    // 2. --- Send the Data (POST Request) ---
    try {
      const response = await fetch('http://localhost:4000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      // 3. --- Handle the Response ---
      if (!response.ok) {
        // If the server sends a 400 (validation error) or 500 (server error)
        const errorData = await response.json();
        throw new Error(errorData.message.join(', ') || 'Failed to create item');
      }

      // If successful, log the new item and redirect to the main items page
      const newItem = await response.json();
      console.log('Item created successfully:', newItem);
      alert('Item created successfully!');
      router.push('/items'); // Redirect to the items list page
    
    } catch (err: any) {
      console.error(err);
      setError(err.message); // Show the error message on the page
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Create a New Item</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Show an error message if the API request fails */}
        {error && (
          <div className={styles.errorBanner}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Item Name</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="shortDescription" className={styles.label}>Short Description</label>
          <input
            type="text"
            id="shortDescription"
            className={styles.input}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            maxLength={300}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="longDescription" className={styles.label}>Long Description</label>
          <textarea
            id="longDescription"
            className={styles.textarea}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>Image URL</label>
          <input
            type="text"
            id="image"
            className={styles.input}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        {/* Group price fields together */}
        <div className={styles.priceGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>Price</label>
            <input
              type="number"
              id="price"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="promoPrice" className={styles.label}>Promotional Price (Optional)</label>
            <input
              type="number"
              id="promoPrice"
              className={styles.input}
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value)}
              step="0.01"
              min="0.01"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userId" className={styles.label}>User ID</label>
          <input
            type="number"
            id="userId"
            className={styles.input}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            min="1"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Item
        </button>
      </form>
    </div>
  );
}