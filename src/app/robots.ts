import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            // allow: ["/","/about","/contact", "/services", "/projects"],
            allow: "*",
            disallow: ["/api/*", "/admin/*"],
        },
        sitemap: "https://razaali-portfolio.onrender.com/sitemap.xml",
    }
};
