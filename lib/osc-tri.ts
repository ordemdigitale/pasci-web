// lib/osc-tri.ts | Tri des OSC sur tous les champs du questionnaire (clés acceptées par GET /crasc/osc?sort_by=)

export interface ChampTri {
  value: string;
  label: string;
}

export const GROUPES_TRI_OSC: { groupe: string; champs: ChampTri[] }[] = [
  {
    groupe: "Fiche",
    champs: [
      { value: "updated_at", label: "Date de dernière mise à jour" },
      { value: "created_at", label: "Date d'enregistrement" },
      { value: "score_autoevaluation", label: "Score de notation (/20)" },
    ],
  },
  {
    groupe: "Identification",
    champs: [
      { value: "name", label: "Nom" },
      { value: "sigle", label: "Sigle" },
      { value: "description", label: "Description" },
      { value: "categorie", label: "Catégorie d'organisation (OdF, OdJ, OPSH…)" },
      { value: "niveau_regroupement", label: "Niveau de regroupement (faîtière)" },
      { value: "reseau_appartenance", label: "Réseau d'appartenance" },
      { value: "origine_organisation", label: "Origine de l'organisation" },
      { value: "date_creation", label: "Date de création" },
      { value: "numero_recepisse", label: "N° de récépissé" },
    ],
  },
  {
    groupe: "Localisation et couverture",
    champs: [
      { value: "region_nom", label: "Région" },
      { value: "departement", label: "Département" },
      { value: "sous_prefecture", label: "Sous-préfecture" },
      { value: "ville", label: "Ville" },
      { value: "address", label: "Adresse" },
      { value: "niveau_couverture", label: "Niveau de couverture" },
      { value: "zone_couverture", label: "Zone de couverture" },
      { value: "pays_couverture", label: "Pays de couverture" },
    ],
  },
  {
    groupe: "Contacts",
    champs: [
      { value: "email", label: "Email" },
      { value: "phone", label: "Téléphone" },
      { value: "contact_president", label: "Contact du président" },
      { value: "contact_osc", label: "Contact de l'OSC" },
      { value: "contact_1", label: "Contact 1" },
      { value: "contact_2", label: "Contact 2" },
      { value: "website", label: "Site web" },
      { value: "reseaux_sociaux", label: "Réseaux sociaux" },
    ],
  },
  {
    groupe: "Thématiques",
    champs: [
      { value: "domaine_prioritaire", label: "1er domaine prioritaire" },
      { value: "domaine_prioritaire_2", label: "2e domaine prioritaire" },
      { value: "domaine_prioritaire_3", label: "3e domaine prioritaire" },
      { value: "domaine_prioritaire_4", label: "4e domaine prioritaire" },
      { value: "domaine_prioritaire_5", label: "5e domaine prioritaire" },
      { value: "axe", label: "Axe d'intervention" },
      { value: "specialites", label: "Spécialités" },
      { value: "secteurs_activites", label: "Secteurs d'activités" },
      { value: "populations_cibles", label: "Populations cibles" },
      { value: "savoir_faire", label: "Savoir-faire" },
    ],
  },
  {
    groupe: "Formalisation et organisation",
    champs: [
      { value: "type_document_formalisation", label: "Type de document de formalisation" },
      { value: "document_formalisation", label: "Justificatif de formalisation" },
      { value: "existence_siege", label: "Existence d'un siège" },
      { value: "manuel_procedures", label: "Manuel de procédures" },
      { value: "plan_action", label: "Plan d'action" },
      { value: "plan_action_annee_cours", label: "Plan d'action de l'année en cours" },
      { value: "rapports_annuels", label: "Rapports annuels" },
      { value: "adhesion_crasc", label: "Adhésion au CRASC" },
      { value: "adhesion_crasc_statut", label: "Statut d'adhésion au CRASC" },
      { value: "organes_gouvernance", label: "Organes de gouvernance" },
    ],
  },
  {
    groupe: "Gouvernance",
    champs: [
      { value: "nom_president", label: "Nom du président" },
      { value: "sexe_president", label: "Sexe du président" },
      { value: "mode_designation_president", label: "Mode de désignation du président" },
      { value: "date_designation_responsable", label: "Date de désignation du responsable" },
      { value: "date_prochaine_designation", label: "Date de la prochaine désignation" },
      { value: "duree_mandat_be", label: "Durée du mandat du bureau" },
      { value: "nombre_mandats_be", label: "Nombre de mandats du bureau" },
      { value: "nb_membres_be", label: "Membres du bureau exécutif" },
    ],
  },
  {
    groupe: "Effectifs",
    champs: [
      { value: "nb_membres", label: "Nombre de membres" },
      { value: "nb_femmes_membres", label: "Femmes membres" },
      { value: "nb_hommes_membres", label: "Hommes membres" },
      { value: "nb_membres_jeunes", label: "Jeunes membres" },
      { value: "nb_membres_handicap", label: "Membres en situation de handicap" },
      { value: "nb_personnes_engagees", label: "Personnes engagées" },
      { value: "nb_cdi", label: "Salariés en CDI" },
      { value: "nb_cdd", label: "Salariés en CDD" },
    ],
  },
  {
    groupe: "Bénéficiaires",
    champs: [
      { value: "nb_beneficiaires", label: "Nombre de bénéficiaires" },
      { value: "nb_femmes_beneficiaires", label: "Femmes bénéficiaires" },
      { value: "nb_jeunes_beneficiaires", label: "Jeunes bénéficiaires" },
      { value: "nb_beneficiaires_handicap", label: "Bénéficiaires en situation de handicap" },
    ],
  },
  {
    groupe: "Activités",
    champs: [
      { value: "nb_activites", label: "Nombre d'activités" },
      { value: "date_derniere_activite", label: "Date de la dernière activité" },
      { value: "plan_action_annee_cours_details", label: "Détails du plan d'action" },
      { value: "difficultes", label: "Difficultés" },
      { value: "recommandations", label: "Recommandations" },
      { value: "recommandations_2", label: "Recommandations (2)" },
    ],
  },
  {
    groupe: "Financement",
    champs: [
      { value: "budget_annuel", label: "Budget annuel" },
      { value: "type_financement", label: "Type de financement" },
      { value: "etat_cotisations", label: "État des cotisations" },
      { value: "montant_cotisation", label: "Montant de la cotisation" },
      { value: "financement_cotisation", label: "Financement : cotisations" },
      { value: "financement_dons", label: "Financement : dons" },
      { value: "financement_legs", label: "Financement : legs" },
      { value: "financement_collectivites", label: "Financement : collectivités" },
      { value: "financement_fonds_propres", label: "Financement : fonds propres" },
      { value: "financement_ong_intl", label: "Financement : ONG internationales" },
      { value: "financement_multilateral", label: "Financement : multilatéral" },
    ],
  },
];

