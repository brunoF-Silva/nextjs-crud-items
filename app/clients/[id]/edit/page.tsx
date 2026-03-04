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
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/users/${id}`);

        if (!res.ok) throw new Error("Client not found");
        const data = await res.json();
        setFormData({
          name: data.name,
          email: data.email,
        });
      } catch (err) {
        setError("Failed to load client data.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  // 2. Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
