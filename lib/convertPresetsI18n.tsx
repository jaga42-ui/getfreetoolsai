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

  "jpg-to-webp": {
    es: {
      title: "Conversor de JPG a WebP — Gratis, sin subir archivos",
      h1: "Convertir JPG a WebP",
      description:
        "Convierte JPG a WebP en línea gratis. WebP genera archivos más pequeños que JPEG con la misma calidad para páginas más rápidas. 100 % en tu navegador, sin registro, sin subir nada.",
      intro: (
        <>
          <p>
            WebP comprime las fotos de forma más eficiente que JPEG, así que
            obtienes la misma imagen con un tamaño de archivo menor: mejor para la
            velocidad de la página y el SEO. Esta página está configurada para
            salida WebP: añade tus JPG y convierte todo el lote de una vez.
          </p>
          <p>
            Un control de calidad te permite sacrificar un poco de detalle por un
            archivo aún más pequeño. Todo se procesa localmente, así que tus fotos
            nunca se suben.
          </p>
        </>
      ),
      uses: [
        "Acelerar webs y blogs con fotos más ligeras",
        "Convertir por lotes una carpeta de JPEG para la web",
        "Reducir almacenamiento y ancho de banda sin pérdida visible de calidad",
      ],
      faqs: [
        { q: "¿WebP es mejor que JPG para la web?", a: "En general, sí. WebP genera archivos más pequeños que JPEG con la misma calidad, y todos los navegadores modernos lo admiten, así que las páginas cargan más rápido sin diferencia visible." },
        { q: "¿Puedo controlar la calidad del WebP?", a: "Sí. El conversor tiene un control de calidad; bájalo para archivos más pequeños o mantenlo alto para que sea visualmente idéntico al original." },
        { q: "¿Suben mis JPG?", a: "No: la conversión ocurre en tu navegador y tus archivos permanecen en tu dispositivo." },
      ],
    },
    "pt-BR": {
      title: "Conversor de JPG para WebP — Grátis, sem upload",
      h1: "Converter JPG para WebP",
      description:
        "Converta JPG para WebP online grátis. O WebP gera arquivos menores que o JPEG com a mesma qualidade, para páginas mais rápidas. 100% no seu navegador — sem cadastro, sem enviar nada.",
      intro: (
        <>
          <p>
            O WebP comprime fotos de forma mais eficiente que o JPEG, então você
            obtém a mesma imagem com um tamanho de arquivo menor — melhor para a
            velocidade da página e o SEO. Esta página está configurada para saída
            WebP: adicione seus JPGs e converta todo o lote de uma vez.
          </p>
          <p>
            Um controle de qualidade permite trocar um pouco de detalhe por um
            arquivo ainda menor. Tudo é processado localmente, então suas fotos
            nunca são enviadas.
          </p>
        </>
      ),
      uses: [
        "Acelerar sites e blogs com fotos mais leves",
        "Converter em lote uma pasta de JPEGs para a web",
        "Reduzir armazenamento e banda sem queda visível de qualidade",
      ],
      faqs: [
        { q: "O WebP é melhor que o JPG para a web?", a: "Geralmente, sim. O WebP gera arquivos menores que o JPEG com a mesma qualidade, e todos os navegadores modernos o suportam, então as páginas carregam mais rápido sem diferença visível." },
        { q: "Posso controlar a qualidade do WebP?", a: "Sim. O conversor tem um controle de qualidade; diminua-o para arquivos menores ou mantenha-o alto para ficar visualmente idêntico ao original." },
        { q: "Vocês enviam meus JPGs?", a: "Não — a conversão acontece no seu navegador e seus arquivos permanecem no seu dispositivo." },
      ],
    },
    hi: {
      title: "JPG से WebP कन्वर्टर — मुफ़्त, बिना अपलोड",
      h1: "JPG को WebP में बदलें",
      description:
        "JPG को WebP में मुफ़्त ऑनलाइन बदलें। WebP समान गुणवत्ता पर JPEG से छोटी फ़ाइलें देता है, जिससे पेज तेज़ी से लोड होते हैं। 100% आपके ब्राउज़र में — कोई साइनअप नहीं, कुछ भी अपलोड नहीं।",
      intro: (
        <>
          <p>
            WebP, JPEG की तुलना में फ़ोटो को अधिक कुशलता से कंप्रेस करता है, इसलिए
            आपको वही तस्वीर छोटे फ़ाइल आकार में मिलती है — पेज स्पीड और SEO के लिए
            बेहतर। यह पेज WebP आउटपुट पर सेट है: अपनी JPG डालें और पूरे बैच को एक साथ
            बदलें।
          </p>
          <p>
            एक क्वालिटी स्लाइडर आपको थोड़ी डिटेल देकर और भी छोटी फ़ाइल पाने देता है।
            सब कुछ स्थानीय रूप से प्रोसेस होता है, इसलिए आपकी फ़ोटो कभी अपलोड नहीं
            होतीं।
          </p>
        </>
      ),
      uses: [
        "हल्की फ़ोटो से वेबसाइट और ब्लॉग तेज़ करना",
        "वेब के लिए JPEG फ़ोल्डर को बैच में बदलना",
        "बिना दिखने वाली गुणवत्ता गिरावट के स्टोरेज और बैंडविड्थ घटाना",
      ],
      faqs: [
        { q: "क्या वेब के लिए WebP, JPG से बेहतर है?", a: "आम तौर पर हाँ। WebP समान गुणवत्ता पर JPEG से छोटी फ़ाइलें देता है, और सभी आधुनिक ब्राउज़र इसे सपोर्ट करते हैं, इसलिए पेज बिना दिखने वाले अंतर के तेज़ी से लोड होते हैं।" },
        { q: "क्या मैं WebP की गुणवत्ता नियंत्रित कर सकता हूँ?", a: "हाँ। कन्वर्टर में क्वालिटी स्लाइडर है; छोटी फ़ाइलों के लिए इसे कम करें या मूल जैसा दिखने के लिए ऊँचा रखें।" },
        { q: "क्या मेरी JPG अपलोड होती हैं?", a: "नहीं — रूपांतरण आपके ब्राउज़र में होता है और आपकी फ़ाइलें आपके डिवाइस पर ही रहती हैं।" },
      ],
    },
    id: {
      title: "Konverter JPG ke WebP — Gratis, Tanpa Unggah",
      h1: "Konversi JPG ke WebP",
      description:
        "Konversi JPG ke WebP online gratis. WebP menghasilkan file lebih kecil daripada JPEG pada kualitas yang sama, untuk halaman yang lebih cepat. 100% di browser Anda — tanpa pendaftaran, tanpa mengunggah apa pun.",
      intro: (
        <>
          <p>
            WebP mengompresi foto lebih efisien daripada JPEG, jadi Anda
            mendapatkan gambar yang sama dengan ukuran file lebih kecil — lebih
            baik untuk kecepatan halaman dan SEO. Halaman ini diatur ke keluaran
            WebP: tambahkan JPG Anda dan konversi seluruh kumpulan sekaligus.
          </p>
          <p>
            Penggeser kualitas memungkinkan Anda menukar sedikit detail untuk file
            yang lebih kecil lagi. Semuanya diproses secara lokal, jadi foto Anda
            tidak pernah diunggah.
          </p>
        </>
      ),
      uses: [
        "Mempercepat situs dan blog dengan foto yang lebih ringan",
        "Mengonversi massal folder JPEG untuk web",
        "Mengurangi penyimpanan dan bandwidth tanpa penurunan kualitas yang terlihat",
      ],
      faqs: [
        { q: "Apakah WebP lebih baik daripada JPG untuk web?", a: "Umumnya ya. WebP menghasilkan file lebih kecil daripada JPEG pada kualitas yang sama, dan semua browser modern mendukungnya, jadi halaman dimuat lebih cepat tanpa perbedaan yang terlihat." },
        { q: "Bisakah saya mengatur kualitas WebP?", a: "Ya. Konverter memiliki penggeser kualitas; turunkan untuk file lebih kecil atau pertahankan tinggi agar terlihat identik dengan aslinya." },
        { q: "Apakah JPG saya diunggah?", a: "Tidak — konversi terjadi di browser Anda dan file Anda tetap di perangkat Anda." },
      ],
    },
  },

  "webp-to-png": {
    es: {
      title: "Conversor de WebP a PNG — Gratis, sin subir archivos",
      h1: "Convertir WebP a PNG",
      description:
        "Convierte WebP a PNG en línea gratis. Transforma descargas WebP en PNG compatibles con todo y con la transparencia intacta. Funciona en tu navegador, sin registro, sin subir nada.",
      intro: (
        <>
          <p>
            ¿Guardaste una imagen WebP y necesitas un PNG que acepte cualquier
            aplicación o editor? Esta página abre el conversor con salida PNG:
            suelta tus archivos WebP y descarga PNG estándar que puedes usar en
            cualquier lugar.
          </p>
          <p>
            Se conserva la transparencia, así que los gráficos WebP con zonas
            transparentes se convierten en PNG transparentes correctos. Toda la
            conversión ocurre en tu navegador.
          </p>
        </>
      ),
      uses: [
        "Usar imágenes WebP en aplicaciones o editores que no las aceptan",
        "Obtener un PNG sin pérdidas y con transparencia a partir de un WebP",
        "Preparar imágenes para herramientas que solo importan PNG/JPG",
      ],
      faqs: [
        { q: "¿Por qué convertir WebP a PNG?", a: "Algunas aplicaciones, editores y formularios antiguos no aceptan WebP. PNG es compatible prácticamente en todas partes y conserva la transparencia, lo que lo hace la opción universal segura." },
        { q: "¿El PNG conservará las zonas transparentes?", a: "Sí. PNG admite canal alfa, así que cualquier transparencia del WebP se conserva en el PNG convertido." },
        { q: "¿Se sube mi WebP a algún sitio?", a: "No. Todo se convierte localmente en tu navegador." },
      ],
    },
    "pt-BR": {
      title: "Conversor de WebP para PNG — Grátis, sem upload",
      h1: "Converter WebP para PNG",
      description:
        "Converta WebP para PNG online grátis. Transforme downloads WebP em PNGs compatíveis com tudo e com a transparência intacta. Roda no seu navegador — sem cadastro, sem enviar nada.",
      intro: (
        <>
          <p>
            Salvou uma imagem WebP e precisa de um PNG que qualquer aplicativo ou
            editor aceite? Esta página abre o conversor com saída PNG: solte seus
            arquivos WebP e baixe PNGs padrão que você pode usar em qualquer lugar.
          </p>
          <p>
            A transparência é preservada, então gráficos WebP com áreas
            transparentes viram PNGs transparentes adequados. Toda a conversão
            acontece no seu navegador.
          </p>
        </>
      ),
      uses: [
        "Usar imagens WebP em aplicativos ou editores que não as aceitam",
        "Obter um PNG sem perdas e com transparência a partir de um WebP",
        "Preparar imagens para ferramentas que só importam PNG/JPG",
      ],
      faqs: [
        { q: "Por que converter WebP para PNG?", a: "Alguns aplicativos, editores e formulários antigos não aceitam WebP. O PNG é suportado praticamente em todo lugar e mantém a transparência, sendo a escolha universal segura." },
        { q: "O PNG vai manter as áreas transparentes?", a: "Sim. O PNG tem canal alfa, então qualquer transparência do WebP é preservada no PNG convertido." },
        { q: "Meu WebP é enviado para algum lugar?", a: "Não. Tudo é convertido localmente no seu navegador." },
      ],
    },
    hi: {
      title: "WebP से PNG कन्वर्टर — मुफ़्त, बिना अपलोड",
      h1: "WebP को PNG में बदलें",
      description:
        "WebP को PNG में मुफ़्त ऑनलाइन बदलें। WebP डाउनलोड को हर जगह समर्थित PNG में बदलें, पारदर्शिता बरकरार रखते हुए। आपके ब्राउज़र में चलता है, कोई साइनअप नहीं, कुछ भी अपलोड नहीं।",
      intro: (
        <>
          <p>
            क्या आपने कोई WebP इमेज सेव की है और ऐसा PNG चाहिए जिसे हर ऐप और एडिटर
            स्वीकार करे? यह पेज कन्वर्टर को PNG आउटपुट पर खोलता है — अपनी WebP
            फ़ाइलें डालें और मानक PNG डाउनलोड करें जिन्हें आप कहीं भी इस्तेमाल कर
            सकते हैं।
          </p>
          <p>
            पारदर्शिता बनी रहती है, इसलिए पारदर्शी हिस्सों वाले WebP ग्राफ़िक सही
            पारदर्शी PNG बन जाते हैं। पूरा रूपांतरण आपके ब्राउज़र में होता है।
          </p>
        </>
      ),
      uses: [
        "उन ऐप या एडिटर में WebP इमेज इस्तेमाल करना जो WebP स्वीकार नहीं करते",
        "WebP से पारदर्शिता वाला लॉसलेस PNG पाना",
        "उन टूल के लिए इमेज तैयार करना जो केवल PNG/JPG इम्पोर्ट करते हैं",
      ],
      faqs: [
        { q: "WebP को PNG में क्यों बदलें?", a: "कुछ पुराने ऐप, एडिटर और फ़ॉर्म WebP स्वीकार नहीं करते। PNG लगभग हर जगह समर्थित है और पारदर्शिता बनाए रखता है, जिससे यह सुरक्षित सार्वभौमिक विकल्प बनता है।" },
        { q: "क्या PNG पारदर्शी हिस्से बनाए रखेगा?", a: "हाँ। PNG अल्फ़ा चैनल को सपोर्ट करता है, इसलिए WebP की कोई भी पारदर्शिता बदले गए PNG में बनी रहती है।" },
        { q: "क्या मेरी WebP कहीं अपलोड होती है?", a: "नहीं। सब कुछ आपके ब्राउज़र में स्थानीय रूप से बदला जाता है।" },
      ],
    },
    id: {
      title: "Konverter WebP ke PNG — Gratis, Tanpa Unggah",
      h1: "Konversi WebP ke PNG",
      description:
        "Konversi WebP ke PNG online gratis. Ubah unduhan WebP menjadi PNG yang didukung di mana saja dengan transparansi tetap utuh. Berjalan di browser Anda — tanpa pendaftaran, tanpa mengunggah apa pun.",
      intro: (
        <>
          <p>
            Menyimpan gambar WebP dan membutuhkan PNG yang diterima setiap
            aplikasi dan editor? Halaman ini membuka konverter dengan keluaran PNG
            — jatuhkan file WebP Anda dan unduh PNG standar yang bisa Anda gunakan
            di mana saja.
          </p>
          <p>
            Transparansi dipertahankan, sehingga grafik WebP dengan area tembus
            pandang menjadi PNG transparan yang benar. Semua konversi terjadi di
            browser Anda.
          </p>
        </>
      ),
      uses: [
        "Menggunakan gambar WebP di aplikasi atau editor yang tidak menerimanya",
        "Mendapatkan PNG lossless dengan transparansi dari WebP",
        "Menyiapkan gambar untuk alat yang hanya mengimpor PNG/JPG",
      ],
      faqs: [
        { q: "Mengapa mengonversi WebP ke PNG?", a: "Beberapa aplikasi, editor, dan formulir lama tidak menerima WebP. PNG didukung hampir di mana saja dan mempertahankan transparansi, menjadikannya pilihan universal yang aman." },
        { q: "Apakah PNG akan mempertahankan area transparan?", a: "Ya. PNG mendukung kanal alfa, jadi transparansi apa pun pada WebP dipertahankan pada PNG hasil konversi." },
        { q: "Apakah WebP saya diunggah ke suatu tempat?", a: "Tidak. Semuanya dikonversi secara lokal di browser Anda." },
      ],
    },
  },

  "webp-to-jpg": {
    es: {
      title: "Conversor de WebP a JPG — Gratis, sin subir archivos",
      h1: "Convertir WebP a JPG",
      description:
        "Convierte WebP a JPG en línea gratis. Transforma imágenes WebP en JPEG muy compatibles para compartir, imprimir y subir. 100 % en tu navegador, sin subir nada.",
      intro: (
        <>
          <p>
            JPG es el formato de foto más aceptado, útil cuando una web,
            aplicación o servicio de impresión rechaza WebP. Esta página está
            configurada para salida JPG: añade tus archivos WebP y descarga JPEG
            listos para compartir.
          </p>
          <p>
            Las zonas transparentes se aplanan sobre un fondo blanco (JPG no tiene
            transparencia), y todo se convierte en tu propio dispositivo, nunca se
            sube.
          </p>
        </>
      ),
      uses: [
        "Subir fotos a sitios que rechazan archivos WebP",
        "Compartir imágenes con aplicaciones o contactos que esperan JPG",
        "Preparar fotos para servicios de impresión",
      ],
      faqs: [
        { q: "¿Por qué convertir WebP a JPG?", a: "JPG es aceptado por casi todas las webs, aplicaciones y servicios de impresión. Convertir desde WebP evita errores de 'tipo de archivo no compatible' al compartir o subir." },
        { q: "¿Qué pasa con la transparencia?", a: "JPG no puede almacenar transparencia, así que las zonas transparentes se rellenan con un fondo blanco durante la conversión." },
        { q: "¿Mis archivos son privados?", a: "Sí. La conversión se ejecuta en tu navegador y tus imágenes nunca se suben." },
      ],
    },
    "pt-BR": {
      title: "Conversor de WebP para JPG — Grátis, sem upload",
      h1: "Converter WebP para JPG",
      description:
        "Converta WebP para JPG online grátis. Transforme imagens WebP em JPEGs muito compatíveis para compartilhar, imprimir e enviar. 100% no seu navegador — sem enviar nada.",
      intro: (
        <>
          <p>
            O JPG é o formato de foto mais aceito — útil quando um site, aplicativo
            ou serviço de impressão rejeita WebP. Esta página está configurada para
            saída JPG: adicione seus arquivos WebP e baixe JPEGs prontos para
            compartilhar.
          </p>
          <p>
            Áreas transparentes são achatadas sobre um fundo branco (o JPG não tem
            transparência), e tudo é convertido no seu próprio dispositivo, nunca
            enviado.
          </p>
        </>
      ),
      uses: [
        "Enviar fotos para sites que rejeitam arquivos WebP",
        "Compartilhar imagens com aplicativos ou contatos que esperam JPG",
        "Preparar fotos para serviços de impressão",
      ],
      faqs: [
        { q: "Por que converter WebP para JPG?", a: "O JPG é aceito por praticamente todo site, aplicativo e serviço de impressão. Converter de WebP evita erros de 'tipo de arquivo não suportado' ao compartilhar ou enviar." },
        { q: "O que acontece com a transparência?", a: "O JPG não armazena transparência, então áreas transparentes são preenchidas com um fundo branco durante a conversão." },
        { q: "Meus arquivos são privados?", a: "Sim. A conversão roda no seu navegador e suas imagens nunca são enviadas." },
      ],
    },
    hi: {
      title: "WebP से JPG कन्वर्टर — मुफ़्त, बिना अपलोड",
      h1: "WebP को JPG में बदलें",
      description:
        "WebP को JPG में मुफ़्त ऑनलाइन बदलें। साझा करने, प्रिंट करने और अपलोड के लिए WebP इमेज को व्यापक रूप से संगत JPEG में बदलें। 100% आपके ब्राउज़र में — कुछ भी अपलोड नहीं।",
      intro: (
        <>
          <p>
            JPG सबसे अधिक स्वीकृत फ़ोटो फ़ॉर्मेट है — तब उपयोगी जब कोई वेबसाइट, ऐप या
            प्रिंट सेवा WebP अस्वीकार कर दे। यह पेज JPG आउटपुट पर सेट है: अपनी WebP
            फ़ाइलें डालें और साझा करने के लिए तैयार JPEG डाउनलोड करें।
          </p>
          <p>
            पारदर्शी हिस्से सफ़ेद पृष्ठभूमि पर समतल कर दिए जाते हैं (JPG में
            पारदर्शिता नहीं होती), और सब कुछ आपके अपने डिवाइस पर बदला जाता है, कभी
            अपलोड नहीं होता।
          </p>
        </>
      ),
      uses: [
        "उन साइटों पर फ़ोटो अपलोड करना जो WebP फ़ाइलें अस्वीकार करती हैं",
        "उन ऐप या संपर्कों के साथ इमेज साझा करना जो JPG की उम्मीद करते हैं",
        "प्रिंट सेवाओं के लिए फ़ोटो तैयार करना",
      ],
      faqs: [
        { q: "WebP को JPG में क्यों बदलें?", a: "JPG लगभग हर वेबसाइट, ऐप और प्रिंट सेवा द्वारा स्वीकार किया जाता है। WebP से बदलने पर साझा या अपलोड करते समय 'असमर्थित फ़ाइल प्रकार' त्रुटियाँ नहीं आतीं।" },
        { q: "पारदर्शिता का क्या होता है?", a: "JPG पारदर्शिता संग्रहीत नहीं कर सकता, इसलिए रूपांतरण के दौरान पारदर्शी हिस्से सफ़ेद पृष्ठभूमि से भर दिए जाते हैं।" },
        { q: "क्या मेरी फ़ाइलें निजी हैं?", a: "हाँ। रूपांतरण आपके ब्राउज़र में चलता है और आपकी इमेज कभी अपलोड नहीं होतीं।" },
      ],
    },
    id: {
      title: "Konverter WebP ke JPG — Gratis, Tanpa Unggah",
      h1: "Konversi WebP ke JPG",
      description:
        "Konversi WebP ke JPG online gratis. Ubah gambar WebP menjadi JPEG yang sangat kompatibel untuk berbagi, mencetak, dan mengunggah. 100% di browser Anda — tanpa mengunggah apa pun.",
      intro: (
        <>
          <p>
            JPG adalah format foto yang paling banyak diterima — berguna saat
            situs, aplikasi, atau layanan cetak menolak WebP. Halaman ini diatur ke
            keluaran JPG: tambahkan file WebP Anda dan unduh JPEG yang siap
            dibagikan.
          </p>
          <p>
            Area transparan diratakan ke latar belakang putih (JPG tidak memiliki
            transparansi), dan semuanya dikonversi di perangkat Anda sendiri, tidak
            pernah diunggah.
          </p>
        </>
      ),
      uses: [
        "Mengunggah foto ke situs yang menolak file WebP",
        "Berbagi gambar dengan aplikasi atau kontak yang mengharapkan JPG",
        "Menyiapkan foto untuk layanan pencetakan",
      ],
      faqs: [
        { q: "Mengapa mengonversi WebP ke JPG?", a: "JPG diterima oleh hampir setiap situs, aplikasi, dan layanan cetak. Mengonversi dari WebP menghindari kesalahan 'jenis file tidak didukung' saat berbagi atau mengunggah." },
        { q: "Apa yang terjadi pada transparansi?", a: "JPG tidak dapat menyimpan transparansi, jadi area transparan diisi dengan latar belakang putih selama konversi." },
        { q: "Apakah file saya pribadi?", a: "Ya. Konversi berjalan di browser Anda dan gambar Anda tidak pernah diunggah." },
      ],
    },
  },

  "png-to-jpg": {
    es: {
      title: "Conversor de PNG a JPG — Gratis, sin subir archivos",
      h1: "Convertir PNG a JPG",
      description:
        "Convierte PNG a JPG en línea gratis. Transforma PNG grandes en JPEG más pequeños y compatibles con todo para correo, subidas y uso compartido. Funciona en tu navegador, sin subir nada.",
      intro: (
        <>
          <p>
            Las fotografías guardadas como PNG suelen ser mucho más grandes de lo
            necesario; convertirlas a JPG puede reducirlas drásticamente sin
            diferencia visible. Esta página abre el conversor con salida JPG, listo
            para tus PNG.
          </p>
          <p>
            Como JPG no tiene transparencia, las zonas transparentes se colocan
            sobre un fondo blanco. La conversión es totalmente en el navegador, así
            que los archivos siguen siendo privados.
          </p>
        </>
      ),
      uses: [
        "Reducir fotos PNG demasiado grandes para correo y subidas",
        "Cumplir formularios que solo aceptan JPG/JPEG",
        "Compartir capturas e imágenes en un tamaño menor",
      ],
      faqs: [
        { q: "¿Convertir PNG a JPG reduce el tamaño del archivo?", a: "Normalmente mucho, en fotos. La compresión JPEG es mucho más eficiente que PNG para imágenes fotográficas, y a menudo reduce el tamaño un 70 % o más sin pérdida visible." },
        { q: "¿Por qué mi fondo transparente se volvió blanco?", a: "JPG no admite transparencia, así que los píxeles transparentes se rellenan con blanco. Si necesitas conservar la transparencia, convierte a PNG o WebP." },
        { q: "¿Se sube mi PNG?", a: "No. Toda la conversión ocurre localmente en tu navegador." },
      ],
    },
    "pt-BR": {
      title: "Conversor de PNG para JPG — Grátis, sem upload",
      h1: "Converter PNG para JPG",
      description:
        "Converta PNG para JPG online grátis. Transforme PNGs grandes em JPEGs menores e compatíveis com tudo para e-mail, uploads e compartilhamento. Roda no seu navegador — sem enviar nada.",
      intro: (
        <>
          <p>
            Fotografias salvas como PNG costumam ser muito maiores do que precisam
            — convertê-las para JPG pode reduzi-las drasticamente sem diferença
            visível. Esta página abre o conversor com saída JPG, pronto para seus
            PNGs.
          </p>
          <p>
            Como o JPG não tem transparência, áreas transparentes são colocadas
            sobre um fundo branco. A conversão é totalmente no navegador, então os
            arquivos permanecem privados.
          </p>
        </>
      ),
      uses: [
        "Reduzir fotos PNG grandes demais para e-mail e uploads",
        "Atender formulários que só aceitam JPG/JPEG",
        "Compartilhar capturas e imagens em um tamanho menor",
      ],
      faqs: [
        { q: "Converter PNG para JPG reduz o tamanho do arquivo?", a: "Geralmente muito, para fotos. A compressão JPEG é bem mais eficiente que o PNG para imagens fotográficas, muitas vezes reduzindo o tamanho em 70% ou mais sem perda visível." },
        { q: "Por que meu fundo transparente ficou branco?", a: "O JPG não suporta transparência, então pixels transparentes são preenchidos com branco. Se você precisa manter a transparência, converta para PNG ou WebP." },
        { q: "Meu PNG é enviado?", a: "Não. Toda a conversão acontece localmente no seu navegador." },
      ],
    },
    hi: {
      title: "PNG से JPG कन्वर्टर — मुफ़्त, बिना अपलोड",
      h1: "PNG को JPG में बदलें",
      description:
        "PNG को JPG में मुफ़्त ऑनलाइन बदलें। ईमेल, अपलोड और साझा करने के लिए बड़ी PNG को छोटी, हर जगह संगत JPEG में बदलें। आपके ब्राउज़र में चलता है, कुछ भी अपलोड नहीं।",
      intro: (
        <>
          <p>
            PNG के रूप में सहेजी गई तस्वीरें अक्सर ज़रूरत से कहीं बड़ी होती हैं —
            उन्हें JPG में बदलने से वे बिना दिखने वाले अंतर के बहुत छोटी हो सकती हैं।
            यह पेज JPG आउटपुट पर कन्वर्टर खोलता है, आपकी PNG के लिए तैयार।
          </p>
          <p>
            चूँकि JPG में पारदर्शिता नहीं होती, पारदर्शी हिस्से सफ़ेद पृष्ठभूमि पर
            रखे जाते हैं। रूपांतरण पूरी तरह ब्राउज़र में होता है, इसलिए फ़ाइलें निजी
            रहती हैं।
          </p>
        </>
      ),
      uses: [
        "ईमेल और अपलोड के लिए बहुत बड़ी PNG फ़ोटो छोटी करना",
        "ऐसे फ़ॉर्म पूरे करना जो केवल JPG/JPEG स्वीकार करते हैं",
        "स्क्रीनशॉट और तस्वीरें छोटे आकार में साझा करना",
      ],
      faqs: [
        { q: "क्या PNG को JPG में बदलने से फ़ाइल आकार घटता है?", a: "फ़ोटो के लिए आमतौर पर बहुत। JPEG कंप्रेशन फ़ोटोग्राफ़िक इमेज के लिए PNG से कहीं अधिक कुशल है, अक्सर बिना दिखने वाली हानि के आकार 70% या उससे अधिक घटा देता है।" },
        { q: "मेरी पारदर्शी पृष्ठभूमि सफ़ेद क्यों हो गई?", a: "JPG पारदर्शिता का समर्थन नहीं करता, इसलिए पारदर्शी पिक्सेल सफ़ेद से भर दिए जाते हैं। यदि आपको पारदर्शिता बनाए रखनी है, तो PNG या WebP में बदलें।" },
        { q: "क्या मेरी PNG अपलोड होती है?", a: "नहीं। पूरा रूपांतरण आपके ब्राउज़र में स्थानीय रूप से होता है।" },
      ],
    },
    id: {
      title: "Konverter PNG ke JPG — Gratis, Tanpa Unggah",
      h1: "Konversi PNG ke JPG",
      description:
        "Konversi PNG ke JPG online gratis. Ubah PNG besar menjadi JPEG yang lebih kecil dan kompatibel dengan semua untuk email, unggahan, dan berbagi. Berjalan di browser Anda — tanpa mengunggah apa pun.",
      intro: (
        <>
          <p>
            Foto yang disimpan sebagai PNG sering kali jauh lebih besar daripada
            yang diperlukan — mengonversinya ke JPG dapat memperkecilnya secara
            drastis tanpa perbedaan yang terlihat. Halaman ini membuka konverter
            dengan keluaran JPG, siap untuk PNG Anda.
          </p>
          <p>
            Karena JPG tidak memiliki transparansi, area transparan ditempatkan di
            latar belakang putih. Konversi sepenuhnya di browser, jadi file tetap
            pribadi.
          </p>
        </>
      ),
      uses: [
        "Memperkecil foto PNG yang terlalu besar untuk email dan unggahan",
        "Memenuhi formulir yang hanya menerima JPG/JPEG",
        "Berbagi tangkapan layar dan gambar dalam ukuran lebih kecil",
      ],
      faqs: [
        { q: "Apakah mengonversi PNG ke JPG mengurangi ukuran file?", a: "Biasanya banyak, untuk foto. Kompresi JPEG jauh lebih efisien daripada PNG untuk gambar fotografis, sering kali memangkas ukuran 70% atau lebih tanpa kehilangan yang terlihat." },
        { q: "Mengapa latar belakang transparan saya menjadi putih?", a: "JPG tidak mendukung transparansi, jadi piksel transparan diisi dengan putih. Jika Anda perlu mempertahankan transparansi, konversi ke PNG atau WebP." },
        { q: "Apakah PNG saya diunggah?", a: "Tidak. Seluruh konversi terjadi secara lokal di browser Anda." },
      ],
    },
  },

  "jpg-to-png": {
    es: {
      title: "Conversor de JPG a PNG — Gratis, sin subir archivos",
      h1: "Convertir JPG a PNG",
      description:
        "Convierte JPG a PNG en línea gratis. Obtén un PNG sin pérdidas de cualquier JPEG para editar, logotipos o herramientas que requieren PNG. 100 % en tu navegador, sin registro, sin subir nada.",
      intro: (
        <>
          <p>
            PNG es un formato sin pérdidas que muchas herramientas de diseño,
            presentaciones y formularios requieren específicamente. Esta página
            está configurada para salida PNG: suelta tus JPG y descarga PNG listos
            para editar o subir.
          </p>
          <p>
            Ten en cuenta que convertir un JPG a PNG no recuperará el detalle que
            JPEG ya descartó, y el PNG puede ser más grande. Todo se ejecuta en tu
            navegador, así que tus imágenes nunca se suben.
          </p>
        </>
      ),
      uses: [
        "Cumplir herramientas o formularios que solo aceptan PNG",
        "Obtener una copia sin pérdidas para editar sin más artefactos JPEG",
        "Colocar una foto en software de diseño que prefiere PNG",
      ],
      faqs: [
        { q: "¿Convertir JPG a PNG mejora la calidad?", a: "No: no puede restaurar el detalle que JPEG ya comprimió. Te da un contenedor PNG sin pérdidas, útil para editar o para herramientas que requieren PNG, pero el archivo normalmente será más grande." },
        { q: "¿Cuándo debería convertir JPG a PNG?", a: "Cuando una herramienta o formulario requiere PNG, o cuando quieres editar sin añadir más artefactos de compresión JPEG en cada guardado." },
        { q: "¿Se suben mis JPG?", a: "No. La conversión se realiza por completo en tu navegador." },
      ],
    },
    "pt-BR": {
      title: "Conversor de JPG para PNG — Grátis, sem upload",
      h1: "Converter JPG para PNG",
      description:
        "Converta JPG para PNG online grátis. Obtenha um PNG sem perdas de qualquer JPEG para edição, logotipos ou ferramentas que exigem PNG. 100% no seu navegador — sem cadastro, sem enviar nada.",
      intro: (
        <>
          <p>
            O PNG é um formato sem perdas que muitas ferramentas de design,
            apresentações e formulários exigem especificamente. Esta página está
            configurada para saída PNG: solte seus JPGs e baixe PNGs prontos para
            editar ou enviar.
          </p>
          <p>
            Observe que converter um JPG para PNG não recupera o detalhe que o JPEG
            já descartou, e o PNG pode ser maior. Tudo roda no seu navegador, então
            suas imagens nunca são enviadas.
          </p>
        </>
      ),
      uses: [
        "Atender ferramentas ou formulários que só aceitam PNG",
        "Obter uma cópia sem perdas para editar sem mais artefatos JPEG",
        "Colocar uma foto em software de design que prefere PNG",
      ],
      faqs: [
        { q: "Converter JPG para PNG melhora a qualidade?", a: "Não — não pode restaurar o detalhe que o JPEG já comprimiu. Ele te dá um contêiner PNG sem perdas, útil para edição ou para ferramentas que exigem PNG, mas o arquivo geralmente será maior." },
        { q: "Quando devo converter JPG para PNG?", a: "Quando uma ferramenta ou formulário exige PNG, ou quando você quer editar sem adicionar mais artefatos de compressão JPEG a cada salvamento." },
        { q: "Meus JPGs são enviados?", a: "Não. A conversão é feita totalmente no seu navegador." },
      ],
    },
    hi: {
      title: "JPG से PNG कन्वर्टर — मुफ़्त, बिना अपलोड",
      h1: "JPG को PNG में बदलें",
      description:
        "JPG को PNG में मुफ़्त ऑनलाइन बदलें। संपादन, लोगो या PNG माँगने वाले टूल के लिए किसी भी JPEG से लॉसलेस PNG पाएँ। 100% आपके ब्राउज़र में — कोई साइनअप नहीं, कुछ भी अपलोड नहीं।",
      intro: (
        <>
          <p>
            PNG एक लॉसलेस फ़ॉर्मेट है जिसे कई डिज़ाइन टूल, स्लाइड और अपलोड फ़ॉर्म
            विशेष रूप से माँगते हैं। यह पेज PNG आउटपुट पर सेट है: अपनी JPG डालें और
            संपादन या अपलोड के लिए तैयार PNG डाउनलोड करें।
          </p>
          <p>
            ध्यान दें कि JPG को PNG में बदलने से वह डिटेल वापस नहीं आएगी जिसे JPEG
            पहले ही हटा चुका है, और PNG बड़ा हो सकता है। सब कुछ आपके ब्राउज़र में
            चलता है, इसलिए आपकी इमेज कभी अपलोड नहीं होतीं।
          </p>
        </>
      ),
      uses: [
        "केवल PNG स्वीकार करने वाले टूल या फ़ॉर्म पूरे करना",
        "अधिक JPEG आर्टिफ़ैक्ट जोड़े बिना संपादन के लिए लॉसलेस कॉपी पाना",
        "PNG पसंद करने वाले डिज़ाइन सॉफ़्टवेयर में फ़ोटो रखना",
      ],
      faqs: [
        { q: "क्या JPG को PNG में बदलने से गुणवत्ता सुधरती है?", a: "नहीं — यह उस डिटेल को वापस नहीं ला सकता जिसे JPEG पहले ही कंप्रेस कर चुका है। यह आपको एक लॉसलेस PNG कंटेनर देता है, जो संपादन या PNG माँगने वाले टूल के लिए उपयोगी है, पर फ़ाइल आमतौर पर बड़ी होगी।" },
        { q: "मुझे JPG को PNG में कब बदलना चाहिए?", a: "जब कोई टूल या फ़ॉर्म PNG माँगे, या जब आप हर बार सहेजने पर अधिक JPEG कंप्रेशन आर्टिफ़ैक्ट जोड़े बिना संपादन करना चाहें।" },
        { q: "क्या मेरी JPG अपलोड होती हैं?", a: "नहीं। रूपांतरण पूरी तरह आपके ब्राउज़र में होता है।" },
      ],
    },
    id: {
      title: "Konverter JPG ke PNG — Gratis, Tanpa Unggah",
      h1: "Konversi JPG ke PNG",
      description:
        "Konversi JPG ke PNG online gratis. Dapatkan PNG lossless dari JPEG apa pun untuk pengeditan, logo, atau alat yang memerlukan PNG. 100% di browser Anda — tanpa pendaftaran, tanpa mengunggah apa pun.",
      intro: (
        <>
          <p>
            PNG adalah format lossless yang secara khusus diperlukan oleh banyak
            alat desain, salindia, dan formulir unggahan. Halaman ini diatur ke
            keluaran PNG: jatuhkan JPG Anda dan unduh PNG yang siap diedit atau
            diunggah.
          </p>
          <p>
            Perhatikan bahwa mengonversi JPG ke PNG tidak akan memulihkan detail
            yang sudah dibuang JPEG, dan PNG bisa lebih besar. Semuanya berjalan di
            browser Anda, jadi gambar Anda tidak pernah diunggah.
          </p>
        </>
      ),
      uses: [
        "Memenuhi alat atau formulir yang hanya menerima PNG",
        "Mendapatkan salinan lossless untuk diedit tanpa artefak JPEG tambahan",
        "Menempatkan foto ke perangkat lunak desain yang lebih menyukai PNG",
      ],
      faqs: [
        { q: "Apakah mengonversi JPG ke PNG meningkatkan kualitas?", a: "Tidak — ini tidak dapat memulihkan detail yang sudah dikompresi JPEG. Ini memberi Anda wadah PNG lossless, yang berguna untuk pengeditan atau alat yang memerlukan PNG, tetapi filenya biasanya akan lebih besar." },
        { q: "Kapan saya harus mengonversi JPG ke PNG?", a: "Saat alat atau formulir memerlukan PNG, atau saat Anda ingin mengedit tanpa menambahkan artefak kompresi JPEG setiap kali menyimpan." },
        { q: "Apakah JPG saya diunggah?", a: "Tidak. Konversi dilakukan sepenuhnya di browser Anda." },
      ],
    },
  },
};

/** Locales (non-default) that have a translation for the given pair. */
export const localizedLocalesFor = (pair: string) =>
  Object.keys(convertI18n[pair] ?? {});

export const getLocalizedConvert = (pair: string, locale: string) =>
  convertI18n[pair]?.[locale];
