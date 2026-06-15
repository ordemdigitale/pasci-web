import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'

interface IItems {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default async function AboutPage() {
  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 bg-[#f0f9ff] rounded-lg pt-8 mb-10">
        <div className="pb-6">
          <h2 className="text-[#2a591d] font-bold text-3xl pb-2">Présentation de la plateforme &#40;PdoC&#41;</h2>
          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Une plateforme pour tous</h4>
          <p className="mb-3">Cette plateforme digitale est née d&apos;un travail collectif. Elle a été construite avec la participation des associations ivoiriennes, de l&apos;État et de partenaires techniques et financiers.</p>
          
          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Un projet partagé</h4>
          <p className="mb-3">Les acteurs impliqués ont donné leurs idées et leurs propositions lors de rencontres de préparation. C&apos;est grâce à eux que les services et les outils de la plateforme répondent vraiment aux besoins des utilisateurs.</p>
          
          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Un outil pratique et vivant</h4>
          <p className="mb-3">
            La plateforme s&apos;adresse aux organisations de la société civile liées aux <b>Centres Régionaux d&apos;Appui à la Société Civile &#40;CRASC&#41;</b>. Elle permet de :
            <ul className="list-disc ml-12">
              <li>rendre les OSC plus visibles,</li>
              <li>travailler ensemble plus facilement,</li>
              <li>partager des expériences et des bonnes pratiques.</li>
            </ul>
          </p>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Un espace pour la cohésion</h4>
          <p className="mb-3">
            Au-delà du numérique, la plateforme veut :
          </p>
          <ul className="list-disc ml-12">
            <li>renforcer le vivre ensemble,</li>
            <li>aider à préparer le travail en équipe sans conflit,</li>
            <li>encourager la participation des femmes et des jeunes.</li>
          </ul>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 bg-[#f0f9ff] rounded-lg p-8 mb-10">
        <div className="pb-6">
          <h2 className="text-[#2a591d] font-bold text-3xl pb-2">Présentation générale de la société civile en CI</h2>
          <h2 className="text-[#2a591d] font-bold text-xl pb-2">Présentation du CRASC</h2>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Histoire des CRASC en Côte d'Ivoire</h4>
          <ul className="list-disc ml-12">
            <li>En <b>2010</b>, une étude a montré que les organisations de la société civile &#40;OSC&#41; avaient beaucoup de difficultés.</li>
            <li>Pour aidé, l&apos;État et l&apos;Union Européenne ont lancé le programme <b>LIANE</b>. Son but : renforcer la démocratie, améliorer la gouvernance et créer un vrai partenariat entre l&apos;État et les OSC.</li>
            <li>En <b>2015</b>, grâce au projet LIANE I, les premiers <b>Centres Régionaux d&apos;Appui à la Société Civile &#40;CRASC&#41;</b> ont été créés.</li>
          </ul>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Pourquoi les CRASC ?</h4>
          <ul className="list-disc ml-12">
            <li>Les OSC sont nombreuses et réparties partout dans le pays.</li>
            <li>Pour mieux les accompagner, on a créé <b>5 CRASC</b> : Centre, Est, Nord, Ouest et Sud.</li>
            <li>Chaque CRASC sert de relais pour donner conseils, formations et appuis aux associations de sa région.</li>
          </ul>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Leur rôle</h4>
          <p className="mb-3">
            Les CRASC sont là pour :
          </p>
          <ul className="list-disc ml-12">
            <li>Regrouper les forces des OSC.</li>
            <li>Offir des services utiles &#40;formations, accompagnements, conseils&#41;</li>
            <li>Aider la société civile à être <b>unie, responsable et actrice du développement local</b>.</li>
          </ul>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Mission des CRASC</h4>
          <p className="mb-2">Les CRASC ont pour mission principale d&apos;<b>aider les organisations de la société civile &#40;OSC&#41;</b> de leur région à mieux fonctionner.</p>
          <p>Ils aident les organisations à avoir leurs papiers, à bien s&apos;organiser et leur donne des manières pour bien travailler.</p>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Objectifs des CRASC</h4>
          <ul className="list-disc ml-12">
            <li><b>But principal</b> : accompagner les OSC dans leur création, leur organisation et leur vie quotidienne.</li>
            <li><b>Objectifs concrets</b> :</li>
            <ul>
              <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-white before:border before:border-black before:rounded-full">
                Donner accès aux informations sur les aides techniques et financières.</li>
              <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-white before:border before:border-black before:rounded-full">
                Former et conseiller les OSC pour qu&apos;elles deviennent des acteurs crédibles et compétents.</li>
              <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-white before:border before:border-black before:rounded-full">
                Améliorer leurs conditions de travail et leur apporter des connaissances utiles.</li>
              <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-white before:border before:border-black before:rounded-full">
                Créer un espace d&apos;échanges et de partage de services entre OSC.</li>
            </ul>
          </ul>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Organisation des CRASC</h4>
          <p>Les CRASC sont structurés autour de 5 organes :</p>
          <ul className="list-disc ml-12">
            <li>Assemblée Générale</li>
            <li>Conseil d&apos;Administration</li>
            <li>Direction exécutive</li>
            <li>Délégations régionales</li>
            <li>Commissariat aux comptes</li>
            <li>Le conseil des sages</li>
          </ul>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Les zones couvertes par les CRASC</h4>
          <p><b>CRASC Centre</b> : 5 régions + 1 district</p>
          <p className="mb-2">Bélier &#40;Toumodi&#41;, Gbêkè &#40;Bouaké&#41;, Hambol &#40;Katiola&#41;, Marahoué &#40;Bouaflé&#41;, N&apos;Zi &#40;Dimbokro&#41;, Yamoussoukro</p>
          
          <p><b>CRASC Est</b> : 5 régions</p>
          <p className="mb-2">Bounkani &#40;Bouna&#41;, Gontougo &#40;Bondoukou&#41;, Iffou &#40;Daoukro&#41;, Moronou &#40;Bongouanou&#41;, Indénié-Djuablin &#40;Abengourou&#41;</p>
          
          <p><b>CRASC Nord</b> : 7 régions</p>
          <p className="mb-2">Bagoué &#40;Boundiali&#41;, Béré &#40;Mankono&#41;, Folon &#40;Minignan&#41;, Kabadougou &#40;Odienné&#41;, Poro &#40;Korhogo&#41;, Tchologo &#40;Ferkessédougou&#41;, Worodougou &#40;Séguéla&#41;</p>

          <p><b>CRASC Ouest</b> : 5 régions</p>
          <p className="mb-2">Bafing &#40;Touba&#41;, Cavally &#40;Guiglo&#41;, Guémon &#40;Duékoué&#41;, Haut-Sassandra &#40;Daloa&#41;, Tonkpi &#40;Man&#41;</p>

          <p><b>CRASC Sud</b> : 9 régions + 1 district</p>
          <p className="mb-2">Agnéby-Tiassa &#40;Agboville&#41;, Gbôklè &#40;Sassandra&#41;, Gôh &#40;Gagnoa&#41;, Mé &#40;Adzopé&#41;, San-Pedro, Grands-Ponts &#40;Dabou&#41;, Loh-Djiboua &#40;Divo&#41;, Nawa &#40;Soubré&#41;, Sud-Comoé &#40;Aboisso&#41;, Abidjan</p>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Réalisations des CRASC</h4>
          <p className="font-bold text-lg pt-4 pb-2">1. Renforcement des capacités de 5 409 OSC</p>
          <ul className="list-disc ml-12">
            <li><b>3 553</b> OSC formées aux critères de soumission aux appels à projet</li>
            <li><b>1 056</b> Organisations formées aux <b>thématiques</b> : gestion de projets, communication digitale, égalité de genre, prévention et gestion des conflits.</li>
            <li><b>780</b> organisations &#40;femmes, jeunes, associations locales&#41; appuyée à la <b>création et à la formalisation</b>.</li>
            <li><b>20</b> organisations accompagnées techniquement et institutionnellement par semaine.</li>
          </ul>

          <p className="font-bold text-lg pt-4 pb-2">2. Appui à la gouvernance et à la participation citoyenne</p>
          <ul className="list-disc ml-12">
            <li>Réalisation d&apos;<b>enquêtes de satisfaction citoyenne</b> sur les services publics &#40;éducation inclusion financière&#41;</li>
            <li>30 Organisations de <b>cafés citoyens</b> et panels de dialogue avec les autorités et les candidats aux élections.</li>
            <li>Contribution à la <b>définition des politiques de développement local</b>.</li>
            <li>Élaboration d&apos;une <b>feuille de route pour les CRASC</b>.</li>
          </ul>

          <p className="font-bold text-lg pt-4 pb-2">3. Partenariats et projets structurants</p>
          <ul className="list-disc ml-12">
            <li>Participation au <b>projet de cartographie sectorielle des OSC et redynamisation des CRASC</b> &#40;CERAP, UE&#41;;</li>
            <li>Mise en œuvre du <b>programme LIANE 2</b> pour le renforcement des capacités et le suivi des micro-initiatives;</li>
            <li>Exécution du <b>projet ECOTER</b> : création d&apos;un centre de services pour les OSC du Gontougo.</li>
          </ul>

          <p className="font-bold text-lg pt-4 pb-2">4. Engagement institutionnel et plaidoyer</p>
          <ul className="list-disc ml-12">
            <li>Déclaration commune pour la <b>liberté d&apos;association</b> dans le cadre de l&apos;avant-projet de loi sur les associations.</li>
            <li>Participation régulière aux <b>réunions du Conseil d&apos;Administration</b> et aux instances de gouvernance.</li>
            <li>Positionnement comme <b>partenaire incontournable de l&apos;État</b> dans la mise en œuvre de la politique de bonne gouvernance.</li>
          </ul>

          <h2 className="text-[#2a591d] font-bold text-xl py-4">Le rôle de la DGAT et les textes qui régissent la relation entre la société civile et l&apos;État</h2>
          <p>
            La DGAT &#40;Direction Générale de l&apos;Administration du Territoire&#41; joue un rôle clé dans l&apos;application de l&apos;ordonnance sur les OSC : elle est chargée de vulgariser le texte, d&apos;accompagner les organisations dans leur mise en conformité et de renforcer leur gouvernance.
          </p>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Rôle principal de la DGAT</h4>
          <ul className="list-disc ml-12">
            <li><b>Vulgarisation et formation</b> : La DGAT organise des ateliers pour expliquer l’ordonnance n° 2024-368 aux OSC et aux CRASC (Centres Régionaux d’Appui à la Société Civile).</li>
            <li><b>Accompagnement juridique et administratif</b> : Elle aide les OSC à comprendre les nouvelles obligations (déclaration, comptabilité, transparence, gouvernance).</li>
            <li><b>Mise en conformité</b> : La DGAT guide les OSC pour qu’elles adaptent leurs statuts, leurs procédures et leur fonctionnement aux nouvelles règles.</li>
            <li><b>Renforcement de la gouvernance</b> : Elle insiste sur la professionnalisation des OSC en matière de gestion financière, comptable et des ressources humaines.</li>
            <li><b>Coordination nationale</b> : Elle harmonise les actions des différents acteurs (OSC, CRASC, partenaires comme l’UE ou ONG) pour une application cohérente de la réforme.</li>
          </ul>
          
          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Pourquoi ce rôle est important ?</h4>
          <ul className="list-disc ml-12">
            <li>Avant, les OSC étaient encadrées par la <b>loi de 1960 sur les associations</b>, trop limitée.</li>
            <li>La DGAT est désormais l’organe central qui veille à ce que toutes les OSC respectent le nouveau cadre légal.</li>
            <li>Elle garantit que les OSC soient <b>conformes à la Constitution</b> et puissent contribuer efficacement au développement économique et social.</li>
          </ul>

          <h4 className="font-bold text-lg pt-4 pb-2 text-[#2F5496]">Impact concret pour les OSC</h4>
          <ul className="list-disc ml-12">
            <li><b>Clarté des règles</b> : Les OSC savent désormais quelles démarches suivre pour être reconnues légalement.</li>
            <li><b>Crédibilité renforcée</b> : Une OSC conforme gagne la confiance des citoyens et des bailleurs de fonds.</li>
            <li><b>Protection</b> : La DGAT aide à éviter les dérives (structures fictives, financements illicites).</li>
            <li><b>Structuration durable</b> : Les OSC sont encouragées à se regrouper en réseaux et plateformes pour plus de force collective.</li>
          </ul>
          <p className="my-4">En clair, la DGAT est le <b>bras opérationnel du ministère de l’Intérieur</b> pour appliquer l’ordonnance sur les OSC. Elle ne se contente pas de contrôler, mais elle <b>forme, accompagne et professionnalise</b> les organisations afin qu’elles deviennent des acteurs crédibles du développement et de la cohésion sociale en Côte d’Ivoire.</p>
          <p className="text-[#2a591d] mb-4"><b>Les 10 articles Clés illustratifs de l’ordonnance n° 2024-368 sur les OSC</b>, pour comprendre le rôle de la DGAT et son rapport avec les OSC.</p>
          <ul className="list-disc ml-12">
            <li><b>Article 5</b> : « Les associations et organisations cultuelles doivent être déclarées auprès de la préfecture ou sous-préfecture. Les fondations doivent obtenir une autorisation préalable. ». Cela veut dire que pour exister légalement, une OSC doit faire une démarche officielle.</li>
            <li><b>Article 15</b> : « Les OSC régulièrement déclarées peuvent recevoir des dons, posséder des biens nécessaires à leurs activités et ouvrir un compte bancaire. ». Une OSC reconnue a donc le droit de gérer de l’argent et des biens pour ses actions.</li>
            <li><b>Article 28</b> : « Les OSC doivent tenir une comptabilité claire et transparente et déclarer leurs impôts. ». Elles doivent montrer comment elles utilisent l’argent et respecter les règles fiscales.</li>
            <li><b>Article 42</b> : « Toute OSC doit informer l’administration de tout changement concernant ses dirigeants, son siège, ses statuts ou son logo. ». Si quelque chose change dans l’organisation, il faut le signaler.</li>
            <li><b>Article 64 à 69</b> : Ces articles portent sur la lutte contre le blanchiment d’argent et le financement du terrorisme. Ils obligent les OSC à être vigilantes et à éviter que leurs fonds servent à des activités illégales.</li>
            <li><b>Article 75</b> : « Une OSC peut être dissoute si son objet est illégal, contraire aux bonnes mœurs, ou s’il menace l’ordre public et la cohésion sociale. » L’État peut fermer une OSC si elle agit contre l’intérêt général.</li>
          </ul>
          <p className="my-4">Les articles montrent que l’ordonnance :</p>
          <ul className="list-disc ml-12">
            <li><b>Encadre la création</b> (déclaration ou autorisation).</li>
            <li><b>Donne des droits</b> (recevoir des dons, agir en justice).</li>
            <li><b>Impose des obligations</b> (transparence, fiscalité, gouvernance).</li>
            <li><b>Prévoit des sanctions</b> (dissolution en cas de dérive).</li>
          </ul>          
        </div>
      </div>
    </section>
  )
}
