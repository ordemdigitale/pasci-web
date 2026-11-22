"use client";

import { useEffect, useState } from "react";
import { Users, Crown, Target, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Membre {
  id: number;
  name: string;
  sigle?: string | null;
  region_nom?: string | null;
  chef_de_file: boolean;
}

interface TaskForce {
  id: number;
  nom: string;
  slug?: string | null;
  thematique?: string | null;
  description?: string | null;
  pole_nom?: string | null;
  nb_membres: number;
  membres: Membre[];
}

export default function TaskForcesPage() {
  const [taskForces, setTaskForces] = useState<TaskForce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/forum/task-forces`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setTaskForces(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white font-poppins min-h-screen">
      {/* En-tête */}
      <div className="bg-[#f8f6f6] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-[#2a591d] font-bold text-3xl sm:text-4xl mb-3">Task forces</h1>
          <p className="text-gray-600 max-w-3xl">
            Groupes d&apos;organisations de la société civile réunies autour d&apos;une thématique
            commune pour mener un travail conjoint au sein de l&apos;espace collaboratif.
          </p>
        </div>
      </div>

      <div className="py-10 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-[#2a591d]" />
            </div>
          ) : taskForces.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-gray-700 mb-1">Aucune task force pour le moment</p>
              <p className="text-sm text-gray-500">
                Les groupes de travail thématiques seront publiés ici dès leur constitution.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {taskForces.map((tf) => (
                <article key={tf.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="size-11 rounded-xl bg-[#2a591d]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[#2a591d]" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-lg text-gray-900">{tf.nom}</h2>
                      {tf.thematique && (
                        <p className="text-sm text-[#E05017] font-semibold flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" /> {tf.thematique}
                        </p>
                      )}
                      {tf.pole_nom && (
                        <p className="text-xs text-gray-500">Pôle {tf.pole_nom}</p>
                      )}
                    </div>
                  </div>

                  {tf.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{tf.description}</p>
                  )}

                  <div className="mt-auto">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      {tf.nb_membres} organisation{tf.nb_membres > 1 ? "s" : ""} membre{tf.nb_membres > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tf.membres.map((m) => (
                        <span
                          key={m.id}
                          title={m.region_nom || undefined}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                            m.chef_de_file
                              ? "bg-[#E05017]/10 text-[#E05017] font-semibold"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {m.chef_de_file && <Crown className="w-3 h-3" />}
                          {m.sigle || m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
