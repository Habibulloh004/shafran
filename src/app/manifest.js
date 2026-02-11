export default function manifest() {
  return {
    name: "Shafran",
    short_name: "Shafran",
    description:
      "Shafran – parfyumeriya, nafis gullar va zamonaviy sovg'alar do'koni.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
