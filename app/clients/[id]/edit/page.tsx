"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./editClient.module.css";

type UserFormData = {
  name?: string | null;
  email?: string;
};

export default function EditClientPage() {
  const [formData, setFormData] = useState<UserFormData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // 1. Fetch current user data to pre-fill the form
  useEffect(() => {
    if (!id) return;
    async function fetchUser() {
      try {
        setLoading(true);
        // Use environment variable for the GET request
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/users/${id}`);

        if (!res.ok) {
          if (res.status === 404)
            throw new Error("Client not found in database");
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        setFormData({
          name: data.name,
          email: data.email,
        });
      } catch (err: any) {
        console.error(err);
        // THE FIX: Stop masking the error! Show the real reason it failed.
        setError(
          err instanceof Error
            ? err.message
            : "Network error: Is the backend running?",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Use environment variable for the PATCH request
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update client");
      }

      router.push("/clients?status=updated");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading form...</p>;

  return (
    <div className={styles.container}>
      <h1>Edit Client: {formData.name || formData.email}</h1>

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
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
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