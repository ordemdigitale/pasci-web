"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, Users, Loader2, CheckCircle, AlertTriangle, History } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface OptionCritere {
  valeur: string;
  libelle: string;
  nombre?: number | null;
}

interface CriteresDisponibles {
  crasc: OptionCritere[];
  types_osc: OptionCritere[];
  categories: OptionCritere[];
  regions: OptionCritere[];
  poles: OptionCritere[];
  task_forces: OptionCritere[];
}

interface Destinataire {
  nom: string;
  email: string | null;
  type: string;
  a_un_compte: boolean;
}

interface Apercu {
  total: number;
  avec_email: number;
  avec_compte: number;
  sans_email: number;
  apercu: Destinataire[];
}

interface MessageEnvoye {
  id: number;
  objet: string;
  nb_destinataires: number;
  nb_emails: number;
  nb_notifications: number;
  auteur_nom: string | null;
  created_at: string;
}

const CRITERES_VIDES: CriteresDisponibles = {
  crasc: [], types_osc: [], categories: [], regions: [], poles: [], task_forces: [],
};

export default function MessagesGroupesPage() {
  const [criteres, setCriteres] = useState<CriteresDisponibles>(CRITERES_VIDES);
  const [crascIds, setCrascIds] = useState<string[]>([]);
  const [typeIds, setTypeIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [poleIds, setPoleIds] = useState<string[]>([]);
  const [taskForceIds, setTaskForceIds] = useState<string[]>([]);
  const [toutesLesOsc, setToutesLesOsc] = useState(false);

  const [objet, setObjet] = useState("");
  const [message, setMessage] = useState("");
  const [lien, setLien] = useState("");

  const [apercu, setApercu] = useState<Apercu | null>(null);
  const [chargementApercu, setChargementApercu] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");
  const [historique, setHistorique] = useState<MessageEnvoye[]>([]);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/api/v1/messages/criteres`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CriteresDisponibles | null) => data && setCriteres(data))
      .catch(() => {});
    chargerHistorique();
  }, []);

  function chargerHistorique() {
    fetchWithAuth(`${API_BASE}/api/v1/messages?limit=10`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: MessageEnvoye[]) => Array.isArray(data) && setHistorique(data))
      .catch(() => {});
  }

  const corpsCriteres = useCallback(() => ({
    crasc_ids: crascIds.map(Number),
    type_osc_ids: typeIds.map(Number),
    categories,
    regions,
    pole_ids: poleIds.map(Number),
    task_force_ids: taskForceIds.map(Number),
    toutes_les_osc: toutesLesOsc,
  }), [crascIds, typeIds, categories, regions, poleIds, taskForceIds, toutesLesOsc]);

  const auMoinsUnCritere =
    toutesLesOsc || crascIds.length > 0 || typeIds.length > 0 || categories.length > 0 ||
    regions.length > 0 || poleIds.length > 0 || taskForceIds.length > 0;

  // L'aperçu se recalcule dès qu'un critère change : on sait qui sera touché
  useEffect(() => {
    if (!auMoinsUnCritere) { setApercu(null); return; }
    let annule = false;
    setChargementApercu(true);
    fetchWithAuth(`${API_BASE}/api/v1/messages/destinataires`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpsCriteres()),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Apercu | null) => { if (!annule) setApercu(data); })
      .catch(() => {})
      .finally(() => { if (!annule) setChargementApercu(false); });
    return () => { annule = true; };
  }, [corpsCriteres, auMoinsUnCritere]);

  function basculer(valeur: string, liste: string[], setListe: (v: string[]) => void) {
    setListe(liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur]);
  }

  async function envoyer() {
    setErreur("");
    setConfirmation("");
    if (!objet.trim() || !message.trim()) {
      setErreur("L'objet et le message sont obligatoires.");
      return;
    }
    if (!apercu || apercu.total === 0) {
      setErreur("Aucun destinataire ne correspond à cette sélection.");
      return;
    }
    if (!confirm(`Envoyer ce message à ${apercu.total} destinataire(s) ?`)) return;

    setEnvoiEnCours(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objet: objet.trim(),
          message: message.trim(),
          lien: lien.trim() || null,
          criteres: corpsCriteres(),
        }),
      });
      if (res.ok) {
        const data: MessageEnvoye = await res.json();
        setConfirmation(
          `Message envoyé : ${data.nb_emails} email(s) et ${data.nb_notifications} notification(s) pour ${data.nb_destinataires} destinataire(s).`
        );
        setObjet(""); setMessage(""); setLien("");
        chargerHistorique();
      } else {
        const corps = await res.json().catch(() => null);
        setErreur(typeof corps?.detail === "string" ? corps.detail : "L'envoi a échoué.");
      }
    } finally {
      setEnvoiEnCours(false);
    }
  }

  const GroupeCases = ({
    titre, options, selection, setSelection, desactive,
  }: {
    titre: string;
    options: OptionCritere[];
    selection: string[];
    setSelection: (v: string[]) => void;
    desactive?: boolean;
  }) => (
    <div className={desactive ? "opacity-40 pointer-events-none" : ""}>
      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{titre}</p>
      {options.length === 0 ? (
        <p className="text-xs text-gray-400">Aucune valeur disponible.</p>
      ) : (
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          {options.map((o) => (
            <label key={o.valeur} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5">
              <input
                type="checkbox"
                checked={selection.includes(o.valeur)}
                onChange={() => basculer(o.valeur, selection, setSelection)}
                className="accent-[#E05017]"
              />
              <span className="flex-1">{o.libelle}</span>
              {o.nombre != null && <span className="text-xs text-gray-400">{o.nombre}</span>}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 font-poppins">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#E05017]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Send className="w-5 h-5 text-[#E05017]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Message groupé</h1>
          <p className="text-sm text-gray-500">
            Email et notification dans la plateforme, à une sélection d&apos;OSC ou de PTF
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Destinataires */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[#2A591D]" />
            <h2 className="font-bold text-gray-900">Destinataires</h2>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 p-3 rounded-xl border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={toutesLesOsc}
              onChange={(e) => setToutesLesOsc(e.target.checked)}
              className="accent-[#E05017]"
            />
            Toutes les OSC publiées de la plateforme
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <GroupeCases titre="CRASC" options={criteres.crasc} selection={crascIds} setSelection={setCrascIds} desactive={toutesLesOsc} />
            <GroupeCases titre="Type d'OSC" options={criteres.types_osc} selection={typeIds} setSelection={setTypeIds} desactive={toutesLesOsc} />
            <GroupeCases titre="Catégorie d'OSC" options={criteres.categories} selection={categories} setSelection={setCategories} desactive={toutesLesOsc} />
            <GroupeCases titre="Région" options={criteres.regions} selection={regions} setSelection={setRegions} desactive={toutesLesOsc} />
            <GroupeCases titre="Pôle de concertation" options={criteres.poles} selection={poleIds} setSelection={setPoleIds} desactive={toutesLesOsc} />
            <GroupeCases titre="Task force (PTF)" options={criteres.task_forces} selection={taskForceIds} setSelection={setTaskForceIds} />
          </div>

          <p className="text-xs text-gray-500 mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3">
            Les critères OSC se combinent : cocher « CRASC Nord » et « Organisation de femmes »
            vise les organisations de femmes du CRASC Nord. Les task forces ajoutent les PTF membres.
          </p>
        </div>

        {/* Aperçu */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-3">Qui va recevoir ?</h2>
          {!auMoinsUnCritere ? (
            <p className="text-sm text-gray-500">Sélectionnez au moins un critère.</p>
          ) : chargementApercu ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Calcul…
            </div>
          ) : apercu ? (
            <>
              <p className="text-3xl font-bold text-[#E05017]">{apercu.total}</p>
              <p className="text-xs text-gray-500 mb-3">destinataire(s)</p>
              <ul className="text-sm text-gray-700 space-y-1 mb-3">
                <li>{apercu.avec_email} recevront un email</li>
                <li>{apercu.avec_compte} verront la notification dans la plateforme</li>
                {apercu.sans_email > 0 && (
                  <li className="text-amber-700 flex items-start gap-1">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {apercu.sans_email} sans adresse email enregistrée
                  </li>
                )}
              </ul>
              {apercu.apercu.length > 0 && (
                <div className="border-t border-gray-100 pt-2 max-h-40 overflow-y-auto">
                  {apercu.apercu.map((d, i) => (
                    <p key={i} className="text-xs text-gray-600 truncate">
                      {d.nom}{d.email ? ` — ${d.email}` : " — sans email"}
                    </p>
                  ))}
                  {apercu.total > apercu.apercu.length && (
                    <p className="text-xs text-gray-400 mt-1">… et {apercu.total - apercu.apercu.length} autre(s)</p>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Message */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mt-5">
        <h2 className="font-bold text-gray-900 mb-3">Message</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={objet}
            onChange={(e) => setObjet(e.target.value)}
            placeholder="Objet du message"
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder="Contenu du message…"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-y"
          />
          <input
            type="url"
            value={lien}
            onChange={(e) => setLien(e.target.value)}
            placeholder="Lien à inclure (facultatif) — https://…"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
          />

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          {confirmation && (
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {confirmation}
            </p>
          )}

          <div className="flex justify-end">
            <button
              onClick={envoyer}
              disabled={envoiEnCours || !auMoinsUnCritere || !objet.trim() || !message.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E05017] text-white text-sm font-semibold rounded-xl hover:bg-[#c7450f] disabled:opacity-40 transition-colors"
            >
              {envoiEnCours ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Envoyer{apercu ? ` à ${apercu.total} destinataire(s)` : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Historique des envois */}
      {historique.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-gray-500" />
            <h2 className="font-bold text-gray-900">Derniers envois</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {historique.map((m) => (
              <div key={m.id} className="py-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{m.objet}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(m.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {m.auteur_nom ? ` — ${m.auteur_nom}` : ""}
                  </p>
                </div>
                <p className="text-xs text-gray-600 whitespace-nowrap">
                  {m.nb_destinataires} dest. · {m.nb_emails} email(s)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
