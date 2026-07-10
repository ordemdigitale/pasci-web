"use client";

import { useState, useEffect, useRef } from 'react';
import { CreditCard, Save, Image as ImageIcon, X } from 'lucide-react';
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formationImage, setFormationImage] = useState<string | null>(null);
  const [newFormationImage, setNewFormationImage] = useState<File | null>(null);
  const [formationPreview, setFormationPreview] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [imageSaved, setImageSaved] = useState(false);
  const [waveNumber, setWaveNumber] = useState("");
  const [orangeMoneyNumber, setOrangeMoneyNumber] = useState("");
  const [savingPaymentNumbers, setSavingPaymentNumbers] = useState(false);
  const [paymentNumbersSaved, setPaymentNumbersSaved] = useState(false);
  const [paymentNumbersError, setPaymentNumbersError] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        const [configResponse, paymentResponse] = await Promise.all([
          fetchWithAuth(`${API_BASE}/api/v1/config`),
          fetchWithAuth(`${API_BASE}/api/v1/config/payment-numbers`),
        ]);

        if (configResponse.ok) {
          const cfg: Record<string, string> = await configResponse.json();
          if (cfg.formation_default_image) setFormationImage(cfg.formation_default_image);
        }

        if (paymentResponse.ok) {
          const paymentNumbers: { wave_number?: string; orange_money_number?: string } = await paymentResponse.json();
          setWaveNumber(paymentNumbers.wave_number || "");
          setOrangeMoneyNumber(paymentNumbers.orange_money_number || "");
        }
      } catch {}
    }
    loadConfig();
  }, []);

  const handleImageFile = (file: File) => {
    setNewFormationImage(file);
    setFormationPreview(URL.createObjectURL(file));
  };

  const saveFormationImage = async () => {
    if (!newFormationImage) return;
    setSavingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", newFormationImage);
      const res = await fetchWithAuth(`${API_BASE}/api/v1/config/upload/formation_default_image`, { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormationImage(data.value);
        setNewFormationImage(null);
        setFormationPreview(null);
        setImageSaved(true);
        setTimeout(() => setImageSaved(false), 2000);
      }
    } finally {
      setSavingImage(false);
    }
  };

  const savePaymentNumbers = async () => {
    setPaymentNumbersError("");
    if (!waveNumber.trim() || !orangeMoneyNumber.trim()) {
      setPaymentNumbersError("Veuillez renseigner les deux numéros de paiement.");
      return;
    }

    setSavingPaymentNumbers(true);
    try {
      const [waveResponse, orangeResponse] = await Promise.all([
        fetchWithAuth(`${API_BASE}/api/v1/config/payment_wave_number`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: waveNumber.trim() }),
        }),
        fetchWithAuth(`${API_BASE}/api/v1/config/payment_orange_money_number`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: orangeMoneyNumber.trim() }),
        }),
      ]);

      if (!waveResponse.ok || !orangeResponse.ok) {
        throw new Error("Enregistrement impossible.");
      }

      setPaymentNumbersSaved(true);
      setTimeout(() => setPaymentNumbersSaved(false), 2000);
    } catch (error) {
      setPaymentNumbersError(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      setSavingPaymentNumbers(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="space-y-6">
        {/* Numéros de paiement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-[#2a591d]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Numéros de paiement mobile</h2>
              <p className="text-sm text-gray-600">Utilisés dans les instructions Wave et Orange Money du site et de l’application mobile</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro Wave</label>
              <input
                type="text"
                value={waveNumber}
                onChange={(e) => setWaveNumber(e.target.value)}
                placeholder="+225 07 09 51 88 75"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro Orange Money</label>
              <input
                type="text"
                value={orangeMoneyNumber}
                onChange={(e) => setOrangeMoneyNumber(e.target.value)}
                placeholder="+225 07 09 51 88 75"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
              />
            </div>
          </div>

          {paymentNumbersError && <p className="text-sm text-red-600 mt-3">{paymentNumbersError}</p>}
          <button
            type="button"
            onClick={savePaymentNumbers}
            disabled={savingPaymentNumbers}
            className="mt-5 flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-medium hover:bg-[#c94510] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {paymentNumbersSaved ? "Enregistré ✓" : savingPaymentNumbers ? "Enregistrement..." : "Enregistrer les numéros"}
          </button>
        </div>

        {/* Image générique formations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-[#E05017]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Image générique des formations</h2>
              <p className="text-sm text-gray-600">Affichée pour toutes les formations sans vignette personnalisée</p>
            </div>
          </div>

          <div className="max-w-sm">
            {(formationPreview || formationImage) && (
              <div className="relative rounded-lg overflow-hidden aspect-video mb-3 bg-gray-100">
                <img src={formationPreview || formationImage || ""} alt="Image générique" className="w-full h-full object-cover" />
                {formationPreview && (
                  <button type="button" onClick={() => { setNewFormationImage(null); setFormationPreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
            {!formationPreview && (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#E05017] hover:bg-orange-50 transition-colors mb-3">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">{formationImage ? "Changer l'image" : "Choisir une image"}</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
            {formationPreview && (
              <button type="button" onClick={saveFormationImage} disabled={savingImage}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-medium hover:bg-[#c94510] disabled:opacity-50">
                <Save className="w-4 h-4" />
                {imageSaved ? "Enregistré ✓" : savingImage ? "Enregistrement..." : "Enregistrer l'image"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
