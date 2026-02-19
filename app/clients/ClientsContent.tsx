"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./clientsPage.module.css";

type User = {
  id: number;
  name: string | null;
  email: string;
};

export default function ClientsContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "updated") {
      setStatusMessage("Client updated successfully!");
    }
    if (status === "deleted") {
      setStatusMessage("Client deleted successfully!");
    }
    if (status) {
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, [searchParams]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/users?page=${currentPage}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.data || data || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error(error);
      setStatusMessage("Error: Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setStatusMessage("Client deleted successfully!");
      setTimeout(() => setStatusMessage(""), 3000);

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Error: Failed to delete client.");
    }
  };

  const handleNextPage = () => setCurrentPage((p) => p + 1);
  const handlePrevPage = () => setCurrentPage((p) => p - 1);

  if (loading && users.length === 0) return <p>Loading clients...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Clients (sellers)</h2>

      {statusMessage && <div className={styles.statusMessage}>{statusMessage}</div>}

      {loading && <p>Loading...</p>}

      <table className={styles.clientsTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name || "N/A"}</td>
                <td>{user.email}</td>
                <td className={styles.actions}>
                  <Link href={`/clients/${user.id}/edit`} className={styles.buttonEdit}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(user.id)} className={styles.buttonDelete}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

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
