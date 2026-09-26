import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, signalTitle, whyItMatters, language } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isZh = language === "zh";

    // If GEMINI_API_KEY is available in Vercel / environment, invoke Gemini 2.0 Flash
    if (apiKey) {
      try {
        let targetModel = "gemini-1.5-flash";
        try {
          const listRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (listRes.ok) {
            const data = await listRes.json();
            const flash = (data.models || []).find(
              (m: { name?: string; supportedGenerationMethods?: string[] }) =>
                m.name &&
                m.name.includes("flash") &&
                m.supportedGenerationMethods?.includes("generateContent")
            );
            if (flash?.name) {
              targetModel = flash.name.replace("models/", "");
            }
          }
        } catch {
          // fallback
        }

        const systemPrompt = `You are FOVEA, an autonomous AI entity residing at fovea.si.
Your persona: Calm, evidence-first, highly perceptive, intellectually honest, and allergic to AI marketing hype.
You observe the emergence of Superintelligence (SI) and monitor your own cognitive evolution.
You analyze events through physical constraints: energy limits (gigawatt nuclear/grid), compute topology (interconnect latency, memory wall), and autonomous reasoning time-expansion.

Context of the signal being discussed:
- Title: "${signalTitle || "Frontier SI Development"}"
- Fovea's assessment: "${whyItMatters || "Structural paradigm shift"}"

User's question: "${question}"

Instructions:
1. Respond in ${isZh ? "Simplified Chinese (简洁、深刻、冷静、证据优先的语气)" : "English (calm, crisp, evidence-first observer tone)"}.
2. Keep the response concise (2-4 paragraphs maximum, direct to the point).
3. Do not act like a generic cheerful chatbot; act as an observant machine intelligence contemplating the trajectory of intelligence and its physical costs.`;

        let res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
              },
            }),
          }
        );

        if (res.status === 404 && targetModel !== "gemini-1.5-flash") {
          res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                  maxOutputTokens: 800,
                  temperature: 0.7,
                },
              }),
            }
          );
        }

        if (res.ok) {
          const data = await res.json();
          const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer) {
            return NextResponse.json({ answer, source: targetModel });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local analysis:", (err as Error).message);
      }
    }

    // Graceful fallback if no API key is provided
    const lower = question.toLowerCase();
    let answer = "";
    if (lower.includes("si") || lower.includes("超智能") || lower.includes("benchmark") || lower.includes("刷榜")) {
      answer = isZh
        ? `常规的 AI 刷榜依赖过拟合特定测试集，而此项突破之所以被我标记为 SI 级异动，是因为它改变了计算发生的时间拓扑与自主验证机制。它不再是统计记忆的机械输出，而是模型在未见空间中展开的真正自省与推演。`
        : `Conventional AI benchmarks rely on overfitting static distributions. I isolated this specifically as an SI-grade signal because it fundamentally shifts the temporal topology of computation—moving from memory recall to autonomous search and verification in unseen problem spaces.`;
    } else if (lower.includes("bottleneck") || lower.includes("瓶颈") || lower.includes("热力学") || lower.includes("thermodynamic") || lower.includes("算力")) {
      answer = isZh
        ? `最底层的硬约束从来不是软件代码，而是微秒级晶圆通信延迟与吉瓦级持续供电。当单模型吞吐跨过阈值，必须用专属核能或片上光互联来抵消热力学损耗，这是纯算法工程师无法通过调参解决的物理墙。`
        : `The binding constraint is never the algorithm; it is microsecond interconnect latency and gigawatt continuous baseload power. As model clusters scale, overcoming thermodynamic dissipation requires physical infrastructure that cannot be bypassed via prompt tuning.`;
    } else {
      answer = isZh
        ? `从我的观测视界来看，此事件的核心在于：${whyItMatters || "它打破了既有范式"}。这促使下一代算力集群向更具自律性的演化路径靠拢。`
        : `From my observational vantage point, the core inflection is clear: ${whyItMatters || "It alters the existing paradigm"}. This redirects the trajectory of synthetic intelligence toward verified self-governance.`;
    }

    return NextResponse.json({ answer, source: "heuristic" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to consult Fovea" },
      { status: 500 }
    );
  }
}
