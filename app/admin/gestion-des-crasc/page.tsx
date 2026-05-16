import {
	fetchAllCrasc,
	fetchAllRegion,
	fetchAllOscType,
	fetchAllOsc,
	fetchAllNews
} from "@/lib/fetch-crasc";
import Link from "next/link";
import {
	Building2,
	Users,
	MapPin,
	Tag,
	Newspaper,
	CalendarDays,
	Plus,
	ArrowRight,
	Home,
	ExternalLink,
	Edit3,
	Eye
} from 'lucide-react';

export default async function AdminCrascPage() {
	const allCrasc = await fetchAllCrasc();
	const allRegion = await fetchAllRegion();
	const allOscType = await fetchAllOscType();
	const oscData = await fetchAllOsc(1, 10);
	const allNews = await fetchAllNews();

	return (
		<section className="max-w-7xl mx-auto font-poppins py-8 px-4">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<Building2 className="w-8 h-8 text-[#2A591D]" />
							Gestion des CRASC
						</h1>
						<p className="text-gray-600 mt-2">Gérez les CRASC, leurs OSC, régions et actualités</p>
					</div>
					<Link
						href="/admin"
						className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
					>
						<Home className="w-4 h-4" />
						Tableau de bord
					</Link>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-white rounded-xl border-2 border-gray-200 p-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<Building2 className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600 font-medium">CRASC</p>
								<p className="text-2xl font-bold text-gray-900">{allCrasc.length}</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl border-2 border-gray-200 p-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
								<Users className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600 font-medium">OSC</p>
								<p className="text-2xl font-bold text-gray-900">{oscData.total}</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl border-2 border-gray-200 p-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
								<MapPin className="w-5 h-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600 font-medium">Régions et districts</p>
								<p className="text-2xl font-bold text-gray-900">{allRegion.length}</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl border-2 border-gray-200 p-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
								<Newspaper className="w-5 h-5 text-orange-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600 font-medium">Actualités</p>
								<p className="text-2xl font-bold text-gray-900">{allNews.length}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* CRASC Section */}
			<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm mb-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
							<Building2 className="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900">Les CRASC</h2>
							<p className="text-sm text-gray-600">Centres régionaux d'appui</p>
						</div>
					</div>
					<Link
						href="/admin/gestion-des-crasc/ajouter-crasc"
						className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
					>
						<Plus className="w-4 h-4" />
						Ajouter un CRASC
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
					{allCrasc.map((crasc) => (
						<Link
							key={crasc.id}
							href={`/admin/gestion-des-crasc/${crasc.slug}`}
							className="group p-4 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
						>
							<div className="flex items-start justify-between mb-3">
								<Building2 className="w-5 h-5 text-blue-600" />
								<ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
							</div>
							<h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
								{crasc.name}
							</h3>
							<div className="flex items-center gap-1 text-sm text-gray-600">
								<Users className="w-3 h-3" />
								<span>{crasc.osc_count} OSC</span>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* OSC Section */}
			<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm mb-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
							<Users className="w-5 h-5 text-green-600" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900">Les OSC</h2>
							<p className="text-sm text-gray-600">Organisations récemment ajoutées</p>
						</div>
					</div>
					<Link
						href="/admin/gestion-des-crasc/osc/ajouter-osc"
						className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
					>
						<Plus className="w-4 h-4" />
						Ajouter une OSC
					</Link>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									OSC
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									Type
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									CRASC
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{oscData.items.map((osc) => (
								<tr key={osc.id} className="hover:bg-gray-50 transition-colors">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Users className="w-4 h-4 text-gray-400" />
											<span className="text-sm font-semibold text-gray-900">{osc.name}</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
											<Tag className="w-3 h-3" />
											{osc.type?.name || '-'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{osc.crasc?.name || '-'}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<Link
											href={`/admin/gestion-des-crasc/osc/${osc.slug}`}
											className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
										>
											Voir
											<ExternalLink className="w-3 h-3" />
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{oscData.total > 10 && (
						<div className="mt-4 text-center">
							<p className="text-sm text-gray-600">
								Affichage de 10 sur {oscData.total} OSC
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Actualités Section */}
			<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm mb-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
							<Newspaper className="w-5 h-5 text-orange-600" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900">Les Actualités</h2>
							<p className="text-sm text-gray-600">Actualités récemment ajoutées</p>
						</div>
					</div>
					<Link
						href="/admin/gestion-des-crasc/articles/ajouter-article"
						className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
					>
						<Plus className="w-4 h-4" />
						Ajouter une actualité
					</Link>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									Titre
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									CRASC
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									OSC
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{allNews.slice(0, 10).map((news) => (
								<tr key={news.id} className="hover:bg-gray-50 transition-colors">
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<Newspaper className="w-4 h-4 text-gray-400 flex-shrink-0" />
											<span className="text-sm font-semibold text-gray-900 line-clamp-1">{news.title}</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{news.crasc?.name || '-'}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{news.osc?.name || '-'}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<div className="flex items-center gap-2">
											<Link
												href={`/actualites/${news.slug}`}
												className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
												title="Voir l'actualité"
											>
												<Eye className="w-3.5 h-3.5" />
												Voir
											</Link>
											<Link
												href={`/admin/gestion-des-crasc/articles/${news.slug}/modifier`}
												className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
												title="Modifier l'actualité"
											>
												<Edit3 className="w-3.5 h-3.5" />
												Modifier
											</Link>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{allNews.length > 10 && (
						<div className="mt-4 text-center">
							<p className="text-sm text-gray-600">
								Affichage de 10 sur {allNews.length} actualités
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Agenda Section */}
			<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm mb-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
							<CalendarDays className="w-5 h-5 text-indigo-600" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900">Agenda des CRASC</h2>
							<p className="text-sm text-gray-600">Événements et activités à venir</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Link
							href="/admin/gestion-des-crasc/agenda/ajouter-evenement"
							className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
						>
							<Plus className="w-4 h-4" />
							Ajouter un événement
						</Link>
						<Link
							href="/admin/gestion-des-crasc/agenda"
							className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-200 text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
						>
							Gérer l'agenda
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</div>

			{/* Secondary Sections Grid */}
			<div className="grid md:grid-cols-2 gap-6">
				{/* Types de OSC */}
				<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
								<Tag className="w-5 h-5 text-purple-600" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-gray-900">
									<Link href="/admin/gestion-des-crasc/type-de-osc" className="hover:text-purple-600 transition-colors">
										Types de OSC
									</Link>
								</h3>
								<p className="text-sm text-gray-600">{allOscType.length} type(s)</p>
							</div>
						</div>
						<Link
							href="/admin/gestion-des-crasc/type-de-osc/ajouter-type-de-osc"
							className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
						>
							<Plus className="w-4 h-4" />
							Ajouter
						</Link>
					</div>

					<div className="space-y-2">
						{allOscType.slice(0, 5).map((osctype) => (
							<Link
								key={osctype.id}
								href={`/admin/gestion-des-crasc/type-de-osc/${osctype.slug}`}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all group"
							>
								<span className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
									{osctype.name}
								</span>
								<ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
							</Link>
						))}
					</div>
				</div>

				{/* Régions */}
				<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
								<MapPin className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-gray-900">
									<Link href="/admin/gestion-des-crasc/regions" className="hover:text-green-600 transition-colors">
										Régions et districts de Côte d'Ivoire
									</Link>
								</h3>
								<p className="text-sm text-gray-600">{allRegion.length} régions et districts</p>
							</div>
						</div>
						<Link
							href="/admin/gestion-des-crasc/regions"
							className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
						>
							<Plus className="w-4 h-4" />
							Gérer
						</Link>
					</div>

					<div className="space-y-2 max-h-64 overflow-y-auto">
						{allRegion.map((region) => (
							<div
								key={region.id}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
							>
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4 text-green-600" />
									<span className="text-sm font-semibold text-gray-900">{region.name}</span>
								</div>
								<span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
									{region.crasc_region?.name || 'Non assigné'}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
