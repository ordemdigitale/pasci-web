import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  MapPin
} from "lucide-react";

interface IJobs {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  is_expired: boolean;
  publication_date: string;
}

export default async function AdminOffresEmploi() {
  const response = await fetch("http://localhost:8000/api/v1/jobs/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const jobs: IJobs[] = await response.json();

  console.log("Jobs fetched from API into Admin Offres emploi: ", jobs);
  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="mb-4">
        <Link href="/admin" className="hover:underline text-sm text-blue-600">
          ← Aller au tableau de bord
        </Link>
      </div>
      <div className="flex items-center justify-between">
      </div>
      <div className="max-w-5xl mx-auto">
        {/* Header with Title and Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Toutes les offres d'emploi
          </h2>
          <Link
            href="/admin/espace-collaboratif/offres-emploi/ajouter"
            className="px-4 py-2 border border-[#2a591d] text-[#2a591d] hover:text-white font-semibold rounded-xl hover:bg-[#2a591d]"
          >
            Nouvelle offre d'emploi
          </Link>
        </div>

        {/* Table of Jobs */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Titre</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Localisation</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Type de contrat</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Date de publication</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Validité</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200 text-sm">{job.title}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm">{job.description.substring(0, 100)}...</td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm">{job.location}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm">{job.type}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm">{job.publication_date}</td>
                <td className={`py-2 px-4 border-b border-gray-200 text-sm font-semibold ${job.is_expired ? 'text-red-600' : 'text-green-600'}`}>
                  <span className="bg-">{job.is_expired ? "Expirée" : "Valide"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
