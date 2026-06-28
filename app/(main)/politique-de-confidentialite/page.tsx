export default function PolitiqueConfidentialitePage() {
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 bg-[#f0f9ff] rounded-lg p-8 mb-10">
        <h1 className="text-[#2a591d] font-bold text-3xl pb-4">
          Politique de confidentialité de la Plateforme Digitale de la Société Civile (PdoC)
        </h1>
        <p className="text-sm text-gray-600">Dernière mise à jour : Janvier 2025</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        {/* Introduction */}
        <div className="bg-white rounded-lg px-6">
          {/* <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Introduction</h2> */}
          <p className="text-gray-700">
            La PdoC accorde une importance primordiale à la protection de la vie privée de ses utilisateurs. Cette politique de confidentialité décrit de manière transparente <b>comment vos informations personnelles sont collectées, utilisées, partagées et protégées</b>.
            En accédant et en utilisant notre plateforme, vous reconnaissez et acceptez les pratiques exposées dans ce document.
            Voici une reformulation en <b>français facile</b>, plus claire et compréhensible pour tous :
          </p>
        </div>

        {/* Collecte des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">1. Collecte des données</h2>
          
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-4">
            <li>Nous pouvons demander : votre nom, prénom, email, téléphone.</li>
            <li>Si vous representez une organisation : son nom, votre fonction, votre domaine d'activité.</li>
            <li>Quand vous utilisez la plateforme: adresse IP, type de navigateur, pages visitées.</li>
            <li>Quand vous nous écrivez : messages envoyés via les formulaires.</li>
          </ul>
          <p className="text-gray-700">
            👉 Ces données sont recueillies quand vous vous inscrivez, remplissez un formulaire, naviguez sur le site (cookies), ou participez à nos activités.
          </p>
        </div>

        {/* Utilisation des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">2. Utilisation des données</h2>
          <p className="text-gray-700 mb-3">Nous utilisons vos informations pour :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Créer et gérer votre compte.</li>
            <li>Vous donner accès aux services (formations, accompagnement, informations).</li>
            <li>Vous informer sur nos activités et opportunités.</li>
            <li>Améliorer le plateforme et votre expérience.</li>
            <li>Produire des statistiques anonymes.</li>
            <li>Respecter la loi et nos obligations.</li>
          </ul>
        </div>

        {/* Partage des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">3. Partage des données</h2>
          <p className="text-gray-700 mb-3">
            Vos données <b>ne sont jamais vendues</b>. Elles peuvent être partagées :
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Avec les CRASC pour vous accompagner.</li>
            <li>Avec des partenaires financiers, seulement si vous êtes d'accord.</li>
            <li>Avec nos prestataires techniques (hébergement, maintenance).</li>
            <li>Avec les autorités si la loi l'exige.</li>
          </ul>
        </div>

        {/* Sécurité */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">4. Sécurité</h2>
          <p className="text-gray-700 mb-3">
            Nous protégeons vos données contre :
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-3">
            <li>L'accès non autorisé.</li>
            <li>La divulgation ou la perte.</li>
            <li>L'altération ou la destruction.</li>
          </ul>
          <p className="text-gray-700">
            Mais, aucune transmission Internet n'est totalement sûre. Nous faisons le maximum, sans pouvoir garantir une sécurité absolue.
          </p>
        </div>

        {/* Conservation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">5. Conservation</h2>
          <p className="text-gray-700">
            Vos données sont gardées aussi longtemps que nécessaire. <br />
            👉 Si votre comptes reste inactif plus de 3 ans, il peut être supprimé après vous avoir prévenu.
          </p>
        </div>

        {/* Vos droits */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">6. Vos droits</h2>
          <p className="text-gray-700 mb-3">Vous pouvez :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-4">
            <li>Accéder à vos données.</li>
            <li>Les corriger.</li>
            <li>Demander leur suppression.</li>
            <li>Refuser leur utilisation.</li>
            <li>Les récupérer dans un format lisible.</li>
            <li>Retirer votre consentement.</li>
          </ul>
          <p className="text-gray-700">
            📩 Pour exercer vos droits: <a href="mailto:pdoc@plateforme-osc.org" className="text-[#E05017] hover:underline">pdoc@plateforme-osc.org</a>
          </p>
        </div>

        {/* Cookies */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-700">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">7. Cookies</h2>
          <p className="mb-3">Nous utilisons des cookies pour améliorer votre navigation:</p>
          <ul className="list-disc ml-6 space-y-2 mt-2">
            <li>Essentiels : pour que le site fonctionne.</li>
            <li>Analytiques : pour comprendre l'utilisation du site.</li>
            <li>Fonctionnels : pour mémoriser vos préférences.</li>
          </ul>
          👉 Vous pouvez gérer les cookies dans les paramètres de votre navigateur.
        </div>

        {/* Modifications */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">8. Modifications</h2>
          <p className="text-gray-700">
            Cette politique peut changer. La nouvelle version sera publiée sur cette page avec la date de mise à jour.
            <br />
            Nous vous conseillons de la consulter régulièrement.
          </p>
        </div>

        {/* Contact */}
        {/* <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">9. Nous Contacter</h2>
          <p className="text-gray-700 mb-3">
            Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles,
            vous pouvez nous contacter :
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email :</strong> <a href="mailto:pdoc@plateforme-osci.org" className="text-[#E05017] hover:underline">pdoc@plateforme-osci.org</a></p>
            <p><strong>Téléphone :</strong> 05 05 56 57 41</p>
            <p><strong>Adresse :</strong> 15, avenue Jean Mermoz, Cocody, Abidjan, Côte d'Ivoire</p>
          </div>
        </div> */}

      </div>
    </section>
  );
}
