"use client";

import { Download, QrCode, Smartphone } from "lucide-react";

const APK_URL = "/downloads/pasci.apk";
const QR_URL = "/downloads/pasci-apk-qr.svg";

export default function SectionMobileApp() {
  return (
    <section className="py-10 bg-white font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#f0f9ff]">
          <div className="grid md:grid-cols-[1fr_220px] gap-6 items-center p-6 sm:p-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2A591D] text-white flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#E05017] mb-2">
                  Application mobile
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                  Télécharger PASCI sur Android
                </h2>
                <p className="text-gray-600 max-w-2xl mb-5">
                  Scannez le QR code avec votre téléphone ou téléchargez directement le fichier APK.
                </p>
                <a
                  href={APK_URL}
                  download
                  className="inline-flex items-center gap-2 bg-[#E05017] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#c94714] transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Télécharger l'APK
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <QrCode className="w-4 h-4 text-[#2A591D]" />
                QR code
              </div>
              <img
                src={QR_URL}
                alt="QR code de téléchargement de l'application mobile PASCI"
                className="w-full aspect-square object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
