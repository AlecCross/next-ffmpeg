import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Global Site Tag (gtag.js) - Google Tag Manager */}
        <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-P54XXNBX');
              `,
            }}
          />
        <title>Sticker Converter</title>
        <meta property="og:title" content="Sticker Converter" key="title" />
        <meta property="og:image" content="/icon-512x512.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://next-ffmpeg.vercel.app/" />
        <meta
          property="og:description"
          content="Convert video to webp vp9 512x512 for Telegram video stickers"
        />
        <meta property="og:site_name" content="Sticker Converter" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sticker Converter" />
        <meta
          name="twitter:description"
          content="Convert video to webp vp9 512x512 for Telegram video stickers"
        />
        <meta name="twitter:image" content="/icon-512x512.png" />
        <meta name="twitter:site" content="@yourTwitterHandle" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        {/*Google Tag Manager (noscript)*/}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P54XXNBX"
            height="0"
            width="0"
            style={{display: "none", visibility: "hidden",}}
          ></iframe>
        </noscript>
        {/*End Google Tag Manager (noscript)*/}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
