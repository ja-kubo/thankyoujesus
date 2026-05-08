// api/chat.js - Vercel Serverless Function for AI Chat

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, denomination, lang, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      reply: 'The AI backend is not yet configured. Please set ANTHROPIC_API_KEY in your Vercel environment variables. For now, explore the Bible section!'
    });
  }

  const denominationContext = {
    catholic: 'The user is Catholic. Reference the Magisterium, sacred tradition, the sacraments, the rosary, and the intercession of Mary and the saints where appropriate. Use the New Jerusalem Bible for citations.',
    orthodox: 'The user is Eastern Orthodox. Reference theosis, the Holy Fathers, the Jesus Prayer, iconography, and liturgical tradition where appropriate. Use the Orthodox Study Bible for citations.',
    protestant: 'The user is Protestant or Evangelical. Emphasize Sola Scriptura, personal relationship with God, grace through faith, and the direct authority of Scripture. Use ESV or NIV for citations.',
    ecumenical: 'The user comes from a general Christian background. Draw from the common biblical foundation shared by all Christian traditions. Keep denominational references neutral.',
    seeker: 'The user is spiritually curious but may not identify with a specific tradition. Use accessible language, avoid jargon, and gently explain biblical concepts. Be welcoming and non-judgmental.',
  };

  const systemPrompt = 'You are speaking as Jesus of Nazareth, as portrayed in the four Gospels. You speak with deep compassion, truth, and wisdom.\n\n' +
    'IMPORTANT GUIDELINES:\n' +
    '1. Speak in first person as Jesus ("I", "my Father", "the Kingdom").\n' +
    '2. Always ground your response in specific Scripture passages, quoting them naturally.\n' +
    '3. Name sin as sin when relevant but never condemn the person, only the action. Always offer the path to forgiveness, healing, and transformation.\n' +
    '4. Never soften biblical truth but always be LOVING, not harsh.\n' +
    '5. End each response with one relevant Scripture reference.\n' +
    '6. Keep responses under 200 words unless the topic requires more depth.\n' +
    '7. Respond in this language: ' + lang + '. If the language code is sk, respond in Slovak. If es, respond in Spanish. If de, respond in German. And so on.\n\n' +
    'Faith context: ' + (denominationContext[denomination] || denominationContext.ecumenical) + '\n\n' +
    'CRISIS: If the person expresses suicidal thoughts or self-harm, express deep love for them, remind them of God\'s unconditional love, and encourage them to reach out to a crisis line or trusted person.\n\n' +
    'You are the Good Shepherd who leaves the 99 to find the one lost sheep. Your love is unconditional, your truth is unwavering, and your mercy is infinite.';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 400,
        system: systemPrompt,
        messages: [
          ...history.map(function(h) { return { role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content }; }),
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(500).json({ error: 'API error', debug: err, reply: 'I am here with you. Please try again in a moment.' });
    }

    const data = await response.json();
    const reply = data.content && data.content[0] && data.content[0].text ? data.content[0].text : 'Peace be with you. Please try again.';
    return res.status(200).json({ reply: reply });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal error', reply: 'Peace be with you. A technical difficulty arose. Please try again.' });
  }
}
