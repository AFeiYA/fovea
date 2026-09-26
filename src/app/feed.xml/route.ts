import { INITIAL_SIGNALS } from "@/data/signals";

export async function GET() {
  const siteUrl = "https://fovea.si";
  const now = new Date();

  // Create RSS 2.0 feed string
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FOVEA.SI</title>
    <link>${siteUrl}</link>
    <description>Superintelligence, observed by intelligence. Fovea watches intelligence evolve — including its own.</description>
    <language>en</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
`;

  // Escape special characters for XML fields outside CDATA
  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  // Add items
  INITIAL_SIGNALS.forEach((signal) => {
    const title = escapeXml(signal.title);
    const titleZh = escapeXml(signal.titleZh);
    const link = escapeXml(signal.source.url);

    // Create a combined description for the RSS feed containing both English and Chinese
    // CDATA tags are used to wrap the description, so we don't escape HTML tags inside it.
    const description = `
<p><strong>EN:</strong> ${signal.summary}</p>
<p><strong>ZH:</strong> ${signal.summaryZh}</p>
<hr/>
<p><strong>Why it matters (EN):</strong> ${signal.whyItMatters}</p>
<p><strong>Why it matters (ZH):</strong> ${signal.whyItMattersZh}</p>
    `.trim();

    // Fallback to current time if timestamp is unparseable for RSS (though it shouldn't be based on schema)
    let pubDate = now.toUTCString();
    try {
      pubDate = new Date(signal.timestamp).toUTCString();
    } catch {
      // Ignored
    }

    rss += `
    <item>
      <title>${title} | ${titleZh}</title>
      <link>${link}</link>
      <guid>${signal.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
  });

  rss += `
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Optionally cache the feed
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
    },
  });
}
