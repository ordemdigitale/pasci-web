import {
	fetchAllCrasc,
	fetchAllRegion,
	fetchAllOscType,
	fetchAllOsc,
	fetchAllNews
} from "@/lib/fetch-crasc";
import { SquarePen } from "lucide-react";
import Link from "next/link";

export default async function AdminCrascPage() {
  const allCrasc = await fetchAllCrasc();
	const allRegion = await fetchAllRegion();
	const allOscType = await fetchAllOscType();
	const allOsc = await fetchAllOsc();
	const allNews = await fetchAllNews();

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Gestion des CRASC, leurs OSC et Régions.</h2>
				<Link href="/admin" className="underline mt-4 text-sm text-blue-600">
					← Aller au tableau de bord
				</Link>
			</div>

			{/* Liste des CRASC */}
			<div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-medium">
						Les CRASC
					</h3>
					<Link href="/admin/gestion-des-crasc/ajouter-crasc" className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors">
						Ajouter un CRASC
					</Link>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					{allCrasc.map((crasc) => (
						<div key={crasc.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#2A591D] transition-colors">
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
							{/* Liste des OSC */}
							{allOsc.map((osc) => (
								<tr key={osc.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osc.name}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osc.type?.name}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osc.crasc?.name}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Liste des actualités */}
			<div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium mb-4">
						Les Actualités
						<p className="mt-1.5 text-sm font-normal text-body">Actualités récemment ajoutées.</p>
					</h3>
					<Link href="/admin/gestion-des-crasc/articles/ajouter-article" className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors">
						Ajouter une actualité
					</Link>
				</div>
				{/* list */}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITRE</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRASC</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OSC</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{/* Les actualités */}
							{allNews.map((news) => (
								<tr key={news.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{news.title}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{news.crasc?.name || '-'}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{news.osc?.name || '-'}</td>
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
							<Link href="/admin/gestion-des-crasc/type-de-osc">
								Les Types de OSC
							</Link>
						</h3>
						<Link href="/admin/gestion-des-crasc/type-de-osc/ajouter-type-de-osc" className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors">
							Ajouter un type de OSC
						</Link>
					</div>
					{/* list  */}
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
							{allOscType.map((osctype) => (
								<tr key={osctype.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										<Link href={`/admin/gestion-des-crasc/type-de-osc/${osctype.slug}`}>
											{osctype.name}
										</Link>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										<Link
                    href={`/admin/gestion-des-crasc/type-de-osc/${osctype.slug}`}
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
								{allRegion.map((region) => (
									<tr key={region.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.name}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{region.crasc_region?.name || '-'}</td>
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
