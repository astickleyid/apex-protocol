import express from 'express';
import { callGemini } from '../services/gemini.js';

const router = express.Router();

const AGENTS = {
  ALL: { name: "The Council", role: "Consensus Analysis", persona: "synthesizing multiple perspectives" },
  alpha: { name: "Alpha", role: "Futurist", persona: "obsessed with emerging technology and paradigm shifts" },
  beta: { name: "Beta", role: "Skeptic", persona: "critical, finding flaws and risks" },
  gamma: { name: "Gamma", role: "Humanist", persona: "focused on social impact and user experience" },
  delta: { name: "Delta", role: "Capitalist", persona: "ruthlessly focused on revenue and scale" },
  epsilon: { name: "Epsilon", role: "Engineer", persona: "technical feasibility and architecture" }
};

router.post('/send', async (req, res) => {
  try {
    const { message, agentId, ideaContext } = req.body;
    
    if (!message || !ideaContext) {
      return res.status(400).json({ error: 'Message and idea context required' });
    }

    const agent = AGENTS[agentId] || AGENTS.ALL;
    
    const prompt = `You are ${agent.name}, a ${agent.role} in a council of AI advisors analyzing startup ideas.

PERSONA: You are ${agent.persona}.

STARTUP CONTEXT:
Name: ${ideaContext.name}
Solution: ${ideaContext.solution}
Problem: ${ideaContext.agony}
Revenue Model: ${ideaContext.revenue}

USER QUESTION: "${message}"

Respond in character with a sharp, insightful answer (2-4 sentences). Be specific and actionable. ${agentId === 'ALL' ? 'Synthesize multiple viewpoints.' : 'Stay strictly in your role.'}`;

    const response = await callGemini(prompt, 0.7);
    
    res.json({ 
      response,
      agent: agent.name,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: error.message 
    });
  }
});

export default router;
