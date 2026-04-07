export default {
  async fetch(request, env) {
    try {

      const body = await request.json();

      let prompt = "";

      if (body.type === "routine") {
        prompt = `
You are a skincare expert.

Create a morning and night routine using ONLY these products:

${JSON.stringify(body.products)}

Format:
Morning:
- ...
Night:
- ...
`;
      } else {
        prompt = body.message;
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
            { role: "system", content: "You are a helpful skincare assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();

      return new Response(JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No response from AI"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        reply: "ERROR: " + err.message
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};