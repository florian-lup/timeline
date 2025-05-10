import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Disable default preloading behavior */}
        <meta name="next-size-adjust" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 