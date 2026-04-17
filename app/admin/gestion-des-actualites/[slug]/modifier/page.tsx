"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrasc, IOsc } from "@/types/api.types";
import { fetchAllCrasc, fetchAllOsc } from "@/lib/fetch-crasc";
import { newsService } from "@/lib/services/news.service";
import Image from "next/image";
import ClientTextEditor from "@/components/ui/ClientTextEditor";
import {
    ArrowLeft,
    Newspaper,
    FileText,
    Upload,
    X,
    Check,
    Loader2,
    AlertCircle,
    ChevronDown,
    Image as ImageIcon,
    Building2
} from 'lucide-react';

const newsSchema = z.object({
    title: z.string().min(8, "Le titre doit contenir au moins 8 caractères."),
    content: z.string().optional(),
    crasc_id: z.string().optional(),
    osc_id: z.string().optional(),
    thumbnail: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024,
            { message: "L'image doit être inférieure à 5MB" }
        )
        .refine(
            (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
            { message: "Format non supporté. Utilisez JPG, PNG ou WebP" }
        ),
});

type NewsForm = z.infer<typeof newsSchema>;

export default function EditNewsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
    const [oscs, setOscs] = useState<IOsc[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<NewsForm>({
        resolver: zodResolver(newsSchema),
        defaultValues: { title: "", content: "", crasc_id: "", osc_id: "" },
    });

    const thumbnailFile = watch("thumbnail");

    // Charger les données
    useEffect(() => {
        const loadData = async () => {
            try {
                const [newsData, crascData, oscData] = await Promise.all([
                    newsService.getBySlug(slug),
                    fetchAllCrasc(),
                    fetchAllOsc()
                ]);

                // Pré-remplir le formulaire
                reset({
                    title: newsData.title,
                    content: newsData.content || "",
                    crasc_id: newsData.crasc_id?.toString() || "",
                    osc_id: newsData.osc_id?.toString() || "",
                });

                setCurrentThumbnail(newsData.thumbnail_url || null);
                setCrascRegions(crascData);
                setOscs(oscData.items);
            } catch (error: any) {
                setErrorMessage(error.message || "Erreur lors du chargement");
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, [slug, reset]);

    // Preview de l'image
    useEffect(() => {
        if (thumbnailFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(thumbnailFile);
        } else {
            setPreviewImage(null);
        }
    }, [thumbnailFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setValue("thumbnail", file);
    };

    const handleRemoveImage = () => {
        setValue("thumbnail", undefined);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (values: NewsForm) => {
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await newsService.update(slug, {
                title: values.title,
                content: values.content,
                thumbnail: values.thumbnail,
                crasc_id: values.crasc_id ? parseInt(values.crasc_id) : undefined,
                osc_id: values.osc_id ? parseInt(values.osc_id) : undefined,
            });

            setSuccessMessage("✅ Actualité mise à jour avec succès!");

            setTimeout(() => {
                router.push("/admin/gestion-des-actualites");
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#2A591D] mx-auto mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-8 text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Newspaper className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Modifier l'Actualité</h1>
                            <p className="text-white/80 mt-1">Mettez à jour les informations de l'actualité</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/gestion-des-actualites"
                        className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la gestion des actualités
                    </Link>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-800 font-medium">{successMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800 font-medium">{errorMessage}</p>
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Informations de base */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <FileText className="w-5 h-5 text-[#2A591D]" />
                            <h2 className="text-xl font-bold text-gray-900">Informations de base</h2>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                Titre de l'actualité <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                {...control.register("title")}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all ${errors.title ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Titre de l'actualité"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contenu de l'actualité
                            </label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <ClientTextEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Rédigez le contenu..."
                                        error={!!errors.content}
                                        name="content"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Associations */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <Building2 className="w-5 h-5 text-[#2A591D]" />
                            <h2 className="text-xl font-bold text-gray-900">Associations</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">CRASC associé</label>
                                <Controller
                                    name="crasc_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select.Root onValueChange={field.onChange} value={field.value}>
                                            <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all flex items-center justify-between">
                                                <Select.Value placeholder="Sélectionnez un CRASC" />
                                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                            </Select.Trigger>
                                            <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto z-50">
                                                <Select.Viewport>
                                                    {crascRegions.map((region) => (
                                                        <Select.Item
                                                            key={region.id}
                                                            value={region.id.toString()}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                                        >
                                                            <Select.ItemText>{region.name}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Root>
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">OSC associée</label>
                                <Controller
                                    name="osc_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select.Root onValueChange={field.onChange} value={field.value}>
                                            <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all flex items-center justify-between">
                                                <Select.Value placeholder="Sélectionnez une OSC" />
                                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                            </Select.Trigger>
                                            <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto z-50">
                                                <Select.Viewport>
                                                    {oscs.map((osc) => (
                                                        <Select.Item
                                                            key={osc.id}
                                                            value={osc.id.toString()}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                                        >
                                                            <Select.ItemText>{osc.name}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Root>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <ImageIcon className="w-5 h-5 text-[#2A591D]" />
                            <h2 className="text-xl font-bold text-gray-900">Image de couverture</h2>
                        </div>

                        {/* Image actuelle */}
                        {currentThumbnail && !previewImage && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Image actuelle:</p>
                                <div className="relative w-64 h-48 rounded-lg overflow-hidden">
                                    <Image src={currentThumbnail} alt="Current" fill className="object-cover" />
                                </div>
                            </div>
                        )}

                        <div
                            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-gray-300 hover:border-[#2A591D] hover:bg-gray-50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg, image/jpg, image/png, image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {previewImage ? (
                                <div className="flex flex-col items-center">
                                    <div className="relative w-64 h-48 mb-4 rounded-lg overflow-hidden">
                                        <Image src={previewImage} alt="Aperçu" fill className="object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Annuler le changement
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-700 font-medium mb-1">
                                        Cliquez pour changer l'image
                                    </p>
                                    <p className="text-gray-500 text-sm">JPG, PNG ou WebP • Max 5MB</p>
                                </>
                            )}
                        </div>

                        {errors.thumbnail && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.thumbnail.message}
                            </p>
                        )}
                    </div>

                    {/* Boutons */}
                    <div className="flex items-center justify-between gap-4 pt-4">
                        <Link
                            href="/admin/gestion-des-actualites"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Annuler
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-[#2A591D] to-[#3d7a28] text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Mise à jour...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Mettre à jour
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
