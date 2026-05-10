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

const registrationSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'Le nom de l\'organisation est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  crascNom: z.string().min(1, 'Sélectionnez un CRASC'),
  typeOsc: z.string().min(1, 'Sélectionnez un type d\'OSC'),
  region: z.string().min(1, 'Sélectionnez une région'),
  city: z.string().optional(),
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
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const TYPE_OSC_OPTIONS = [
  { value: 'Association', label: 'Association' },
  { value: 'Fondation', label: 'Fondation' },
  { value: 'Organisation cultuelle', label: 'Organisation cultuelle' },
  { value: 'ONG', label: 'ONG' },
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
  const [crascs, setCrascs] = useState<ICrasc[]>([]);

  useEffect(() => {
    fetchAllCrasc().then(setCrascs).catch(() => {});
  }, []);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: '',
      crascNom: '',
      typeOsc: '',
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
          type_organisation: values.typeOsc,
          crasc_nom: values.crascNom,
          type_osc: values.typeOsc,
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
                    Type d'OSC <span className="text-red-600">*</span>
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
  );
}
