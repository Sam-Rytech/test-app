"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteTestButton({ testId }: { testId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this test? This action cannot be undone and will delete all associated employee results.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/tests/${testId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete test");
      router.refresh(); // Refresh the server component to fetch new data
    } catch (error) {
      console.error(error);
      alert("Error deleting test.");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="btn btn-danger" 
      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
      disabled={loading}
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
