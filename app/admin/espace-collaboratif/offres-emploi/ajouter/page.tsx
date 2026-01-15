'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import Link from 'next/link';

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
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="mb-4">
        <Link href="/admin/espace-collaboratif/offres-emploi" className="hover:underline text-sm text-blue-600">
          ← Retour aux offres d'emploi
        </Link>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Ajouter une offre d'emploi</h2>
      
      {/* le formulaire */}
        <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Intitulé du poste</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Lieu</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Type de contrat</label>
            <input
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {loading ? 'Ajout en cours...' : 'Valider'}
          </button>
        </form>
    </section>
  )
}