// OSC registration form
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { fetchAllCrasc, ICrasc } from '@/lib/fetch-crasc';
import {
  FORMALISATION_FILE_ACCEPT,
  FORMALISATION_FILE_MAX_SIZE,
  isFormalisationFileAccepted,
} from '@/lib/formalisation-file';
import { DOMAINE_PRIORITAIRE_OPTIONS } from '@/lib/osc-domaines';

const supportingDocumentSchema = z
  .instanceof(File)
  .optional()
  .refine(
    (file) => !file || file.size <= FORMALISATION_FILE_MAX_SIZE,
    'Le fichier ne doit pas dépasser 10 Mo'
  )
  .refine(
    isFormalisationFileAccepted,
    'Format invalide. Formats acceptés : PDF, DOC, DOCX, JPG, PNG ou WEBP'
  );

const registrationSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'Le nom de l\'organisation est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  sigle: z.string().optional(),
  crascNom: z.string().min(1, 'Sélectionnez un CRASC'),
  typeOsc: z.string().min(1, 'Sélectionnez un type d\'OSC'),
  region: z.string().min(1, 'Sélectionnez une région'),
  departement: z.string().optional(),
  sousPrefecture: z.string().optional(),
  city: z.string().optional(),
  origineOrganisation: z.string().optional(),
  email: z
    .string()
    .email('Veuillez entrer une adresse email valide')
    .min(1, 'L\'email est requis'),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^[+\d\s\-()]+$/, 'Veuillez entrer un numéro de téléphone valide'),
  description: z.string().optional(),
  motivation: z
    .string()
    .min(1, 'Veuillez expliquer votre motivation')
    .min(10, 'La motivation doit contenir au moins 10 caractères'),
  typeDocumentFormalisation: z.string().optional(),
  documentFormalisationFile: supportingDocumentSchema,
  existenceSiege: z.string().optional(),
  categorie: z.string().optional(),
  niveauRegroupement: z.string().optional(),
  domainePrioritaire: z.string().optional(),
  domainePrioritaire2: z.string().optional(),
  domainePrioritaire3: z.string().optional(),
  domainePrioritaire4: z.string().optional(),
  domainePrioritaire5: z.string().optional(),
  nbMembres: z.string().optional(),
  nbFemmesMembres: z.string().optional(),
  nbHommesMembres: z.string().optional(),
  nbMembresJeunes: z.string().optional(),
  nbMembresHandicap: z.string().optional(),
  nbMembresBe: z.string().optional(),
  nombreMandatsBe: z.string().optional(),
  dureeMandatBe: z.string().optional(),
  nbBeneficiaires: z.string().optional(),
  nbFemmesBeneficiaires: z.string().optional(),
  nbJeunesBeneficiaires: z.string().optional(),
  nbBeneficiairesHandicap: z.string().optional(),
  adhesionCrascStatut: z.string().optional(),
  organesGouvernance: z.string().optional(),
  paysCouverture: z.string().optional(),
  nbPersonnesEngagees: z.string().optional(),
  nbCdi: z.string().optional(),
  nbCdd: z.string().optional(),
  dateDesignationResponsable: z.string().optional(),
  dateProchaineDesignation: z.string().optional(),
  manuelProcedures: z.string().optional(),
  planActionAnneeCours: z.string().optional(),
  planActionAnneeCoursDetails: z.string().optional(),
  planAction: z.string().optional(),
  planActionDocumentFile: supportingDocumentSchema,
  nbActivites: z.string().optional(),
  dateDerniereActivite: z.string().optional(),
  rapportsAnnuels: z.string().optional(),
  rapportsAnnuelsDocumentFile: supportingDocumentSchema,
  adhesionCrascDocumentFile: supportingDocumentSchema,
  recommandations: z.string().optional(),
  recommandations2: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type FileFieldName =
  | 'documentFormalisationFile'
  | 'planActionDocumentFile'
  | 'rapportsAnnuelsDocumentFile'
  | 'adhesionCrascDocumentFile';
type TextFieldName = Exclude<keyof RegistrationFormValues, FileFieldName>;

const TYPE_OSC_OPTIONS = [
  { value: 'Association', label: 'Association' },
  { value: 'Fondation', label: 'Fondation' },
  { value: 'Organisation cultuelle', label: 'Organisation cultuelle' },
  { value: 'ONG', label: 'ONG' },
];

const ORIGINE_OPTIONS = [
  { value: 'cote_ivoire', label: "Côte d'Ivoire" },
  { value: 'etranger', label: "À l'étranger" },
];

const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'Oui' },
  { value: 'false', label: 'Non' },
];

