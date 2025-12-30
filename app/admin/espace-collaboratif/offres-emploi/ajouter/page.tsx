'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function AdminCreateJobPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/jobs/', { // Your FastAPI URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, location, type }),
      });

      if (response.ok) {
        alert('Job created successfully!');
        router.push('/admin/espace-collaboratif/offres-emploi'); // Redirect to job list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || 'Failed to create job'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Job Title</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            required
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Job Location</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <input
            required
            className="w-full border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Création...' : 'Valider'}
        </button>
      </form>
    </div>
  )
}