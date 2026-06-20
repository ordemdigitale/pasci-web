import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/profil/", "/profile/"],
      },
    ],
    sitemap: "https://plateforme-osci.org/sitemap.xml",
  };
}
