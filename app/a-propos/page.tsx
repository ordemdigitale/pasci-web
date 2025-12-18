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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10">
      
        <div className="pb-6">
          <h2 className="text-xl">Présentation de LA plateforme</h2>
        </div>

        <div className="pb-6">

          <h2 className="text-xl">Présentation du CRASC</h2>

          <h4 className="font-bold text-lg pt-4 pb-2">Historique de mise en place des CRASC</h4>
          <p className='pb-3'>En Côte d&#39;Ivoire le Mapping en Juillet 2010 de la société civile a fait ressortir les principales difficultés auxquelles la société civile est confrontée.</p>
          <p className='pb-3'>Pour combler ces multiples insuffisances, les principales stratégies à moyen et long termes identifiées par l&#39;État de Côte d&#39;Ivoire et l&#39;Union Européenne ont conduit à la création d&#39;un programme d&#39;appui aux organisations de la société civile ivoirienne intitulé LIANE (Leadership &amp; Initiatives des Acteurs Non Étatiques). Ce programme LIANE avait pour objectif de consolider la démocratie, de promouvoir la bonne gouvernance et de faciliter le partenariat entre l&#39;État et la société civile.</p>
          <p className='pb-3'>L&#39;un des résultats du projet LIANE I, piloté par le CERAP, dans le cadre du processus de renforcement des capacités a été la création du &quot;Centre Régional d&#39;Appui à la Société Civile (CRASC)&quot; en Juillet 2015, pour pérenniser les acquis du projet.</p>
          <p className='pb-3'>La création des CRASC s&#39;est faite selon le principe que pour atteindre facilement et pour couvrir les besoins les OSC sur toutes l&#39;étendue du territoire Ivoirien, il fallait les regrouper selon leur situation géographique (Centre, Est, Nord, ouest et Sud). De sorte qu&#39;à travers leur interlocuteur les appuis puissent toucher l&#39;ensemble de la zone. <br /> Il existe donc 5 CRASC : CRASC Centre, CRASC Est, CRASC Nord, CRASC ouest et CRASC Sud.</p>
          <p className='pb-3'>De ce fait, le CRASC est un dispositif régional de mutualisation des compétences, des services et de divers appuis au bénéfice des organisations de la société civile de la Côte d&#39;Ivoire, pour construire une Société Civile responsable, unie et indépendante, actrice du développement local.</p>
      
          <h4 className="font-bold text-lg pt-4 pb-2">Missions des CRASC</h4>
          <p>La mission essentielle des CRASC est de renforcer les capacités techniques, organisationnelles et institutionnelles des OSC de leur zone de couverture.</p>

          <h4 className="font-bold text-lg pt-4 pb-2">Objectifs des CRASC</h4>
          <p className='mb-3'>L&#39;objectif principal des CRASC est d&#39;apporter un appui aux OSC dans leur création, leur organisation, leur fonctionnement et tous autres services liés à la vie d&#39;une organisation.</p>
          <p className='mb-3'>De façon spécifiques il s&#39;agit pour le CRASC de:</p>
          <ul className="list-disc ml-12">
            <li>Faciliter l&#39;accès à l&#39;information sur toutes les opportunités d&#39;appuis techniques et financiers pour les OSC.</li>
            <li>Renforcer les capacités techniques, organisationnelles et institutionnelles des Organisations de la Société Civile de sa zone.</li>
            <li>Améliorer les conditions et cadres de travail des OSC, les accompagner, leur apporter des appuis-conseils et des connaissances pour améliorer leurs performances, afin qu&#39;elles deviennent des interlocuteurs crédibles, reconnus, informés et compétents.</li>
            <li>Créer un cadre d&#39;échanges et de mutualisation de différents services au bénéfice des OSC.</li>
          </ul>
        
          <h4 className="font-bold text-lg pt-4 pb-2">Structuration</h4>
          <p className='pb-3'>Les CRASC ont 5 organes de gestion :</p>
          <ul className="list-disc ml-12">
            <li>L&#39;Assemblée Générale;</li>
            <li>Le Conseil d&#39;Administration;</li>
            <li>La direction exécutive;</li>
            <li>Délégations régionales;</li>
            <li>Le Commissariat aux comptes.</li>
          </ul>

          <h4 className="font-bold text-lg pt-4 pb-2">Les zones de couvertures par CRASC</h4>
          <p className='pb-3'>CRASC Centre, <span className='font-bold'>(05 Régions)</span>: BÉLIER (Toumodi), GBÊKÈ (Bouake), HAMBOL (Katiola), MARAHOUÉ (Bouaflé), N&#39;ZI (Dimbokro)</p>

          <p className='pb-3'>CRASC Est, <span className='font-bold'>(04 Régions)</span>: BOUNKANI (Bouna), GONTOUGO (Bondoukou), IFFOU (Daoukro), MORONOU (Bongouanou)</p>
          
          <p className='pb-3'>CRASC Nord, <span className='font-bold'>(07 Régions)</span>: BAGOUÉ (Boundiali), BERE (Mankono), (Minignan), KABADOUGOU (Odienné), PORO
          (Korhogo), FOLON (Minignan), TCHOLOGO (Ferkessédougou), WORODOUGOU (Séguéla)</p>
          
          <p className='pb-3'>CRASC Ouest, <span className='font-bold'>(05 Régions)</span>: BAFING (Touba), CAVALLY (Guiglo), GUÉMON (Duékoué), HAUT-SASSANDRA (Daloa), TONKPI (Man)</p>

          <p className='pb-3'>CRASC Sud, <span className='font-bold'>(10 Régions)</span>: AGNÉBY-TIASSA (Agboville), GBOKLE (Sassandra), GOH (Gagnoa), ME (Adzopé), SAN-
          PEDRO (Touba), GRANDS-PONTS (Dabou), INDENIE-DJUABLIN (Abengourou), LOH-DJIBOUA (Divo), NAWA
          (Soubré), SUD-COMOÉ (Aboisso), ABIDJAN.</p>

        </div>
      </div>
    </section>
  )
}
