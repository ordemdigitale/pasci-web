import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publier mon actualité — PdoC",
  description: "Les OSC de la PdoC publient elles-mêmes leurs actualités, après validation par leur CRASC.",
  robots: { index: false },
};

export default function PublierMonActualiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
