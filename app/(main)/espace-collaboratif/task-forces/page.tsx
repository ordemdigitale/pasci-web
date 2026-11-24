"use client";

import { useEffect, useState } from "react";
import { Users, Crown, Target, Loader2, FolderOpen, FileText } from "lucide-react";

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
  zone?: string | null;
  thematique?: string | null;
  description?: string | null;
  pole_nom?: string | null;
  nb_membres: number;
  nb_personnes: number;
  nb_documents: number;
  membres: Membre[];
}

/** Personne siégeant dans une task force. */
interface Personne {
  id: number;
  task_force_id: number;
  task_force_nom?: string | null;
  titre?: string | null;
  nom: string;
  fonction?: string | null;
  contact?: string | null;
  zone_crasc?: string | null;
  groupes_thematiques?: string | null;
  role?: string | null;
  osc_nom?: string | null;
  est_coordonnateur: boolean;
}

interface DocumentTf {
  id: number;
  task_force_nom?: string | null;
  categorie: string;
  sous_categorie?: string | null;
  titre: string;
  description?: string | null;
  fichier_url?: string | null;
  created_at: string;
}

interface CategorieDoc {
  categorie: string;
  sous_categories: string[];
  nb_documents: number;
}

export default function TaskForcesPage() {
  const [taskForces, setTaskForces] = useState<TaskForce[]>([]);
  const [nationale, setNationale] = useState<Personne[]>([]);
  const [documents, setDocuments] = useState<DocumentTf[]>([]);
  const [arborescence, setArborescence] = useState<CategorieDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = (chemin: string) =>
      fetch(`${API_BASE_URL}/api/v1/forum/${chemin}`).then((r) => (r.ok ? r.json() : []));

    Promise.all([
      api("task-forces"),
      api("task-forces/nationale/membres"),
      api("task-forces/documents?limit=200"),
      api("task-forces/documents/arborescence"),
    ])
      .then(([tf, nat, docs, arb]) => {
        setTaskForces(Array.isArray(tf) ? tf : []);
        setNationale(Array.isArray(nat) ? nat : []);
        setDocuments(Array.isArray(docs) ? docs : []);
        setArborescence(Array.isArray(arb) ? arb : []);
      })
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
            <>
            {/* Task force nationale : composée des coordonnateurs régionaux */}
            {nationale.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-[#2a591d]/20 p-6 mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <div className="size-11 rounded-xl bg-[#2a591d] flex items-center justify-center flex-shrink-0">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">Taskforce nationale</h2>
                    <p className="text-sm text-gray-500">
                      Composée des coordonnateurs des taskforces régionales — {nationale.length} membre(s)
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-2 pr-3 font-semibold text-gray-600">Coordonnateur</th>
                        <th className="text-left py-2 pr-3 font-semibold text-gray-600">Fonction</th>
                        <th className="text-left py-2 pr-3 font-semibold text-gray-600">Taskforce</th>
                        <th className="text-left py-2 font-semibold text-gray-600">Groupes thématiques</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {nationale.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2 pr-3 font-medium text-gray-900">
                            {p.titre ? `${p.titre} ` : ""}{p.nom}
                            {p.osc_nom && <span className="block text-xs text-gray-500">{p.osc_nom}</span>}
                          </td>
                          <td className="py-2 pr-3 text-gray-700">{p.fonction || "—"}</td>
                          <td className="py-2 pr-3 text-gray-700">{p.task_force_nom || "—"}</td>
                          <td className="py-2 text-gray-700">{p.groupes_thematiques || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Espace documentaire PdoC */}
            {arborescence.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <div className="size-11 rounded-xl bg-[#E05017]/10 flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-[#E05017]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">Espace documentaire</h2>
                    <p className="text-sm text-gray-500">
                      {documents.length} document(s) partagé(s) par les taskforces
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {arborescence.map((cat) => {
                    const docsCat = documents.filter((d) => d.categorie === cat.categorie);
                    return (
                      <div key={cat.categorie} className="border border-gray-100 rounded-xl p-4">
                        <p className="font-bold text-gray-900 text-sm mb-1">{cat.categorie}</p>
                        {docsCat.length === 0 ? (
                          <p className="text-xs text-gray-400">
                            {cat.sous_categories.join(" · ")}
                          </p>
                        ) : (
                          <ul className="space-y-1.5">
                            {docsCat.map((doc) => (
                              <li key={doc.id} className="text-sm">
                                {doc.fichier_url ? (
                                  <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer"
                                    className="text-[#2a591d] hover:underline font-medium inline-flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 flex-shrink-0" /> {doc.titre}
                                  </a>
                                ) : (
                                  <span className="text-gray-800 font-medium">{doc.titre}</span>
                                )}
                                <span className="block text-xs text-gray-400">
                                  {doc.sous_categorie ? `${doc.sous_categorie} · ` : ""}
                                  {doc.task_force_nom || "Niveau national"} ·{" "}
                                  {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <h2 className="text-gray-900 font-bold text-2xl mb-4">Taskforces thématiques</h2>
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
                      <p className="text-xs text-gray-500">
                        {tf.zone ? `Zone ${tf.zone}` : ""}
                        {tf.pole_nom ? `${tf.zone ? " · " : ""}Pôle ${tf.pole_nom}` : ""}
                      </p>
                    </div>
                  </div>

                  {tf.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{tf.description}</p>
                  )}

                  <div className="mt-auto">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      {tf.nb_personnes} membre{tf.nb_personnes > 1 ? "s" : ""}
                      {tf.nb_membres > 0 && ` · ${tf.nb_membres} organisation${tf.nb_membres > 1 ? "s" : ""}`}
                      {tf.nb_documents > 0 && ` · ${tf.nb_documents} document${tf.nb_documents > 1 ? "s" : ""}`}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
