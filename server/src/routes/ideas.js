import express from 'express';
import { generateIdeas, getFallbackIdeas } from '../services/ideaGenerator.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { domain, catalyst, risk } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const ideas = await generateIdeas(
      domain,
      catalyst || '',
      risk || 'balanced'
    );
    
    res.json({ ideas, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error generating ideas:', error);
    
    // Fallback to offline mode
    const fallbackIdeas = getFallbackIdeas(req.body.domain);
    res.json({ 
      ideas: fallbackIdeas, 
      fallback: true,
      message: 'Using fallback ideas due to API error',
      timestamp: new Date().toISOString() 
    });
  }
});

router.get('/fallback', (req, res) => {
  const domain = req.query.domain || 'General Tech';
  const ideas = getFallbackIdeas(domain);
  res.json({ ideas, fallback: true });
});

export default router;
