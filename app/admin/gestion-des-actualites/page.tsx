import { redirect } from "next/navigation";

// Une seule liste des actualités dans le back-office : Contenu › Actualités
export default function GestionDesActualitesPage() {
  redirect("/admin/actualites");
}
