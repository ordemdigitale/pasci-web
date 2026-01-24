import React from 'react';
import Link from 'next/link';
import { INews } from '@/types/api.types';
import { ImageWithFallback } from '@/lib/imageWithFallback';
import { Calendar, Edit, Trash2, ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';

interface NewsCardProps {
    news: INews;
    variant?: 'default' | 'compact' | 'featured';
    showActions?: boolean;
    onEdit?: (news: INews) => void;
    onDelete?: (news: INews) => void;
}

export default function NewsCard({
    news,
    variant = 'default',
    showActions = false,
    onEdit,
    onDelete,
}: NewsCardProps) {
    // Compact variant - for sidebar or lists
    if (variant === 'compact') {
        return (
            <Link
                href={`/actualites/${news.slug}`}
                className="flex gap-4 group cursor-pointer"
            >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <ImageWithFallback
                        src={news.thumbnail_url || '/images/default-news.jpg'}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="flex flex-col justify-center flex-1">
                    <span className="text-[10px] font-bold text-[#E05017] uppercase mb-1">
                        {news.crasc?.name || 'Actualité'}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-[#E05017] transition-colors">
                        {news.title}
                    </h4>
                    {news.created_at && (
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(news.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    )}
                </div>
            </Link>
        );
    }

    // Featured variant - for hero sections
    if (variant === 'featured') {
        return (
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Large Image */}
                <div className="aspect-[16/9] overflow-hidden relative">
                    <ImageWithFallback
                        src={news.thumbnail_url || '/images/default-news.jpg'}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* CRASC Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-[#E05017] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                            {news.crasc?.name || 'Actualité'}
                        </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-3xl font-bold mb-3 line-clamp-2">
                            {news.title}
                        </h2>
                        {news.content && (
                            <p
                                className="text-white/90 text-sm line-clamp-2 mb-4"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(news.content.replace(/<[^>]*>/g, ''))
                                }}
                            />
                        )}
                        {news.created_at && (
                            <div className="flex items-center gap-2 text-xs text-white/80">
                                <Calendar className="w-4 h-4" />
                                {new Date(news.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Read More Link */}
                <Link
                    href={`/actualites/${news.slug}`}
                    className="absolute inset-0 z-10"
                >
                    <span className="sr-only">Lire l'article: {news.title}</span>
                </Link>
            </div>
        );
    }

    // Default variant - standard card
    return (
        <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
            {/* Image */}
            <div className="aspect-video overflow-hidden relative">
                <ImageWithFallback
                    src={news.thumbnail_url || '/images/default-news.jpg'}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* CRASC Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {news.crasc?.name || 'Actualité'}
                    </span>
                </div>

                {/* Admin Actions */}
                {showActions && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(news);
                                }}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                                title="Modifier"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(news);
                                }}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                                title="Supprimer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 pb-16">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                    {news.title}
                </h3>
                {news.content && (
                    <p
                        className="text-gray-600 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(news.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...')
                        }}
                    />
                )}
                {news.created_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(news.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                )}
            </div>

            {/* Read More Link */}
            <Link
                href={`/actualites/${news.slug}`}
                className="absolute bottom-0 left-0 right-0 p-5 text-[#2a591d] font-semibold text-sm transition-colors inline-flex items-center group/link"
            >
                Lire l'article
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
