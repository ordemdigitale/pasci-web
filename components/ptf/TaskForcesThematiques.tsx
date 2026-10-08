"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Crown, Users } from "lucide-react";
import { fetchTaskForces, type TaskForce } from "@/lib/ptf-classification";

const URL_PTF = "/annuaire/annuaire-des-partenaires-techniques-et-financiers";

/** Task forces thématiques : groupes de PTF travaillant sur une même thématique. */
export default function TaskForcesThematiques({ ptfId, titre = "Task forces thématiques" }: { ptfId?: number; titre?: string }) {
  const [taskForces, setTaskForces] = useState<TaskForce[]>([]);

  useEffect(() => {
    let actif = true;
    fetchTaskForces(ptfId ? `?ptf_id=${ptfId}` : "").then((data) => {
      if (actif) setTaskForces(data);
    });
    return () => {
      actif = false;
    };
  }, [ptfId]);

  if (taskForces.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Users className="w-6 h-6 text-[#2a591d]" /> {titre}
      </h2>
      {!ptfId && (
        <p className="text-gray-600 mb-6">Groupes de partenaires qui coordonnent leurs appuis sur une même thématique.</p>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {taskForces.map((tf) => (
          <div key={tf.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <span className="inline-block mb-2 px-2 py-0.5 text-xs font-bold bg-[#E05017]/10 text-[#E05017] rounded-full">{tf.thematique}</span>
            <h3 className="font-bold text-lg text-gray-900">{tf.nom}</h3>
            {tf.description && <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{tf.description}</p>}
            {tf.membres.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {tf.membres.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={m.slug ? `${URL_PTF}/${m.slug}` : URL_PTF}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#2a591d]/40 text-sm text-gray-800"
                      title={m.chef_de_file ? "Chef de file" : undefined}
                    >
                      {m.thumbnail_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={m.thumbnail_url} alt="" className="w-5 h-5 object-contain" />
                      ) : (
                        <Building2 className="w-4 h-4 text-gray-400" />
                      )}
                      {m.name}
                      {m.chef_de_file && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
