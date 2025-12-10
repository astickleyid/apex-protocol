import { callGemini, parseJSON } from './gemini.js';

export async function generateIdeas(domain, catalyst, risk) {
  const prompt = `You are an expert startup advisor and venture analyst. Generate 6 detailed, realistic startup ideas for the "${domain}" domain.

CONSTRAINTS:
- Innovation Catalyst: ${catalyst || 'None specified'}
- Risk Profile: ${risk}
- Ideas must be novel, technically feasible, and have clear market potential
- Focus on real pain points and viable business models

RISK PROFILE GUIDELINES:
- "safe": Proven business models, low technical risk, incremental innovation
- "balanced": Mix of proven and novel approaches, moderate technical complexity
- "moonshot": Breakthrough technology, high technical risk, paradigm-shifting potential

Return a JSON object with this exact structure:
{
  "ideas": [
    {
      "id": 1,
      "name": "Startup Name (2-3 words)",
      "tagline": "One-sentence value proposition",
      "agony": "Detailed description of the painful problem this solves (2-3 sentences)",
      "solution": "How this startup solves the problem with specific technology/approach (3-4 sentences)",
      "moat": "Defensible competitive advantage and barriers to entry (2-3 sentences)",
      "revenue": "Clear revenue model with pricing strategy (2-3 sentences)",
      "whynow": "Why this is the right time for this solution - market timing, technology readiness, regulatory environment (2-3 sentences)",
      "valuation": "$XM" or "$XB" (realistic 5-year projection),
      "blueprint": [
        "Phase 1: Detailed first step with specific deliverables",
        "Phase 2: Detailed second step with specific deliverables", 
        "Phase 3: Detailed third step with specific deliverables",
        "Phase 4: Detailed fourth step with specific deliverables"
      ]
    }
  ]
}

Make each idea substantive, specific, and actionable. Use real market data and trends where applicable.`;

  try {
    const response = await callGemini(prompt, 0.8);
    const data = parseJSON(response);
    
    // Validate structure
    if (!data.ideas || !Array.isArray(data.ideas)) {
      throw new Error('Invalid response structure');
    }
    
    // Ensure all ideas have required fields
    data.ideas = data.ideas.map((idea, index) => ({
      id: idea.id || index + 1,
      name: idea.name || 'Unnamed Startup',
      tagline: idea.tagline || '',
      agony: idea.agony || '',
      solution: idea.solution || '',
      moat: idea.moat || '',
      revenue: idea.revenue || '',
      whynow: idea.whynow || 'Market timing is favorable',
      valuation: idea.valuation || '$10M',
      blueprint: Array.isArray(idea.blueprint) ? idea.blueprint : []
    }));
    
    return data.ideas;
  } catch (error) {
    console.error('Error generating ideas:', error);
    throw error;
  }
}

