import Link from "next/link";
import { fetchAllOsc } from "@/lib/fetch-crasc";
import { ImageWithFallback } from "@/lib/imageWithFallback";

export default async function AdminOscPage() {
  const oscs = await fetchAllOsc();

  return (
    <div className="max-w-7xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/admin/gestion-des-crasc" className="text-sm text-blue-600 hover:underline">
          ← Aller à la gestion des CRASC
        </Link>
        <Link
          href="/admin/gestion-des-crasc/osc/ajouter-osc"
          className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
        >
          Ajouter une OSC
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Gestion des OSC
      </h1>
      <p className="text-gray-600 mb-6">
        Liste des Organisations de la Société Civile ({oscs.length} OSC{oscs.length > 1 ? 's' : ''})
      </p>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CRASC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ville
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {oscs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Aucune OSC trouvée. Commencez par ajouter une OSC.
                </td>
              </tr>
            ) : (
              oscs.map((osc) => (
                <tr key={osc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={osc.thumbnail_url || "/images/default-osc-logo.png"}
                        alt={osc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {osc.name}
                    </div>
                    {osc.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {osc.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {osc.type?.name || "Non spécifié"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {osc.crasc?.name || "Non spécifié"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {osc.ville || "Non spécifié"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1 max-w-[200px]">
                      {osc.email && (
                        <div className="text-gray-600 truncate" title={osc.email}>
                          📧 {osc.email}
                        </div>
                      )}
                      {osc.phone && (
                        <div className="text-gray-600 truncate" title={osc.phone}>
                          📞 {osc.phone}
                        </div>
                      )}
                      {!osc.email && !osc.phone && (
                        <span className="text-gray-400">Aucun contact</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/gestion-des-crasc/osc/${osc.slug}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Gérer
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {oscs.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 bg-white rounded-lg p-4 border border-gray-200">
          <p className="font-semibold mb-2">💡 Actions disponibles:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Cliquez sur "Gérer" pour modifier ou supprimer une OSC</li>
            <li>Utilisez le bouton "Ajouter une OSC" pour enregistrer une nouvelle OSC</li>
            <li>Assurez-vous d'avoir créé les types d'OSC et les CRASC avant d'ajouter des OSC</li>
          </ul>
        </div>
      )}
    </div>
  );
}
