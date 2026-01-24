import Link from 'next/link';
import { ICrasc } from '@/types/api.types';
import { Building2, Users, MapPin, ArrowRight } from 'lucide-react';

interface CrascCardProps {
    crasc: ICrasc;
    showDetails?: boolean;
    className?: string;
}

export function CrascCard({ crasc, showDetails = true, className = '' }: CrascCardProps) {
    return (
        <Link
            href={`/annuaire/annuaire-des-crasc/${crasc.slug}`}
            className={`group block bg-white rounded-xl border-2 border-gray-200 hover:border-[#E05017] hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E05017] to-[#d04010] p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Building2 className="w-7 h-7 text-white" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:underline truncate">
                            {crasc.name}
                        </h3>
                        {crasc.osc_count !== undefined && (
                            <div className="flex items-center gap-2 text-white/90">
                                <Users className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    {crasc.osc_count} OSC{crasc.osc_count > 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            {showDetails && (
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-medium">
                            Voir les détails
                        </span>
                        <ArrowRight className="w-5 h-5 text-[#E05017] group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            )}
        </Link>
    );
}

// Compact version for lists
interface CrascCardCompactProps {
    crasc: ICrasc;
    className?: string;
}

export function CrascCardCompact({ crasc, className = '' }: CrascCardCompactProps) {
    return (
        <Link
            href={`/annuaire/annuaire-des-crasc/${crasc.slug}`}
            className={`group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-[#E05017] hover:shadow-md transition-all ${className}`}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E05017]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#E05017]" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#E05017] transition-colors">
                        {crasc.name}
                    </h4>
                    {crasc.osc_count !== undefined && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Users className="w-3 h-3" />
                            {crasc.osc_count} OSC{crasc.osc_count > 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E05017] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
    );
}
