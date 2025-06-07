I'm trying to implement strict CSP in my Next.js 15 APP router project.
I have implemented a dynamic middleware with nonces for inline scripts and styles and use the headers in layout.

The current implementation seems to work, but I'm getting the following errors:

CSP script loaded
localhost/:1 Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'nonce-lBmSfI8gCpLNajUnRTkGSw==' 'strict-dynamic' https:". Either the 'unsafe-inline' keyword, a hash ('sha256-rbbnijHn7DZ6ps39myQ3cVQF1H+U/PJfHh5ei/Q2kb8='), or a nonce ('nonce-...') is required to enable inline execution.
Understand this error
localhost/:25 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present.
Understand this error
react-dom-client.development.js:25022 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
intercept-console-error.ts:40 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<HotReload assetPrefix="" globalError={[...]}>
<AppDevOverlay state={{nextId:1, ...}} globalError={[...]}>
<AppDevOverlayErrorBoundary globalError={[...]} onError={function bound dispatchSetState}>
<ReplaySsrOnlyErrors>
<DevRootHTTPAccessFallbackBoundary>
<HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={<NotAllowedRootHTTPFallbackError>} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>

<Head>
<link>
<script>
<script>
<RootLayout>
<html lang="en" suppressHydrationWarning={true}>
<head>
<script

-                           nonce="lBmSfI8gCpLNajUnRTkGSw=="

*                           nonce=""
                            dangerouslySetInnerHTML={{__html:"console.lo..."}}
                          >
                          <style

-                           nonce="lBmSfI8gCpLNajUnRTkGSw=="

*                           nonce=""
                          >
                        ...
                    ...
        ...

error @ intercept-console-error.ts:40Understand this error
font-styles.tsx:55 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-sHwQzC2ZsVrt1faUYCjF/eo8aIoBlQbGjVstzanL9CU='), or a nonce ('nonce-...') is required to enable inline execution.

(anonymous) @ font-styles.tsx:55Understand this error
index.mjs:1 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-skqujXORqzxt1aE0NNXxujEanPTX6raoqSscTV/Ww/Y='), or a nonce ('nonce-...') is required to enable inline execution.

W @ index.mjs:1Understand this error
index.mjs:1 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-skqujXORqzxt1aE0NNXxujEanPTX6raoqSscTV/Ww/Y='), or a nonce ('nonce-...') is required to enable inline execution.

W @ index.mjs:1Understand this error
react-dom-client.development.js:12430 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-Ylx4sWaDgn6RRamxe7jevX4yDhNtiSG3CQWrPAdPh6A='), or a nonce ('nonce-...') is required to enable inline execution.

insertOrAppendPlacementNodeIntoContainer @ react-dom-client.development.js:12430Understand this error
react-dom-client.development.js:12430 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-TkUgajJ946/xb1R0Vfeuzb73k2VAKoEIF3sRGeX4aBU='), or a nonce ('nonce-...') is required to enable inline execution.

insertOrAppendPlacementNodeIntoContainer @ react-dom-client.development.js:12430Understand this error
react-dom-client.development.js:12430 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg='), or a nonce ('nonce-...') is required to enable inline execution.

insertOrAppendPlacementNodeIntoContainer @ react-dom-client.development.js:12430Understand this error
react-dom-client.development.js:12430 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-k1m9MgjuV56OVgoQq43A5vLIpdJFJrlq/3ANCGJD4es='), or a nonce ('nonce-...') is required to enable inline execution.

insertOrAppendPlacementNodeIntoContainer @ react-dom-client.development.js:12430Understand this error
react-dom-client.development.js:12430 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-m8dEh7VmKFRCO8jEWPbmkeO1mq4SIx8omtyx50rrS/M='), or a nonce ('nonce-...') is required to enable inline execution.

insertOrAppendPlacementNodeIntoContainer @ react-dom-client.development.js:12430Understand this error
react-dom-client.development.js:12430 Refused to apply inline style because it violates the following Content Security Policy directive: "style-src 'self' 'nonce-lBmSfI8gCpLNajUnRTkGSw=='". Either the 'unsafe-inline' keyword, a hash ('sha256-fNQvmabDUct/Q8bVROR2oAMzjWD2CYHGuJj7V7Sxgfc='), or a nonce ('nonce-...') is required to enable inline execution.

Please help me fix this, according to best practices and CSP rules for Next.js 15 APP router. Be aware of my dependencies and project structure.
