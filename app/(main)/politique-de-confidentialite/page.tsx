export default function PolitiqueConfidentialitePage() {
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 bg-[#f0f9ff] rounded-lg p-8 mb-10">
        <h1 className="text-[#2a591d] font-bold text-3xl pb-4">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-600">Dernière mise à jour : Janvier 2025</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Introduction */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Introduction</h2>
          <p className="text-gray-700 mb-3">
            La plateforme PASCI (Plateforme d'Appui à la Société Civile Ivoirienne) s'engage à protéger la vie privée
            de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, utilisons,
            partageons et protégeons vos informations personnelles.
          </p>
          <p className="text-gray-700">
            En utilisant notre plateforme, vous acceptez les pratiques décrites dans cette politique de confidentialité.
          </p>
        </div>

        {/* Collecte des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">1. Collecte des Données Personnelles</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">1.1 Données que nous collectons</h3>
          <p className="text-gray-700 mb-3">Nous collectons les types de données suivants :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-4">
            <li><strong>Informations d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
            <li><strong>Informations professionnelles :</strong> organisation, fonction, domaine d'activité</li>
            <li><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages consultées</li>
            <li><strong>Données de communication :</strong> messages envoyés via nos formulaires de contact</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">1.2 Moyens de collecte</h3>
          <p className="text-gray-700 mb-3">Nous collectons vos données de différentes manières :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Lors de votre inscription sur la plateforme</li>
            <li>Lorsque vous remplissez un formulaire de contact ou de demande d'adhésion</li>
            <li>Lors de votre navigation sur le site (cookies et technologies similaires)</li>
            <li>Lorsque vous participez à nos formations ou événements</li>
          </ul>
        </div>

        {/* Utilisation des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">2. Utilisation des Données</h2>
          <p className="text-gray-700 mb-3">Nous utilisons vos données personnelles pour :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Gérer votre compte utilisateur et votre accès à la plateforme</li>
            <li>Vous fournir les services demandés (formations, accompagnement, informations)</li>
            <li>Communiquer avec vous concernant nos activités et opportunités</li>
            <li>Améliorer nos services et votre expérience utilisateur</li>
            <li>Produire des statistiques anonymisées sur l'utilisation de la plateforme</li>
            <li>Respecter nos obligations légales et réglementaires</li>
          </ul>
        </div>

        {/* Partage des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">3. Partage des Données</h2>
          <p className="text-gray-700 mb-3">
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations dans les cas suivants :
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li><strong>Avec les CRASC :</strong> pour faciliter l'accompagnement et le suivi de votre OSC</li>
            <li><strong>Avec les partenaires techniques et financiers :</strong> uniquement avec votre consentement explicite</li>
            <li><strong>Avec nos prestataires de services :</strong> hébergement, maintenance technique (sous contrat de confidentialité)</li>
            <li><strong>Pour des obligations légales :</strong> si requis par la loi ou une autorité compétente</li>
          </ul>
        </div>

        {/* Sécurité des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">4. Sécurité des Données</h2>
          <p className="text-gray-700 mb-3">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre :
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-3">
            <li>L'accès non autorisé</li>
            <li>La divulgation accidentelle ou illégale</li>
            <li>La perte, l'altération ou la destruction</li>
          </ul>
          <p className="text-gray-700">
            Cependant, aucune transmission de données sur Internet n'est totalement sécurisée. Nous ne pouvons garantir
            la sécurité absolue de vos informations.
          </p>
        </div>

        {/* Conservation des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">5. Conservation des Données</h2>
          <p className="text-gray-700">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter
            nos obligations légales. Les données des comptes inactifs depuis plus de 3 ans peuvent être supprimées après
            notification préalable.
          </p>
        </div>

        {/* Vos droits */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">6. Vos Droits</h2>
          <p className="text-gray-700 mb-3">Vous disposez des droits suivants concernant vos données personnelles :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-4">
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
            <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
          </ul>
          <p className="text-gray-700">
            Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@crasc.ivoire.org" className="text-[#E05017] hover:underline">contact@crasc.ivoire.org</a>
          </p>
        </div>

        {/* Cookies */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">7. Cookies et Technologies Similaires</h2>
          <p className="text-gray-700 mb-3">
            Nous utilisons des cookies et technologies similaires pour améliorer votre expérience de navigation.
            Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur.
          </p>
          <p className="text-gray-700">
            Les cookies que nous utilisons sont de type :
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-2">
            <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
            <li><strong>Cookies analytiques :</strong> pour comprendre l'utilisation du site</li>
            <li><strong>Cookies fonctionnels :</strong> pour mémoriser vos préférences</li>
          </ul>
        </div>

        {/* Modifications */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">8. Modifications de cette Politique</h2>
          <p className="text-gray-700">
            Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications seront publiées
            sur cette page avec la date de dernière mise à jour. Nous vous encourageons à consulter régulièrement
            cette page pour rester informé.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">9. Nous Contacter</h2>
          <p className="text-gray-700 mb-3">
            Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles,
            vous pouvez nous contacter :
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email :</strong> <a href="mailto:contact@crasc.ivoire.org" className="text-[#E05017] hover:underline">contact@crasc.ivoire.org</a></p>
            <p><strong>Téléphone :</strong> (+225) 27 22 40 47 20 / 07 09 26 67 66</p>
            <p><strong>Adresse :</strong> 15, avenue Jean Mermoz, Cocody, Abidjan, Côte d'Ivoire</p>
          </div>
        </div>

      </div>
    </section>
  );
}