const FORMALISATION_OPTIONS = [
  { value: 'statuts_reglement', label: 'Statut et règlement intérieur' },
  { value: 'recepisse_depot', label: 'Récépissé de dépôt' },
  { value: 'recepisse_declaration', label: 'Récépissé de déclaration' },
  { value: 'agrement_decret', label: 'Agrément / décret' },
  { value: 'journal_officiel', label: "Déclaration Journal Officiel de la République de Côte d'Ivoire" },
];

const CATEGORIE_OPTIONS = [
  { value: 'organisation_jeune', label: 'Organisation de jeune (ODJ)' },
  { value: 'organisation_femme', label: 'Organisation de femme' },
  { value: 'organisation_mixte', label: 'Organisation mixte' },
];

const NIVEAU_REGROUPEMENT_OPTIONS = [
  { value: 'Simple', label: 'Simple' },
  { value: 'Réseau', label: 'Réseau' },
  { value: 'Fédération', label: 'Fédération' },
  { value: 'Plateforme', label: 'Plateforme' },
  { value: 'Confédération', label: 'Confédération' },
];

const ADHESION_CRASC_OPTIONS = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'en_cours', label: 'En cours' },
];

const REGIONS = [
  { value: 'District Autonome d\'Abidjan', label: 'District Autonome d\'Abidjan' },
  { value: 'District Autonome de Yamoussoukro', label: 'District Autonome de Yamoussoukro' },
  { value: 'Agnéby-Tiassa', label: 'Agnéby-Tiassa' },
  { value: 'Bafing', label: 'Bafing' },
  { value: 'Bagoué', label: 'Bagoué' },
  { value: 'Béré', label: 'Béré' },
  { value: 'Bélier', label: 'Bélier' },
  { value: 'Bounkani', label: 'Bounkani' },
  { value: 'Cavally', label: 'Cavally' },
  { value: 'Folon', label: 'Folon' },
  { value: 'Gbêkê', label: 'Gbêkê' },
  { value: 'Gbôklé', label: 'Gbôklé' },
  { value: 'Gôh', label: 'Gôh' },
  { value: 'Gontougo', label: 'Gontougo' },
  { value: 'Grands-Ponts', label: 'Grands-Ponts' },
  { value: 'Guémon', label: 'Guémon' },
  { value: 'Hambol', label: 'Hambol' },
  { value: 'Haut-Sassandra', label: 'Haut-Sassandra' },
  { value: 'Iffou', label: 'Iffou' },
  { value: 'Indénié-Djuablin', label: 'Indénié-Djuablin' },
  { value: 'Kabadougou', label: 'Kabadougou' },
  { value: 'La Mé', label: 'La Mé' },
  { value: 'Loh-Djiboua', label: 'Loh-Djiboua' },
  { value: 'Marahoué', label: 'Marahoué' },
  { value: 'Moronou', label: 'Moronou' },
  { value: 'Nawa', label: 'Nawa' },
  { value: 'N\'Zi', label: 'N\'Zi' },
  { value: 'Poro', label: 'Poro' },
  { value: 'San-Pédro', label: 'San-Pédro' },
  { value: 'Sud-Comoé', label: 'Sud-Comoé' },
  { value: 'Tchologo', label: 'Tchologo' },
  { value: 'Tonkpi', label: 'Tonkpi' },
  { value: 'Worodougou', label: 'Worodougou' },
];

