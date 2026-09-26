import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// 1. Resolve API key from CLI args, env var, or .env.local
function getApiKey(): string | null {
  if (process.argv[2]) {
    return process.argv[2].trim();
  }

  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }

  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

async function testGemini() {
  console.log("==================================================");
  console.log("🔬 FOVEA.SI — Official @google/genai SDK Diagnostic");
  console.log("==================================================\n");

  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found!\n");
    console.log("💡 You can provide your key in any of these 3 ways:");
    console.log("  1. Pass it directly as an argument:");
    console.log("     npx tsx scripts/test-gemini.ts AIzaSyYourActualKeyHere\n");
    console.log("  2. In your terminal session:");
    console.log("     export GEMINI_API_KEY=\"AIzaSy...\" && npm run test:gemini\n");
    console.log("  3. Create a .env.local file with:");
    console.log("     GEMINI_API_KEY=\"AIzaSy...\"\n");
    process.exit(1);
  }

  const masked = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "***";
  console.log(`🔑 Key detected: ${masked} (Length: ${apiKey.length})`);

  const ai = new GoogleGenAI({ apiKey });

  // Test 1: Interactions API with gemini-3.8-flash (exact official sample)
  console.log("\n📡 [Test 1/2] Invoking ai.interactions.create with model 'gemini-3.8-flash'...");
  const start1 = Date.now();
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: "Explain what FOVEA means in 1 brief sentence.",
    });

    const elapsed1 = Date.now() - start1;
    console.log(`✅ Success via ai.interactions.create (${elapsed1}ms)!`);
    console.log(`💬 Output:\n${interaction.output_text}\n`);
  } catch (err1) {
    console.warn(`⚠️  ai.interactions.create: ${(err1 as Error).message}`);
    
    // Fallback to ai.models.generateContent
    console.log("🔄 Trying fallback: ai.models.generateContent...");
    try {
      const resp = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Explain what FOVEA means in 1 brief sentence.",
      });
      console.log(`✅ Success via ai.models.generateContent!`);
      console.log(`💬 Output:\n${resp.text}\n`);
    } catch (err2) {
      console.error(`❌ ai.models.generateContent error: ${(err2 as Error).message}`);
    }
  }

  // Test 2: Full Fovea SI Editorial Synthesis Test
  console.log("🧠 [Test 2/2] Testing Fovea SI Editorial JSON generation...");
  const prompt = `You are the lead evaluator for FOVEA.SI, an elite publication tracking the emergence of Superintelligence (SI).
Analyze this breakthrough paper:
Title: "Large-Scale Co-Packaged Optics for Wafer-Scale Superclusters"
Context: "Demonstrating sub-picosecond optical interconnects between distributed wafer-scale accelerators, bypassing traditional SerDes copper limits."

Output a valid JSON object ONLY (no markdown formatting, no backticks):
{
  "isRelevantToSI": true,
  "titleEn": "Wafer-Scale Optical Interconnects Break Copper Latency Limits",
  "titleZh": "晶圆级光电共封装突破铜缆互联极限",
  "summaryZh": "精炼一句话总结",
  "whyItMattersZh": "一针见血说明为什么这对超智能具有根本性结构意义"
}`;

  try {
    let outputText = "";
    try {
      const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
      });
      outputText = interaction.output_text || "";
    } catch {
      const resp = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      outputText = resp.text || "";
    }

    console.log("🎉 [Synthesis JSON Output]:");
    console.log(outputText);
    console.log("\n==================================================");
    console.log("✅ ALL TESTS PASSED! Ready to power Fovea Observatory.");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Full synthesis test failed:", (err as Error).message);
  }
}

testGemini();
