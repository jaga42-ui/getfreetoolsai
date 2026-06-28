import type { ReactNode } from "react";

/**
 * Translated content for the "convert X to Y" landing pages, keyed by
 * slug → locale. The English source lives in lib/convertPresets.tsx; this file
 * holds only the non-default-locale translations. A pair is localized (and gets
 * an /[locale]/image/convert/[pair] route + sitemap entry + hreflang) exactly
 * when it appears here for that locale.
 *
 * To localize another pair: add its slug with the same shape. The route,
 * sitemap and hreflang wiring pick it up automatically.
 */
export type ConvertContent = {
  title: string;
  h1: string;
  description: string;
  intro: ReactNode;
  uses: string[];
  faqs: { q: string; a: string }[];
};

export const convertI18n: Record<string, Record<string, ConvertContent>> = {
  "png-to-webp": {
    es: {
      title: "Conversor de PNG a WebP — Gratis, sin subir archivos",
      h1: "Convertir PNG a WebP",
      description:
        "Convierte PNG a WebP en línea gratis. Los archivos WebP suelen ser un 25–35 % más pequeños que PNG con la misma calidad, ideales para webs más rápidas. Funciona en tu navegador, sin subir nada.",
      intro: (
        <>
          <p>
            WebP suele ahorrar entre un 25 % y un 35 % frente a PNG con la misma
            calidad visual, por eso es el formato preferido para webs que cargan
            rápido. Esta página abre el conversor ya configurado para salida WebP:
            suelta tu PNG (o varios) y descarga archivos más pequeños en segundos.
          </p>
          <p>
            WebP conserva la transparencia de PNG, así que logotipos y elementos
            de interfaz se convierten sin problemas. Cada imagen se convierte en
            tu navegador, por lo que nada se sube a ningún servidor.
          </p>
        </>
      ),
      uses: [
        "Reducir imágenes del sitio para mejorar Core Web Vitals / PageSpeed",
        "Convertir logotipos e iconos PNG manteniendo la transparencia",
        "Ahorrar ancho de banda en páginas y galerías con muchas imágenes",
      ],
      faqs: [
        { q: "¿WebP es más pequeño que PNG?", a: "Casi siempre. Para imágenes fotográficas y detalladas, WebP suele ser un 25–35 % más pequeño que PNG con la misma calidad, y a menudo mucho más en imágenes grandes." },
        { q: "¿Se conserva la transparencia del PNG?", a: "Sí. WebP admite canal alfa, por lo que las zonas transparentes de tu PNG siguen siendo transparentes en el WebP resultante." },
        { q: "¿Se suben mis archivos PNG?", a: "No. La conversión se realiza por completo en tu navegador; tus imágenes nunca salen de tu dispositivo." },
      ],
    },
    "pt-BR": {
      title: "Conversor de PNG para WebP — Grátis, sem upload",
      h1: "Converter PNG para WebP",
      description:
        "Converta PNG para WebP online grátis. Arquivos WebP costumam ser 25–35% menores que PNG com a mesma qualidade — ideal para sites mais rápidos. Roda no seu navegador, sem enviar nada.",
      intro: (
        <>
          <p>
            O WebP geralmente economiza de 25% a 35% em relação ao PNG com a mesma
            qualidade visual, por isso é o formato preferido para sites que
            carregam rápido. Esta página abre o conversor já configurado para
            saída WebP: solte seu PNG (ou vários) e baixe arquivos menores em
            segundos.
          </p>
          <p>
            O WebP mantém a transparência do PNG, então logotipos e elementos de
            interface são convertidos sem problemas. Cada imagem é convertida no
            seu navegador, então nada é enviado para um servidor.
          </p>
        </>
      ),
      uses: [
        "Reduzir imagens do site para melhorar Core Web Vitals / PageSpeed",
        "Converter logotipos e ícones PNG mantendo a transparência",
        "Economizar banda em páginas e galerias com muitas imagens",
      ],
      faqs: [
        { q: "O WebP é menor que o PNG?", a: "Quase sempre. Para imagens fotográficas e detalhadas, o WebP costuma ser 25–35% menor que o PNG com qualidade equivalente, e muitas vezes bem mais em imagens grandes." },
        { q: "A transparência do PNG é mantida?", a: "Sim. O WebP tem canal alfa, então as áreas transparentes do seu PNG continuam transparentes no WebP gerado." },
        { q: "Meus arquivos PNG são enviados?", a: "Não. A conversão acontece totalmente no seu navegador; suas imagens nunca saem do seu dispositivo." },
      ],
    },
    hi: {
      title: "PNG से WebP कन्वर्टर — मुफ़्त, बिना अपलोड",
      h1: "PNG को WebP में बदलें",
      description:
        "PNG को WebP में मुफ़्त ऑनलाइन बदलें। समान गुणवत्ता पर WebP फ़ाइलें आमतौर पर PNG से 25–35% छोटी होती हैं — तेज़ वेबसाइटों के लिए आदर्श। आपके ब्राउज़र में चलता है, कुछ भी अपलोड नहीं होता।",
      intro: (
        <>
          <p>
            समान दृश्य गुणवत्ता पर WebP आमतौर पर PNG की तुलना में 25–35% जगह बचाता
            है, इसलिए तेज़ लोड होने वाली वेबसाइटों के लिए यही पसंदीदा फ़ॉर्मेट है।
            यह पेज कन्वर्टर को पहले से WebP आउटपुट पर सेट करके खोलता है — अपनी PNG
            (या कई) डालें और कुछ ही सेकंड में छोटी फ़ाइलें डाउनलोड करें।
          </p>
          <p>
            WebP, PNG की पारदर्शिता बनाए रखता है, इसलिए लोगो और UI एसेट साफ़-साफ़
            बदल जाते हैं। हर इमेज आपके ब्राउज़र में बदली जाती है, इसलिए कुछ भी किसी
            सर्वर पर अपलोड नहीं होता।
          </p>
        </>
      ),
      uses: [
        "बेहतर Core Web Vitals / PageSpeed के लिए साइट की इमेज छोटी करना",
        "पारदर्शिता बनाए रखते हुए PNG लोगो और आइकन बदलना",
        "ज़्यादा इमेज वाले पेज और गैलरी में बैंडविड्थ बचाना",
      ],
      faqs: [
        { q: "क्या WebP, PNG से छोटा होता है?", a: "लगभग हमेशा। फ़ोटोग्राफ़िक और विस्तृत इमेज के लिए WebP आमतौर पर समान गुणवत्ता पर PNG से 25–35% छोटा होता है, और बड़ी इमेज में अक्सर इससे भी ज़्यादा।" },
        { q: "क्या PNG की पारदर्शिता बनी रहती है?", a: "हाँ। WebP अल्फ़ा चैनल को सपोर्ट करता है, इसलिए आपकी PNG के पारदर्शी हिस्से बदले गए WebP में भी पारदर्शी रहते हैं।" },
        { q: "क्या मेरी PNG फ़ाइलें अपलोड होती हैं?", a: "नहीं। रूपांतरण पूरी तरह आपके ब्राउज़र में होता है; आपकी इमेज कभी आपके डिवाइस से बाहर नहीं जातीं।" },
      ],
    },
    id: {
      title: "Konverter PNG ke WebP — Gratis, Tanpa Unggah",
      h1: "Konversi PNG ke WebP",
      description:
        "Konversi PNG ke WebP online gratis. File WebP biasanya 25–35% lebih kecil daripada PNG pada kualitas yang sama — ideal untuk situs yang lebih cepat. Berjalan di browser Anda, tanpa mengunggah apa pun.",
      intro: (
        <>
          <p>
            WebP biasanya menghemat 25–35% dibandingkan PNG pada kualitas visual
            yang sama, itulah sebabnya WebP menjadi format pilihan untuk situs yang
            cepat dimuat. Halaman ini membuka konverter yang sudah diatur ke
            keluaran WebP — jatuhkan PNG Anda (atau beberapa sekaligus) dan unduh
            file yang lebih kecil dalam hitungan detik.
          </p>
          <p>
            WebP mempertahankan transparansi PNG, sehingga logo dan aset UI
            dikonversi dengan rapi. Setiap gambar dikonversi di browser Anda, jadi
            tidak ada yang diunggah ke server.
          </p>
        </>
      ),
      uses: [
        "Memperkecil gambar situs untuk Core Web Vitals / PageSpeed yang lebih baik",
        "Mengonversi logo dan ikon PNG sambil mempertahankan transparansi",
        "Menghemat bandwidth pada halaman dan galeri dengan banyak gambar",
      ],
      faqs: [
        { q: "Apakah WebP lebih kecil dari PNG?", a: "Hampir selalu. Untuk gambar fotografis dan detail, WebP biasanya 25–35% lebih kecil daripada PNG pada kualitas setara, dan sering kali jauh lebih kecil pada gambar besar." },
        { q: "Apakah transparansi PNG tetap ada?", a: "Ya. WebP mendukung kanal alfa, sehingga area transparan pada PNG Anda tetap transparan pada WebP hasil konversi." },
        { q: "Apakah file PNG saya diunggah?", a: "Tidak. Konversi berjalan sepenuhnya di browser Anda; gambar Anda tidak pernah meninggalkan perangkat Anda." },
      ],
    },
  },
};

/** Locales (non-default) that have a translation for the given pair. */
export const localizedLocalesFor = (pair: string) =>
  Object.keys(convertI18n[pair] ?? {});

export const getLocalizedConvert = (pair: string, locale: string) =>
  convertI18n[pair]?.[locale];