export const CHAMPS_TRI_OSC: ChampTri[] = GROUPES_TRI_OSC.flatMap((g) => g.champs);

export const libelleChampTri = (value: string) => CHAMPS_TRI_OSC.find((c) => c.value === value)?.label || value;

/** Valeur lisible d'un champ trié, affichée dans la liste pour voir l'ordre appliqué. */
export function valeurChamp(osc: Record<string, unknown>, champ: string): string {
  if (champ === "document_formalisation") return osc.document_formalisation_url ? "Fourni" : "—";
  const v = osc[champ];
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Oui" : "Non";
  if (champ === "created_at" || champ === "updated_at") {
    const d = new Date(String(v));
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString("fr-FR");
  }
  if (typeof v === "number") return v.toLocaleString("fr-FR");
  const texte = String(v);
  return texte.length > 60 ? `${texte.slice(0, 60)}…` : texte;
}

// ── Demandes d'adhésion (réponses brutes au questionnaire, GET /adhesion?sort_by=) ──

/** Champs propres aux demandes ou nommés autrement que sur la fiche OSC. */
const RENOMMAGE_DEMANDE: Record<string, string> = { name: "nom_organisation", region_nom: "region", phone: "telephone" };
const CHAMPS_DEMANDE = new Set([
  "adhesion_crasc_statut", "axe", "categorie", "contact_1", "contact_2", "contact_osc", "contact_president", "crasc_nom",
  "created_at", "date_derniere_activite", "date_designation_responsable", "date_prochaine_designation", "departement",
  "description", "domaine_prioritaire", "domaine_prioritaire_2", "domaine_prioritaire_3", "domaine_prioritaire_4",
  "domaine_prioritaire_5", "duree_mandat_be", "email", "existence_siege", "manuel_procedures", "motivation",
  "nb_activites", "nb_beneficiaires", "nb_beneficiaires_handicap", "nb_cdd", "nb_cdi", "nb_femmes_beneficiaires",
  "nb_femmes_membres", "nb_hommes_membres", "nb_jeunes_beneficiaires", "nb_membres", "nb_membres_be",
  "nb_membres_handicap", "nb_membres_jeunes", "nb_personnes_engagees", "niveau_regroupement", "nom_organisation",
  "nombre_mandats_be", "note_admin", "organes_gouvernance", "origine_organisation", "pays_couverture", "plan_action",
  "plan_action_annee_cours", "plan_action_annee_cours_details", "rapports_annuels", "recommandations",
  "recommandations_2", "region", "sigle", "sous_prefecture", "specialites", "statut", "telephone",
  "type_document_formalisation", "type_organisation", "type_osc", "updated_at", "ville",
]);

export const GROUPES_TRI_DEMANDES: { groupe: string; champs: ChampTri[] }[] = [
  {
    groupe: "Demande",
    champs: [
      { value: "created_at", label: "Date de la demande" },
      { value: "updated_at", label: "Date de dernière modification" },
      { value: "statut", label: "Statut" },
      { value: "crasc_nom", label: "CRASC" },
      { value: "type_organisation", label: "Type d'organisation" },
      { value: "type_osc", label: "Forme juridique (type d'OSC)" },
      { value: "motivation", label: "Motivation" },
      { value: "note_admin", label: "Note de l'administration" },
    ],
  },
  ...GROUPES_TRI_OSC.filter((g) => g.groupe !== "Fiche").map(({ groupe, champs }) => ({
    groupe,
    champs: champs
      .map((c) => ({ ...c, value: RENOMMAGE_DEMANDE[c.value] || c.value }))
      .filter((c) => CHAMPS_DEMANDE.has(c.value)),
  })).filter((g) => g.champs.length > 0),
];

export const libelleChampTriDemande = (value: string) =>
  GROUPES_TRI_DEMANDES.flatMap((g) => g.champs).find((c) => c.value === value)?.label || value;
