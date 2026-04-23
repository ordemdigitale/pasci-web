export default function ConditionsGeneralesPage() {
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 bg-[#f0f9ff] rounded-lg p-8 mb-10">
        <h1 className="text-[#2a591d] font-bold text-3xl pb-4">Conditions Générales d'Utilisation</h1>
        <p className="text-sm text-gray-600">Dernière mise à jour : Janvier 2025</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Introduction */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">Introduction</h2>
          <p className="text-gray-700 mb-3">
            Bienvenue sur la plateforme PASCI (Plateforme d'Appui à la Société Civile Ivoirienne). Les présentes
            Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de notre plateforme digitale.
          </p>
          <p className="text-gray-700">
            En accédant à cette plateforme, vous acceptez sans réserve les présentes conditions générales. Si vous
            n'acceptez pas ces conditions, veuillez ne pas utiliser cette plateforme.
          </p>
        </div>

        {/* Objet */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">1. Objet de la Plateforme</h2>
          <p className="text-gray-700 mb-3">
            La plateforme PASCI a pour objectif de :
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Renforcer la visibilité des Organisations de la Société Civile (OSC) en Côte d'Ivoire</li>
            <li>Faciliter l'accès aux services d'accompagnement des Centres Régionaux d'Appui à la Société Civile (CRASC)</li>
            <li>Promouvoir la synergie d'action et le partage d'expériences entre OSC</li>
            <li>Diffuser des informations sur les opportunités de financement et de formation</li>
            <li>Favoriser la concertation entre les acteurs de la société civile</li>
          </ul>
        </div>

        {/* Accès à la plateforme */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">2. Accès à la Plateforme</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Accès libre</h3>
          <p className="text-gray-700 mb-4">
            Certaines sections de la plateforme sont accessibles librement sans inscription : pages d'information,
            annuaires publics, actualités, ressources documentaires.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Accès réservé</h3>
          <p className="text-gray-700 mb-3">
            L'accès à certaines fonctionnalités (espace collaboratif, formations en ligne, offres d'emploi) nécessite
            la création d'un compte utilisateur.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Création de compte</h3>
          <p className="text-gray-700 mb-3">Pour créer un compte, vous devez :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Fournir des informations exactes, complètes et à jour</li>
            <li>Choisir un mot de passe sécurisé</li>
            <li>Maintenir la confidentialité de vos identifiants de connexion</li>
            <li>Être responsable de toutes les activités effectuées via votre compte</li>
          </ul>
        </div>

        {/* Utilisation de la plateforme */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">3. Utilisation de la Plateforme</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Utilisation autorisée</h3>
          <p className="text-gray-700 mb-4">
            Vous vous engagez à utiliser la plateforme uniquement à des fins légales et conformément aux présentes CGU.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 Comportements interdits</h3>
          <p className="text-gray-700 mb-3">Il est strictement interdit de :</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Publier des contenus illégaux, diffamatoires, obscènes ou offensants</li>
            <li>Usurper l'identité d'une autre personne ou organisation</li>
            <li>Tenter d'accéder de manière non autorisée à des données ou systèmes</li>
            <li>Perturber le fonctionnement de la plateforme (virus, spam, etc.)</li>
            <li>Utiliser des données d'autres utilisateurs sans leur consentement</li>
            <li>Utiliser la plateforme à des fins commerciales sans autorisation</li>
          </ul>
        </div>

        {/* Contenu utilisateur */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">4. Contenu Utilisateur</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Propriété du contenu</h3>
          <p className="text-gray-700 mb-4">
            Vous conservez tous les droits sur les contenus que vous publiez (textes, images, documents). Toutefois,
            en publiant du contenu sur la plateforme, vous accordez à PASCI une licence non exclusive pour utiliser,
            reproduire et diffuser ce contenu dans le cadre de ses missions.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Responsabilité du contenu</h3>
          <p className="text-gray-700 mb-4">
            Vous êtes seul responsable du contenu que vous publiez. PASCI se réserve le droit de supprimer tout
            contenu inapproprié sans préavis.
          </p>
        </div>

        {/* Propriété intellectuelle */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">5. Propriété Intellectuelle</h2>
          <p className="text-gray-700 mb-3">
            La plateforme PASCI, son contenu (textes, images, logos, vidéos), sa structure et son design sont protégés
            par les droits de propriété intellectuelle.
          </p>
          <p className="text-gray-700 mb-3">
            Toute reproduction, distribution ou utilisation non autorisée est strictement interdite, sauf autorisation
            écrite préalable.
          </p>
          <p className="text-gray-700">
            Les logos et marques des CRASC, OSC et partenaires affichés sur la plateforme appartiennent à leurs
            propriétaires respectifs.
          </p>
        </div>

        {/* Responsabilités */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">6. Limitation de Responsabilité</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Disponibilité de la plateforme</h3>
          <p className="text-gray-700 mb-4">
            Nous nous efforçons d'assurer la disponibilité de la plateforme 24h/24. Cependant, nous ne pouvons garantir
            un accès ininterrompu en raison de maintenance, pannes techniques ou cas de force majeure.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Exactitude des informations</h3>
          <p className="text-gray-700 mb-4">
            Nous faisons notre possible pour fournir des informations exactes et à jour. Toutefois, nous ne pouvons
            garantir l'exactitude, la complétude ou la pertinence de toutes les informations publiées.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 Liens externes</h3>
          <p className="text-gray-700">
            La plateforme peut contenir des liens vers des sites externes. Nous ne sommes pas responsables du contenu
            de ces sites tiers.
          </p>
        </div>

        {/* Protection des données */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">7. Protection des Données Personnelles</h2>
          <p className="text-gray-700">
            La collecte et le traitement de vos données personnelles sont régis par notre{' '}
            <a href="/politique-de-confidentialite" className="text-[#E05017] hover:underline font-semibold">
              Politique de Confidentialité
            </a>
            . Nous vous invitons à la consulter pour comprendre comment vos données sont traitées.
          </p>
        </div>

        {/* Suspension et résiliation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">8. Suspension et Résiliation</h2>
          <p className="text-gray-700 mb-3">
            Nous nous réservons le droit de suspendre ou de résilier votre accès à la plateforme à tout moment,
            sans préavis, en cas de :
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-3">
            <li>Violation des présentes CGU</li>
            <li>Utilisation frauduleuse de la plateforme</li>
            <li>Comportement nuisible envers d'autres utilisateurs</li>
            <li>Inactivité prolongée de votre compte (plus de 3 ans)</li>
          </ul>
          <p className="text-gray-700">
            Vous pouvez également demander la suppression de votre compte à tout moment en nous contactant.
          </p>
        </div>

        {/* Modifications des CGU */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">9. Modifications des CGU</h2>
          <p className="text-gray-700">
            Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les modifications entreront
            en vigueur dès leur publication sur cette page. Nous vous encourageons à consulter régulièrement cette
            page. La poursuite de votre utilisation de la plateforme après modification vaut acceptation des nouvelles
            conditions.
          </p>
        </div>

        {/* Droit applicable */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">10. Droit Applicable et Juridiction</h2>
          <p className="text-gray-700 mb-3">
            Les présentes CGU sont régies par le droit ivoirien. Tout litige relatif à l'utilisation de la plateforme
            sera soumis à la compétence exclusive des tribunaux d'Abidjan, Côte d'Ivoire.
          </p>
          <p className="text-gray-700">
            En cas de litige, nous encourageons toutefois une résolution amiable avant toute action judiciaire.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#f0f9ff] border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#2a591d] mb-4">11. Nous Contacter</h2>
          <p className="text-gray-700 mb-3">
            Pour toute question concernant ces Conditions Générales d'Utilisation, vous pouvez nous contacter :
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email :</strong> <a href="mailto:pdoc@plateforme-osci.org" className="text-[#E05017] hover:underline">pdoc@plateforme-osci.org</a></p>
            <p><strong>Téléphone :</strong> 05 05 56 57 41</p>
            <p><strong>Adresse :</strong> 15, avenue Jean Mermoz, Cocody, Abidjan, Côte d'Ivoire</p>
          </div>
        </div>

        {/* Acceptation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 italic text-center">
            En utilisant la plateforme PASCI, vous reconnaissez avoir lu, compris et accepté les présentes
            Conditions Générales d'Utilisation.
          </p>
        </div>

      </div>
    </section>
  );
}
