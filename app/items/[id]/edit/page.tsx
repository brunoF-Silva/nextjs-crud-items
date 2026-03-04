"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./editPage.module.css";

type ItemFormData = {
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  image?: string;
  price?: number;
  promoPrice?: number | null;
};

export default function EditItemPage() {
  const [formData, setFormData] = useState<ItemFormData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // 1. Fetch current item data to pre-fill the form
  useEffect(() => {
    if (!id) return;
    async function fetchItem() {
      try {
        setLoading(true);
        // Use environment variable for the GET request
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/items/${id}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error("Item not found in database");
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        setFormData({
          name: data.name,
          shortDescription: data.shortDescription,
          longDescription: data.longDescription,
          image: data.image,
          price: parseFloat(data.price),
          promoPrice: data.promoPrice ? parseFloat(data.promoPrice) : null,
        });
      } catch (err: any) {
        console.error(err);
        // Stop masking the error so you can see what actually failed
        setError(
          err instanceof Error
            ? err.message
            : "Network error: Is the backend running?",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  // 2. Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // 3. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Use environment variable for the PATCH request
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      // Success! Redirect back to the details page with a status message
      router.push(`/items/${id}?status=updated`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading form...</p>;

  return (
    <div className={styles.container}>
      <h1>Edit Item: {formData.name}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="shortDescription">Short Description</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription || ""}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="longDescription">Long Description</label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription || ""}
            onChange={handleChange}
            rows={6}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.priceGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              value={formData.price || 0}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="promoPrice">Promo Price (optional)</label>
            <input
              type="number"
              id="promoPrice"
              name="promoPrice"
              step="0.01"
              value={formData.promoPrice || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={styles.submitButton}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
