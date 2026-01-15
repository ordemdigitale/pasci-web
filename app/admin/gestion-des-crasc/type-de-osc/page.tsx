import Link from "next/link";
import { fetchAllOscType } from "@/lib/fetch-crasc";

export default async function AdminOscTypesPage() {
  const oscTypes = await fetchAllOscType();
  
  return (
    <div className="max-w-6xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/admin/gestion-des-crasc" className="text-sm text-blue-600 hover:underline">
          ← Aller à la gestion des CRASC
        </Link>
        <Link href="/admin/gestion-des-crasc/type-de-osc/ajouter-type-de-osc" className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors">
          Ajouter un type de OSC
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Types d'OSC</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {oscTypes.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{type.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {type.description || "Aucune description"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* <Link
                    href={`/admin/osc-types/${type.slug}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Modifier
                  </Link> */}
                  <Link
                    href={`/admin/gestion-des-crasc/type-de-osc/${type.slug}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}