const toBool = (value?: string) => value === 'true' ? true : value === 'false' ? false : null;
const toNumber = (value?: string) => {
  if (!value || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const emptyToNull = (value?: string) => {
  if (!value || value.trim() === '') return null;
  return value.trim();
};

export default function PageRejoindre() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crascs, setCrascs] = useState<ICrasc[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    fetchAllCrasc().then(setCrascs).catch(() => {});
  }, []);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: '',
      sigle: '',
      crascNom: '',
      typeOsc: '',
      region: '',
      departement: '',
      sousPrefecture: '',
      city: '',
      origineOrganisation: '',
      email: '',
      phone: '',
      description: '',
      motivation: '',
      typeDocumentFormalisation: '',
      documentFormalisationFile: undefined,
      existenceSiege: '',
      categorie: '',
      niveauRegroupement: '',
      domainePrioritaire: '',
      domainePrioritaire2: '',
      domainePrioritaire3: '',
      domainePrioritaire4: '',
      domainePrioritaire5: '',
      nbMembres: '',
      nbFemmesMembres: '',
      nbHommesMembres: '',
      nbMembresJeunes: '',
      nbMembresHandicap: '',
      nbMembresBe: '',
      nombreMandatsBe: '',
      dureeMandatBe: '',
      nbBeneficiaires: '',
      nbFemmesBeneficiaires: '',
      nbJeunesBeneficiaires: '',
      nbBeneficiairesHandicap: '',
      adhesionCrascStatut: '',
      organesGouvernance: '',
      paysCouverture: '',
      nbPersonnesEngagees: '',
      nbCdi: '',
      nbCdd: '',
      dateDesignationResponsable: '',
      dateProchaineDesignation: '',
      manuelProcedures: '',
      planActionAnneeCours: '',
      planActionAnneeCoursDetails: '',
      planAction: '',
      planActionDocumentFile: undefined,
      nbActivites: '',
      dateDerniereActivite: '',
      rapportsAnnuels: '',
      rapportsAnnuelsDocumentFile: undefined,
      adhesionCrascDocumentFile: undefined,
      recommandations: '',
      recommandations2: '',
    },
  });

  async function onSubmit(values: RegistrationFormValues) {
    try {
      setIsSubmitting(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const payload = {
        nom_organisation: values.organizationName,
        sigle: emptyToNull(values.sigle),
        type_organisation: values.typeOsc,
        crasc_nom: values.crascNom,
        type_osc: values.typeOsc,
        region: values.region,
        departement: emptyToNull(values.departement),
        sous_prefecture: emptyToNull(values.sousPrefecture),
        ville: values.city || null,
        origine_organisation: emptyToNull(values.origineOrganisation),
        email: values.email,
        telephone: values.phone,
        description: values.description || null,
        motivation: values.motivation,
        type_document_formalisation: emptyToNull(values.typeDocumentFormalisation),
        existence_siege: toBool(values.existenceSiege),
        categorie: emptyToNull(values.categorie),
        niveau_regroupement: emptyToNull(values.niveauRegroupement),
        domaine_prioritaire: emptyToNull(values.domainePrioritaire),
        domaine_prioritaire_2: emptyToNull(values.domainePrioritaire2),
        domaine_prioritaire_3: emptyToNull(values.domainePrioritaire3),
        domaine_prioritaire_4: emptyToNull(values.domainePrioritaire4),
        domaine_prioritaire_5: emptyToNull(values.domainePrioritaire5),
        nb_membres: toNumber(values.nbMembres),
        nb_femmes_membres: toNumber(values.nbFemmesMembres),
        nb_hommes_membres: toNumber(values.nbHommesMembres),
        nb_membres_jeunes: toNumber(values.nbMembresJeunes),
        nb_membres_handicap: toNumber(values.nbMembresHandicap),
        nb_membres_be: toNumber(values.nbMembresBe),
        nombre_mandats_be: toNumber(values.nombreMandatsBe),
        duree_mandat_be: emptyToNull(values.dureeMandatBe),
        nb_beneficiaires: toNumber(values.nbBeneficiaires),
        nb_femmes_beneficiaires: toNumber(values.nbFemmesBeneficiaires),
        nb_jeunes_beneficiaires: toNumber(values.nbJeunesBeneficiaires),
        nb_beneficiaires_handicap: toNumber(values.nbBeneficiairesHandicap),
        adhesion_crasc_statut: emptyToNull(values.adhesionCrascStatut),
        adhesion_crasc:
          values.adhesionCrascStatut === 'oui'
            ? true
            : values.adhesionCrascStatut === 'non'
              ? false
              : null,
        organes_gouvernance: emptyToNull(values.organesGouvernance),
        pays_couverture: emptyToNull(values.paysCouverture),
        nb_personnes_engagees: toNumber(values.nbPersonnesEngagees),
        nb_cdi: toNumber(values.nbCdi),
        nb_cdd: toNumber(values.nbCdd),
        date_designation_responsable: emptyToNull(values.dateDesignationResponsable),
        date_prochaine_designation: emptyToNull(values.dateProchaineDesignation),
        manuel_procedures: toBool(values.manuelProcedures),
        plan_action_annee_cours: toBool(values.planAction),
        plan_action_annee_cours_details: emptyToNull(values.planActionAnneeCoursDetails),
        plan_action: toBool(values.planAction),
        nb_activites: toNumber(values.nbActivites),
        date_derniere_activite: emptyToNull(values.dateDerniereActivite),
        rapports_annuels: toBool(values.rapportsAnnuels),
        recommandations: emptyToNull(values.recommandations),
        recommandations_2: emptyToNull(values.recommandations2),
      };
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      if (values.documentFormalisationFile) {
        formData.append('document_formalisation_file', values.documentFormalisationFile);
      }
      if (values.planActionDocumentFile) {
        formData.append('plan_action_document_file', values.planActionDocumentFile);
      }
      if (values.rapportsAnnuelsDocumentFile) {
        formData.append('rapports_annuels_document_file', values.rapportsAnnuelsDocumentFile);
      }
      if (values.adhesionCrascDocumentFile) {
        formData.append('adhesion_crasc_document_file', values.adhesionCrascDocumentFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/adhesion`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la soumission');
      }
      toast.success('Demande soumise avec succès ! Nous vous contacterons prochainement.');
      form.reset();
      setFileInputKey((key) => key + 1);
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderInput = (
    name: TextFieldName,
    label: string,
    placeholder: string,
    type: string = 'text'
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="border-gray-300"
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderTextarea = (
    name: TextFieldName,
    label: string,
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="border-gray-300 min-h-24 resize-none"
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderSelect = (
    name: TextFieldName,
    label: string,
    placeholder: string,
    options: { value: string; label: string }[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderDocumentFile = (name: FileFieldName, label: string) => {
    const selectedFile = form.watch(name);
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
            <FormControl>
              <Input
                key={`${name}-${fileInputKey}`}
                type="file"
                accept={FORMALISATION_FILE_ACCEPT}
                className="border-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-[#2A591D] file:px-4 file:py-2 file:text-white file:font-semibold"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.files?.[0])}
              />
            </FormControl>
            {selectedFile && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                <span className="truncate text-gray-700">{selectedFile.name}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#E05017] hover:underline"
                  onClick={() => {
                    form.setValue(name, undefined);
                    setFileInputKey((key) => key + 1);
                  }}
                >
                  Retirer
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500">Formats acceptés : PDF, DOC, DOCX, JPG, PNG ou WEBP. Taille max : 10 Mo.</p>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const planActionValue = form.watch('planAction');
  const rapportsAnnuelsValue = form.watch('rapportsAnnuels');
  const adhesionCrascStatutValue = form.watch('adhesionCrascStatut');

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8 font-poppins">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2a591d] mb-2">
          DEMANDE D&apos;ADHÉSION
        </h1>
        <p className="text-gray-600">
          Remplir ce formulaire pour soumettre votre demande d&apos;adhésion.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">
                  Nom de l&apos;organisation <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nom légal de votre organisation"
                    className="border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {renderInput('sigle', 'Sigle ou abréviation', 'Ex: AJCI')}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CRASC */}
            <FormField
              control={form.control}
              name="crascNom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    CRASC <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Sélectionnez un CRASC" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {crascs.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type d'OSC */}
            <FormField
              control={form.control}
              name="typeOsc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Type d&apos;OSC <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TYPE_OSC_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Région <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Sélectionnez une région" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {renderInput('departement', 'Département', 'Ex: Bouaké')}
            {renderInput('sousPrefecture', 'Sous-préfecture', 'Ex: Brobo')}
            {renderSelect('origineOrganisation', "L'organisation est née où ?", 'Sélectionnez une origine', ORIGINE_OPTIONS)}
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">
                  Localité
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Localité de votre siège"
                    className="border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Email <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@organisation.com"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Téléphone <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Formalisation et autoévaluation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelect('existenceSiege', "L'organisation a-t-elle un siège ?", 'Sélectionnez', BOOLEAN_OPTIONS)}
              {renderSelect('typeDocumentFormalisation', 'Type de document de formalisation', 'Sélectionnez un document', FORMALISATION_OPTIONS)}
              {renderDocumentFile('documentFormalisationFile', 'Justificatif de formalisation')}
              {renderSelect('categorie', "Catégorie d'organisation", 'Sélectionnez une catégorie', CATEGORIE_OPTIONS)}
              {renderSelect('niveauRegroupement', "Niveau de regroupement de l'organisation", 'Sélectionnez un niveau', NIVEAU_REGROUPEMENT_OPTIONS)}
              {renderSelect('adhesionCrascStatut', 'Adhésion au CRASC', 'Sélectionnez un statut', ADHESION_CRASC_OPTIONS)}
              {adhesionCrascStatutValue === 'oui' && renderDocumentFile('adhesionCrascDocumentFile', 'Preuve d’adhésion au CRASC')}
              {renderSelect('manuelProcedures', 'Existence de manuel de procédures', 'Sélectionnez', BOOLEAN_OPTIONS)}
              {renderSelect('planAction', "L'organisation a-t-elle un plan d'action ?", 'Sélectionnez', BOOLEAN_OPTIONS)}
              {planActionValue === 'true' && renderDocumentFile('planActionDocumentFile', "Preuve du plan d'action")}
              {renderSelect('rapportsAnnuels', "Rédigez-vous des rapports annuels d'activités ?", 'Sélectionnez', BOOLEAN_OPTIONS)}
              {rapportsAnnuelsValue === 'true' && renderDocumentFile('rapportsAnnuelsDocumentFile', "Preuve des rapports annuels d'activités")}
            </div>
            <div className="mt-6">
              {renderTextarea('planActionAnneeCoursDetails', "Plan d'action pour l'année en cours et activités/initiatives à venir", 'Décrivez le plan et les activités à venir...')}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Domaines prioritaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelect('domainePrioritaire', '1er domaine prioritaire', 'Sélectionnez un domaine', DOMAINE_PRIORITAIRE_OPTIONS)}
              {renderSelect('domainePrioritaire2', '2ème domaine prioritaire', 'Sélectionnez un domaine', DOMAINE_PRIORITAIRE_OPTIONS)}
              {renderSelect('domainePrioritaire3', '3ème domaine prioritaire', 'Sélectionnez un domaine', DOMAINE_PRIORITAIRE_OPTIONS)}
              {renderSelect('domainePrioritaire4', '4ème domaine prioritaire', 'Sélectionnez un domaine', DOMAINE_PRIORITAIRE_OPTIONS)}
              {renderSelect('domainePrioritaire5', '5ème domaine prioritaire', 'Sélectionnez un domaine', DOMAINE_PRIORITAIRE_OPTIONS)}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Membres et bénéficiaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('nbMembres', 'Nombre total de membres', '0', 'number')}
              {renderInput('nbFemmesMembres', "Nombre de femmes membres de l'OSC", '0', 'number')}
              {renderInput('nbHommesMembres', "Nombre d'hommes membres de l'OSC", '0', 'number')}
              {renderInput('nbMembresJeunes', 'Nombre de membres jeunes', '0', 'number')}
              {renderInput('nbMembresHandicap', 'Nombre de membres en situation de handicap', '0', 'number')}
              {renderInput('nbMembresBe', 'Nombre de membres du BE', '0', 'number')}
              {renderInput('nbPersonnesEngagees', "Nombre total de personnes engagées dans l'OSC", '0', 'number')}
              {renderInput('nbCdi', 'Nombre de personnes sous CDI', '0', 'number')}
              {renderInput('nbCdd', 'Nombre de personnes sous CDD', '0', 'number')}
              {renderInput('nbBeneficiaires', "Nombre total de bénéficiaires de l'année précédente", '0', 'number')}
              {renderInput('nbFemmesBeneficiaires', "Nombre de femmes bénéficiaires de l'année précédente", '0', 'number')}
              {renderInput('nbJeunesBeneficiaires', "Nombre de jeunes bénéficiaires de l'année précédente", '0', 'number')}
              {renderInput('nbBeneficiairesHandicap', "Nombre de bénéficiaires en situation de handicap de l'année précédente", '0', 'number')}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gouvernance et activités</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('nombreMandatsBe', 'Nombre de mandat du BE ou du DE actuel', '0', 'number')}
              {renderInput('dureeMandatBe', 'Durée de mandat du BE ou DE actuel (année)', 'Ex: 3 ans')}
              {renderInput('dateDesignationResponsable', "Date de désignation du/de la responsable actuel(le)", '', 'date')}
              {renderInput('dateProchaineDesignation', 'Prochaine date de désignation', '', 'date')}
              {renderInput('nbActivites', 'Nombre d’activités réalisées dans les 12 derniers mois', '0', 'number')}
              {renderInput('dateDerniereActivite', 'Date de la dernière activité réalisée', '', 'date')}
            </div>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {renderTextarea('organesGouvernance', 'Organes de gouvernance', 'Assemblée Générale (AG), Conseil d’Administration (CA), Bureau exécutif (BE), etc.')}
              {renderTextarea('paysCouverture', "Pays de couverture de l'ONG en plus de la Côte d'Ivoire", 'Citez au moins un pays si applicable...')}
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">
                  Description de votre organisation
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez brièvement votre organisation et ses activités..."
                    className="border-gray-300 min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">
                  Motivation pour nous rejoindre{' '}
                  <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
                    className="border-gray-300 min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommandations</h2>
            <div className="grid grid-cols-1 gap-6">
              {renderTextarea('recommandations', 'Première recommandation', 'Votre première recommandation...')}
              {renderTextarea('recommandations2', 'Deuxième recommandation', 'Votre deuxième recommandation...')}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </Button>
        </form>
      </Form>
    </section>
  );
}
