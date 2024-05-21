import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
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
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