export function getFallbackIdeas(domain) {
  return [
    {
      id: 1,
      name: "AdminAI",
      tagline: "Life Admin Automation",
      valuation: "$1.2B",
      agony: "People spend 20+ hours per month managing bills, subscriptions, and financial admin. Most pay for services they don't use and overpay on utilities due to lack of time to negotiate.",
      solution: "AI agent with limited power of attorney that monitors all recurring charges, automatically negotiates better rates with providers, cancels unused subscriptions, and handles bill disputes. Uses banking API integrations and natural language processing to act on user's behalf.",
      revenue: "Take 20% of all savings generated. No savings, no charge. Average user saves $200/month, we make $40/month per active user.",
      moat: "Banking API integrations take 18+ months to establish. Network effects from provider relationships. Regulatory compliance creates high barriers to entry.",
      whynow: "Open banking APIs now mature. Consumer trust in AI agents growing. Economic pressure making people cost-conscious.",
      blueprint: [
        "Phase 1: Build OCR receipt scanner and bank integration MVP with 3 major banks",
        "Phase 2: Launch manual concierge pilot with 100 users to validate value prop and unit economics",
        "Phase 3: Train AI negotiation models on successful human interactions, automate 80% of cases",
        "Phase 4: Partner with enterprise benefits platforms to offer as employee perk at scale"
      ]
    },
    {
      id: 2,
      name: "LegacyVault",
      tagline: "Digital Estate Planning",
      valuation: "$850M",
      agony: "Billions in crypto and digital assets are lost each year when owners die unexpectedly. Families can't access critical accounts, passwords, or investments. Traditional estate planning doesn't cover digital assets.",
      solution: "Secure dead man's switch system that monitors user activity and automatically releases encrypted credentials, crypto keys, and digital instructions to designated beneficiaries after verified death. Multi-signature verification prevents false triggers.",
      revenue: "Freemium model: Free for basic password vault, $15/month for full estate features, $500 one-time setup for high-net-worth clients with legal integration.",
      moat: "Security infrastructure and insurance partnerships create trust. Legal framework for digital asset transfer. First-mover advantage in regulated space.",
      whynow: "First generation of crypto millionaires aging. Recent high-profile cases of lost fortunes. Regulatory clarity emerging on digital asset inheritance.",
      blueprint: [
        "Phase 1: Build encrypted vault with dead man's switch, launch to crypto communities",
        "Phase 2: Partner with death certificate verification APIs and identity services",
        "Phase 3: Close deals with 3 major life insurance companies for bundled offering",
        "Phase 4: Become default standard for digital estate planning through legal partnerships"
      ]
    },
    {
      id: 3,
      name: "DeepVax",
      tagline: "In-Silico Clinical Trials",
      valuation: "$4B",
      agony: "Drug trials take 10+ years and cost $2B per drug. 90% of drugs fail in human trials. Rare diseases can't attract trial participants. Animal models don't predict human response.",
      solution: "Digital twin platform that simulates human biology at cellular level to test drug efficacy and safety in silico. Uses patient data, genomics, and protein folding models to predict drug response before human trials.",
      revenue: "License to pharma companies at $5M per trial simulation. Take 2% royalty on drugs that use our platform for FDA approval.",
      moat: "Proprietary biological models trained on decades of clinical data. FDA relationship for approval pathway. Massive compute infrastructure.",
      whynow: "AlphaFold 3 solved protein structure. FDA released guidance on model-based drug approval. GPU costs falling while compute power rising.",
      blueprint: [
        "Phase 1: Train models on historical trial data, validate retrospectively on 50 known drugs",
        "Phase 2: Run parallel in-silico trials alongside Phase 1 trials to prove predictive power",
        "Phase 3: Secure FDA pilot program for accelerated approval pathway using simulation data",
        "Phase 4: Scale to 20 pharma partners and become required step before human trials"
      ]
    },
    {
      id: 4,
      name: "Fabric",
      tagline: "Local Manufacturing Network",
      valuation: "$300M",
      agony: "Supply chain disruptions cause 6-month delays for simple products. Shipping costs and carbon emissions are unsustainable. Small manufacturers sit idle while consumers wait for overseas goods.",
      solution: "Network of local manufacturers, 3D printers, and craftspeople connected through a platform that routes production to nearest capable maker. Digital patterns and specifications enable distributed manufacturing.",
      revenue: "Take 15% marketplace fee on all transactions. Subscription model for manufacturers ($99/month). License pattern library to brands ($10k/year).",
      moat: "Network effects from maker density. Curated pattern library with IP protection. Quality control systems and logistics infrastructure.",
      whynow: "Supply chain chaos made local manufacturing economically viable. 3D printing costs dropped 80%. Consumer preference shifting to sustainable, local goods.",
      blueprint: [
        "Phase 1: Recruit 500 makers in one city, build pattern library with 1000 products",
        "Phase 2: Launch consumer app, prove unit economics with apparel and home goods",
        "Phase 3: Expand to 10 cities, sign 5 brands to manufacture their products locally",
        "Phase 4: Become B2B infrastructure - brands use Fabric instead of overseas factories"
      ]
    },
    {
      id: 5,
      name: "Orbit",
      tagline: "Third Place Infrastructure",
      valuation: "$550M",
      agony: "Loneliness epidemic affecting 60% of adults. Coffee shops and public spaces exist but lack coordination mechanisms. People want community but don't know where to find their tribe.",
      solution: "Platform that enables cafes, libraries, and coworking spaces to host interest-based group gatherings. Algorithm matches people with similar interests and suggests optimal times/places. Venues get guaranteed foot traffic.",
      revenue: "Booking fee of $3 per attendee. Premium membership $12/month for unlimited events. Venue partnership fees $200/month for promoted listings.",
      moat: "Two-sided network effects. Proprietary matching algorithm. Relationships with commercial real estate and venue chains.",
      whynow: "Post-pandemic social infrastructure collapsed. Remote work created flexible schedules. Mental health crisis driving demand for IRL connection.",
      blueprint: [
        "Phase 1: Launch in one neighborhood with 20 venues, manually curate first 100 events",
        "Phase 2: Build self-service tools for event hosts, grow to 1000 weekly active users",
        "Phase 3: Expand to 5 cities, partner with national cafe chains for guaranteed venues",
        "Phase 4: Launch corporate team building product and membership program for recurring revenue"
      ]
    },
    {
      id: 6,
      name: "Cortex",
      tagline: "AI-Native Database",
      valuation: "$2.1B",
      agony: "Developers spend 40% of time writing data transformation code. Traditional databases weren't built for AI workloads. Vector databases are too specialized and SQL databases can't handle embeddings efficiently.",
      solution: "Database engine that natively understands embeddings, text, and structured data. Query in natural language or SQL. Automatic semantic indexing and caching. Built-in RAG and fine-tuning pipelines.",
      revenue: "Usage-based: $0.10 per million tokens processed. Enterprise licenses $50k/year for on-premise deployment. Managed cloud service with free tier.",
      moat: "Novel indexing algorithm (patents filed). Integration with all major LLM providers. First-mover in AI-native data infrastructure.",
      whynow: "AI apps moving to production, hitting database bottlenecks. Postgres + pgvector doesn't scale. $40B AI infrastructure market emerging.",
      blueprint: [
        "Phase 1: Build core engine with semantic search, launch open source to gain adoption",
        "Phase 2: Release managed cloud service, convert 5% of users to paid with SLA guarantees",
        "Phase 3: Launch enterprise on-premise version for banks/healthcare with compliance needs",
        "Phase 4: Become standard database for AI apps through framework integrations and developer advocacy"
      ]
    }
  ];
}
