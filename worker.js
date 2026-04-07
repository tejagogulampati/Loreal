export default {
  async fetch(request, env) {

    // CORS FIX (VERY IMPORTANT)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    try {
      const body = await request.json();

      const type = body.type;
      const products = body.products || [];
      const message = body.message || "Generate routine";
      const history = body.history || [];

      let systemPrompt = "";

      if (type === "routine") {
        systemPrompt = `
You are a L'Oréal skincare expert.

Create a morning and night routine using ONLY these products:

${JSON.stringify(products)}

Rules:
- Use only given products
- Be clear and structured
- Morning / Night format
`;
      } else {
        systemPrompt = `
You are a skincare AI assistant.

Only talk about:
skincare, haircare, makeup, fragrance.

Conversation history:
${JSON.stringify(history)}
`;
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();

      return new Response(JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No AI response"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        reply: "Server error: " + err.message
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};