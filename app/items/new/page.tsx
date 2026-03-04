"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateItem.module.css";

export default function CreateItemPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [userId, setUserId] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    const itemData = {
      name,
      shortDescription,
      longDescription,
      image,
      price: parseFloat(price),
      userId: parseInt(userId, 10),
      ...(promoPrice && { promoPrice: parseFloat(promoPrice) }),
    };

    try {
      // Use the environment variable for the POST request
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Fallback to a generic message if the backend doesn't provide an array of messages
        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message || "Failed to create item";

        throw new Error(errorMessage);
      }

      const newItem = await response.json();
      console.log("Item created successfully:", newItem);
      alert("Item created successfully!");
      router.push("/?status=created");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Create a New Item</h1>

      <div className={styles.instruction} role="note" aria-live="polite">
        <strong>Please use free images from </strong>
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
        <strong> only.</strong>
        <div>
          For the best results, open the image on Unsplash and copy its image
          address (right-click the image → "Copy image address").
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorBanner}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Item Name
          </label>
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
          <label htmlFor="shortDescription" className={styles.label}>
            Short Description
          </label>
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
          <label htmlFor="longDescription" className={styles.label}>
            Long Description
          </label>
          <textarea
            id="longDescription"
            className={styles.textarea}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            Image URL
          </label>
          <input
            type="text"
            id="image"
            className={styles.input}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <div className={styles.priceGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Price
            </label>
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
            <label htmlFor="promoPrice" className={styles.label}>
              Promotional Price (Optional)
            </label>
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
          <label htmlFor="userId" className={styles.label}>
            User ID
          </label>
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
