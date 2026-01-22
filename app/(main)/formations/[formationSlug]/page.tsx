"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ImageWithFallback } from '@/lib/imageWithFallback';
import {
  Play,
  CheckCircle,
  Lock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Star,
  Users,
  BookOpen,
  Maximize
} from 'lucide-react';
import Link from 'next/link';

interface ILesson {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface IModule {
  id: number;
  title: string;
  lessons: ILesson[];
}

interface IFormation {
  id: number;
  title: string;
  slug: string;
  description: string;
  currentLesson: number;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  rating: number;
  reviews: number;
  students: number;
  instructor: {
    name: string;
    avatar: string;
    note: string;
  };
  modules: IModule[];
  resources: Array<{
    id: number;
    name: string;
    size: string;
    type: 'pdf' | 'zip' | 'doc';
  }>;
  videoUrl?: string;
  videoDuration?: string;
  currentTime?: string;
}

// Mock data
const mockFormation: IFormation = {
  id: 1,
  title: "Comprendre le Virtual DOM en profondeur",
  slug: "virtual-dom-profondeur",
  description: "Dans cette leçon, nous décortiquons la mécanique du Virtual DOM. Nous explorerons pourquoi la manipulation directe du DOM est coûteuse et comment React utilise un algorithme de diffing pour optimiser les performances de rendu.",
  currentLesson: 2,
  progress: 65,
  totalLessons: 18,
  completedLessons: 12,
  rating: 4.8,
  reviews: 1200,
  students: 15432,
  instructor: {
    name: "Prof. Alex Chen",
    avatar: "/images/instructor-avatar.jpg",
    note: "Assurez-vous d'essayer les exercices de codage dans les fichiers de départ avant de passer à la leçon suivante. Ce module est le fondement de tout ce qui suit."
  },
  modules: [
    {
      id: 1,
      title: "Module 1 : Introduction",
      lessons: [
        { id: 1, title: "01. Présentation du cours", type: "video", duration: "4:20", completed: true, locked: false },
        { id: 2, title: "02. Bases du Virtual DOM", type: "video", duration: "12:45", completed: false, locked: false },
        { id: 3, title: "03. Configuration de l'environnement", type: "article", duration: "8 min", completed: false, locked: false }
      ]
    },
    {
      id: 2,
      title: "Module 2 : React Avancé",
      lessons: [
        { id: 4, title: "04. Hooks personnalisés", type: "video", duration: "18:30", completed: false, locked: false },
        { id: 5, title: "05. Server Side Rendering", type: "video", duration: "22:15", completed: false, locked: true }
      ]
    }
  ],
  resources: [
    { id: 1, name: "DOM_Deep_Dive.pdf", size: "12.4 MB", type: "pdf" },
    { id: 2, name: "Starter_Project.zip", size: "45.8 MB", type: "zip" }
  ],
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  videoDuration: "12:45",
  currentTime: "04:37"
};

export default function FormationDetailPage() {
  const params = useParams();
  const formationSlug = params.formationSlug as string;

  const [formation, setFormation] = useState<IFormation | null>(mockFormation);
  const [loading, setLoading] = useState(false);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'zip':
        return <Download className="w-6 h-6 text-blue-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  if (!formation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Formation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-10 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 text-[#E05017]">
              <ImageWithFallback
                src="/images/logo.png"
                alt="PASCI Logo"
                className="w-8 h-8"
              />
              <h2 className="text-lg font-bold">PASCI Education</h2>
            </Link>
            <nav className="hidden lg:flex items-center gap-9">
              <Link href="/formations" className="text-sm font-medium hover:text-[#E05017]">Mes cours</Link>
              <Link href="/ressources/documentation" className="text-sm font-medium hover:text-[#E05017]">Ressources</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/profile" className="w-10 h-10 bg-[#E05017] rounded-full flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex overflow-hidden">
        {/* Sidebar - Navigation des leçons */}
        <aside className="w-80 border-r border-gray-200 bg-white flex-col hidden lg:flex h-[calc(100vh-64px)] sticky top-16 ml-4 lg:ml-8">
          {/* Progress */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-base font-bold">Progression globale</p>
                <p className="text-[#E05017] text-sm font-bold">{formation.progress}%</p>
              </div>
              <div className="rounded-full h-2 bg-gray-200 overflow-hidden">
                <div className="h-2 rounded-full bg-[#E05017]" style={{ width: `${formation.progress}%` }}></div>
              </div>
              <p className="text-gray-600 text-xs">
                {formation.completedLessons} sur {formation.totalLessons} leçons terminées
              </p>
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-3 text-gray-600">
              Navigation des leçons
            </h2>
            <div className="flex flex-col gap-6">
              {formation.modules.map((module) => (
                <div key={module.id}>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3 text-gray-500">
                    {module.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${
                          lesson.id === formation.currentLesson
                            ? 'bg-[#E05017]/10 border border-[#E05017]/20'
                            : lesson.completed
                            ? 'hover:bg-gray-100'
                            : lesson.locked
                            ? 'opacity-60'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5 text-[#E05017] fill-current" />
                        ) : lesson.locked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : lesson.id === formation.currentLesson ? (
                          <Play className="w-5 h-5 text-[#E05017]" />
                        ) : lesson.type === 'article' ? (
                          <FileText className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-600" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm font-medium line-clamp-1 ${
                            lesson.id === formation.currentLesson ? 'text-[#E05017] font-bold' : ''
                          }`}>
                            {lesson.title}
                          </p>
                          <p className={`text-[10px] ${
                            lesson.id === formation.currentLesson ? 'text-[#E05017]/70' : 'text-gray-500'
                          }`}>
                            {lesson.locked ? 'Verrouillé' : `${lesson.type === 'video' ? 'Vidéo' : 'Lecture'} • ${lesson.duration}`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Mode Button */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-[#E05017] text-white text-sm font-bold hover:bg-[#c44315] transition-colors">
              <Maximize className="w-4 h-4" />
              Mode Focus
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-[1000px] mx-auto p-4 md:p-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#E05017] font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  Module 1 • Leçon 2
                </div>
                <h1 className="text-3xl font-black leading-tight">{formation.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {formation.rating} ({formation.reviews.toLocaleString()} avis)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formation.students.toLocaleString()} Étudiants
                  </span>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-gray-200 text-sm font-bold hover:bg-gray-50">
                <Share2 className="w-4 h-4" />
                Partager
              </button>
            </div>

            {/* Video Player */}
            <div className="mb-8">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src={formation.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={formation.title}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-8">
                {/* Lesson Details */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#E05017]" />
                    Détails de la leçon
                  </h2>
                  <div className="text-gray-600 text-base leading-relaxed space-y-4">
                    <p>{formation.description}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Processus de réconciliation et algorithme de "diffing".</li>
                      <li>Mises à jour groupées (batching) pour de meilleures performances.</li>
                      <li>Comprendre les clés (keys) et leur rôle dans le Virtual DOM.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Resources */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#E05017]" />
                    Supports de cours
                  </h2>
                  <div className="flex flex-col gap-3">
                    {formation.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all group"
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded ${
                          resource.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-bold truncate">{resource.name}</p>
                          <p className="text-[10px] text-gray-500">{resource.size}</p>
                        </div>
                        <Download className="w-4 h-4 text-gray-600 group-hover:text-[#E05017]" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1 rounded-lg h-12 bg-white border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </button>
                  <button className="flex items-center justify-center gap-1 rounded-lg h-12 bg-[#E05017] text-white text-xs font-black hover:bg-[#c44315] transition-all">
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg h-12 bg-white border-2 border-[#E05017] text-[#E05017] text-sm font-black hover:bg-[#E05017] hover:text-white transition-all">
                  Terminer et continuer
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
