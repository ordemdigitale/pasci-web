import {
	fetchAllCrascRegions, fetchAllRegionCiv, fetchAllOscType,
	fetchAllOsc
} from "@/lib/fetch-crasc";
import Link from "next/link";

export default async function AdminCrascPage() {
  const allCrascRegions = await fetchAllCrascRegions();
	const allRegionCivs = await fetchAllRegionCiv();
	const allOscType = await fetchAllOscType();
	const allOsc = await fetchAllOsc();

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Gestion des CRASC, leurs OSC et Régions.</h2>
				<Link href="/admin" className="underline mt-4 text-sm text-blue-600">
					Aller au tableau de bord
				</Link>
			</div>

			{/* Liste des CRASC */}
			<div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
				<h3 className="text-lg font-medium mb-4">
          Les CRASC
        </h3>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					{allCrascRegions.map((crasc) => (
						<div key={crasc.order} className="p-4 border border-gray-200 rounded-lg hover:border-[#2A591D] transition-colors">
							<div className="flex items-center gap-2 mb-2">
								<p className="text-gray-800 font-bold hover:cursor-pointer">
									<Link href={`/admin/gestion-des-crasc/${crasc.slug}`} className="hover:text-[#2A591D]">
										{crasc.name}
									</Link>
								</p>
							</div>
							<p className="text-gray-600 text-sm">Nombre de OSC: {crasc.osc_count}</p>
						</div>
					))}
				</div>
			</div>

			{/* Liste des OSCs */}
			<div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium mb-4">
						Les Organisations de la Société Civile
						<p className="mt-1.5 text-sm font-normal text-body">OSCs récemment ajoutées.</p>
					</h3>
					<Link href="/admin/gestion-des-crasc/osc/ajouter-osc" className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors">
						Ajouter une OSC
					</Link>
				</div>
				{/* list */}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OSC</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE DE OSC</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRASC</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{/* les crasc ici */}
							{allOsc.map((osc) => (
								<tr key={osc.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osc.name}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osc.type.name}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osc.region.name}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2">
				{/* Liste des Types de Oscs */}
				<div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium mb-4">
							Les Types de OSC
						</h3>
						<Link href="/admin/gestion-des-crasc/type-de-osc/ajouter-type-de-osc" className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors">
							Ajouter un type de OSC
						</Link>
					</div>
					{/* list  */}
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							
							<tbody className="bg-white divide-y divide-gray-200">
							{allOscType.map((osctype) => (
								<tr key={osctype.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osctype.name}</td>
								</tr>
							))}

							</tbody>
						</table>
					</div>
				</div>

				{/* Liste des Régions CIV */}
				<div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium mb-4">
							Les Régions de la Côte d'Ivoire
						</h3>
						<Link href="/admin/gestion-des-crasc/ajouter-region" className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors">
							Ajouter une région
						</Link>
					</div>
					{/* list regions with their respective CRASC */}
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Région</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRASC</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{allRegionCivs.map((region) => (
									<tr key={region.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.name}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{region.crasc_region.name || '-'}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* Place regions civ in a table data with pagination */}
				</div>
			</div>			
    </section>
  )
}
