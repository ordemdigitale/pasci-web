// OSC registration form
"use client";

import { useState } from 'react';
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

const registrationSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'Le nom de l\'organisation est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  organizationType: z.string().min(1, 'Sélectionnez un type d\'organisation'),
  region: z.string().min(1, 'Sélectionnez une région'),
  city: z.string().optional(),
  email: z
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
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
/* replace with real data */
const ORGANIZATION_TYPES = [
  { value: 'ngo', label: 'ONG' },
  { value: 'company', label: 'Entreprise' },
  { value: 'government', label: 'Gouvernement' },
  { value: 'academic', label: 'Académique' },
  { value: 'other', label: 'Autre' },
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



export default function PageRejoindre() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: '',
      organizationType: '',
      region: '',
      city: '',
      email: '',
      phone: '',
      description: '',
      motivation: '',
    },
  });

  async function onSubmit(values: RegistrationFormValues) {
    try {
      setIsSubmitting(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE_URL}/api/v1/adhesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom_organisation: values.organizationName,
          type_organisation: values.organizationType,
          region: values.region,
          ville: values.city || null,
          email: values.email,
          telephone: values.phone,
          description: values.description || null,
          motivation: values.motivation,
        }),
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la soumission');
      }
      toast.success('Demande soumise avec succès ! Nous vous contacterons prochainement.');
      form.reset();
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8 font-poppins">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2a591d] mb-2">
          DEMANDE D'ADHÉSION
        </h1>
        <p className="text-gray-600">
          Remplir ce formulaire pour soumettre votre demande d'adhésion.
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
                  Nom de l'organisation <span className="text-red-600">*</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="organizationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Type d'organisation <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ORGANIZATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="+237 6XX XXX XXX"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
  )
}
{/* <div class="card p-8" style="opacity: 1; transform: none;"><h2 class="font-heading text-3xl text-primary mb-2">Formulaire d'adhésion</h2><p class="text-gray-600 mb-8">Remplissez ce formulaire pour soumettre votre demande d'adhésion au réseau.</p><form class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'organisation *</label><input type="text" required="" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Nom légal de votre organisation" value=""></div><div class="grid md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">Type d'organisation *</label><select required="" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"><option value="" selected="">Sélectionnez un type</option><option value="Association">Association</option><option value="ONG">ONG</option><option value="Fondation">Fondation</option><option value="Coopérative">Coopérative</option><option value="Groupement">Groupement</option><option value="Réseau">Réseau</option><option value="Autre">Autre</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Région *</label><select required="" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"><option value="" selected="">Sélectionnez une région</option><option value="District Autonome d'Abidjan">District Autonome d'Abidjan</option><option value="District Autonome de Yamoussoukro">District Autonome de Yamoussoukro</option><option value="Agnéby-Tiassa">Agnéby-Tiassa</option><option value="Bafing">Bafing</option><option value="Bagoué">Bagoué</option><option value="Béré">Béré</option><option value="Bélier">Bélier</option><option value="Bounkani">Bounkani</option><option value="Cavally">Cavally</option><option value="Folon">Folon</option><option value="Gbêkê">Gbêkê</option><option value="Gbôklé">Gbôklé</option><option value="Gôh">Gôh</option><option value="Gontougo">Gontougo</option><option value="Grands-Ponts">Grands-Ponts</option><option value="Guémon">Guémon</option><option value="Hambol">Hambol</option><option value="Haut-Sassandra">Haut-Sassandra</option><option value="Iffou">Iffou</option><option value="Indénié-Djuablin">Indénié-Djuablin</option><option value="Kabadougou">Kabadougou</option><option value="La Mé">La Mé</option><option value="Loh-Djiboua">Loh-Djiboua</option><option value="Marahoué">Marahoué</option><option value="Moronou">Moronou</option><option value="Nawa">Nawa</option><option value="N'Zi">N'Zi</option><option value="Poro">Poro</option><option value="San-Pédro">San-Pédro</option><option value="Sud-Comoé">Sud-Comoé</option><option value="Tchologo">Tchologo</option><option value="Tonkpi">Tonkpi</option><option value="Worodougou">Worodougou</option></select></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Ville</label><input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Ville de votre siège" value=""></div><div class="grid md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" required="" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="contact@organisation.cm" value=""></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label><input type="tel" required="" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="+237 6XX XXX XXX" value=""></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Description de votre organisation</label><textarea rows="4" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Décrivez brièvement votre organisation et ses activités..."></textarea></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Motivation pour rejoindre le réseau *</label><textarea required="" rows="4" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Pourquoi souhaitez-vous rejoindre le réseau RI-CRASC ?"></textarea></div><button type="submit" class="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">Soumettre la demande<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg></button></form></div> */}
