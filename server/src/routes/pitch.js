import express from 'express';
import { callGemini, parseJSON } from '../services/gemini.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { idea } = req.body;
    
    if (!idea || !idea.name) {
      return res.status(400).json({ error: 'Idea context required' });
    }

    const prompt = `Create a professional 10-slide VC pitch deck outline for the startup "${idea.name}".

CONTEXT:
- Problem: ${idea.agony}
- Solution: ${idea.solution}
- Business Model: ${idea.revenue}
- Market Timing: ${idea.whynow}
- Competitive Advantage: ${idea.moat}
- Valuation Target: ${idea.valuation}

Generate a structured pitch deck with these slides:
1. Problem (the pain point)
2. Solution (your product)
3. Market Size (TAM/SAM/SOM)
4. Product/Demo (how it works)
5. Business Model (revenue streams)
6. Go-to-Market (customer acquisition)
7. Competition (competitive landscape)
8. Traction/Milestones (if early stage, show roadmap)
9. Team (founder strengths)
10. The Ask (funding amount and use of funds)

Return JSON array:
[
  {
    "title": "Slide Title",
    "bullets": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Make each slide concise, compelling, and VC-ready. Use specific numbers and metrics where possible.`;

    const response = await callGemini(prompt, 0.6);
    const slides = parseJSON(response);
    
    res.json({ 
      slides,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Pitch generation error:', error);
    
    // Fallback slides
    const fallbackSlides = [
      { title: "The Problem", bullets: ["Market inefficiency is costing billions", "Current solutions are inadequate", "Users are demanding better alternatives"] },
      { title: "Our Solution", bullets: ["AI-first approach to solve the core issue", "10x improvement over existing solutions", "Seamless integration with existing workflows"] },
      { title: "Market Opportunity", bullets: ["TAM: $10B+ addressable market", "SAM: $2B serviceable market", "SOM: $500M obtainable in 5 years"] },
      { title: "Product Demo", bullets: ["Intuitive user interface", "Powerful automation engine", "Enterprise-grade security"] },
      { title: "Business Model", bullets: ["SaaS subscription: $99-$999/month", "Usage-based pricing for scale", "70%+ gross margins"] },
      { title: "Go-to-Market", bullets: ["Direct B2B sales", "Product-led growth", "Strategic partnerships"] },
      { title: "Competitive Landscape", bullets: ["Incumbents are slow to innovate", "Legacy tech creates opportunity", "We have 24-month lead"] },
      { title: "Traction", bullets: ["Beta with 50 customers", "Path to $1M ARR", "Strong product-market fit signals"] },
      { title: "Team", bullets: ["Founders: 20+ years combined experience", "Experts in AI and industry domain", "Backed by top-tier advisors"] },
      { title: "The Ask", bullets: ["Raising $2M seed round", "18-month runway to Series A", "Use of funds: Product (60%), Sales (30%), Operations (10%)"] }
    ];
    
    res.json({ 
      slides: fallbackSlides,
      fallback: true,
      message: 'Using template pitch deck'
    });
  }
});

export default router;
