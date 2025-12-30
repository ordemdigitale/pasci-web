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
    <div>
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

        {/* Section offres d'emploi */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="">
                  <h4 className="font-bold text-lg mb-2">{job.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{job.description.substring(0, 200)}...</p>
                  <div className="flex flex-row items-center gap-2 text-gray-700 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className='text-sm'>{job.location}</span>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2 text-gray-700 text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span className='inline-block px-3 py-1 rounded-full text-xs text-white bg-[#E05017]'>{job.type}</span>
                  </div>
                </div>
                <Button className="w-full rounded-xl bg-[#E05017] hover:bg-orange-600 text-white mt-6">Postuler</Button>
              </div>
            ))}
          </div>
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
    </div>
  )
}
