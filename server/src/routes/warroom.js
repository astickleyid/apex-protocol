import express from 'express';
import { callGemini, parseJSON } from '../services/gemini.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { idea } = req.body;
    
    if (!idea || !idea.name) {
      return res.status(400).json({ error: 'Idea context required' });
    }

    const prompt = `You are a red team advisor conducting adversarial analysis on a startup.

STARTUP PROFILE:
Name: ${idea.name}
Solution: ${idea.solution}
Moat: ${idea.moat}
Revenue: ${idea.revenue}

Generate 3 critical threat scenarios that could kill this startup:
1. COMPETITOR THREAT: A specific competitive move that could undermine the business
2. BLACK SWAN: An external shock or regulatory/market change that breaks the model
3. INTERNAL THREAT: A scaling, operational, or team issue that could implode the company

For each threat, provide a survival protocol - what the startup should do to mitigate or survive this scenario.

Return JSON:
{
  "scenarios": [
    {
      "type": "COMPETITOR" | "BLACK SWAN" | "INTERNAL",
      "title": "Specific threat title",
      "desc": "Detailed description of how this threat materializes (2-3 sentences)",
      "protocol": "Specific actionable survival strategy (2-3 sentences)"
    }
  ]
}

Be realistic and brutal. These should be genuine threats, not generic risks.`;

    const response = await callGemini(prompt, 0.8);
    const data = parseJSON(response);
    
    res.json({ 
      scenarios: data.scenarios,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('War room simulation error:', error);
    
    // Fallback scenarios
    const fallbackScenarios = [
      {
        type: "COMPETITOR",
        title: "Big Tech Acqui-Hire",
        desc: "A major tech company launches a similar feature and simultaneously tries to acqui-hire your founding team. They can give it away free and have infinite distribution. Customers start asking why they should pay you.",
        protocol: "Double down on vertical specialization. Serve a specific industry so deeply that the generic solution can't compete. Build proprietary data moats and long-term contracts with key accounts."
      },
      {
        type: "BLACK SWAN",
        title: "Regulatory Hammer",
        desc: "A new regulation suddenly makes your core business model illegal or uneconomical in your primary market. Compliance costs would consume all revenue. Competitors pivot faster.",
        protocol: "Build geo-arbitrage from day one - operate in multiple jurisdictions. Maintain a 'regulatory pivot' plan with alternative business models ready. Join industry associations early to shape regulation."
      },
      {
        type: "INTERNAL",
        title: "Technical Debt Collapse",
        desc: "Your MVP architecture can't scale. The codebase becomes unmaintainable. Customer growth stalls because you're spending 80% of eng time on firefighting. Key engineers quit in frustration.",
        protocol: "Allocate 20% of every sprint to infrastructure from day one. Build with boring, proven tech. Hire senior engineers who have scaled systems before. Consider strategic 'rebuild while running' phases."
      }
    ];
    
    res.json({ 
      scenarios: fallbackScenarios,
      fallback: true,
      message: 'Using template threat scenarios'
    });
  }
});

export default router;
