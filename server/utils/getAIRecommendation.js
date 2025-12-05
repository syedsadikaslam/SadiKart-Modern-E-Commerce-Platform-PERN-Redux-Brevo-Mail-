export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const prompt = `
    You are an AI filtering engine.
    Here is a list of products in JSON:
    ${JSON.stringify(products, null, 2)}

    User request:
    "${userPrompt}"

    Based on this request, return ONLY the matching items as pure JSON array.
  `;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    const aiText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        ?.join(" ")
        ?.trim() || "";

    const clean = aiText.replace(/```json|```/g, "").trim();

    let parsed = [];
    try {
      parsed = JSON.parse(clean);
    } catch {
      return { success: true, products: [] };
    }

    return { success: true, products: parsed };
  } catch (err) {
    return { success: false, products: [] };
  }
}
