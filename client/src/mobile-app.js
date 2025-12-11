// Apex Protocol Mobile App - Complete Implementation
import { getApiUrl } from './api-config.js';

const API_BASE = getApiUrl();
const MODEL = "gemini-2.0-flash-exp";

// State
const state = {
    ideas: [],
    activeIdeaId: null,
    selectedAgent: 'ALL',
    apiKey: localStorage.getItem('apex_key') || ''
};

// Agents
const AGENTS = [
    { id: 'ALL', name: 'Council', color: '#fff' },
    { id: 'alpha', name: 'Alpha', color: '#3b82f6' },
    { id: 'beta', name: 'Beta', color: '#ef4444' },
    { id: 'gamma', name: 'Gamma', color: '#10b981' },
    { id: 'delta', name: 'Delta', color: '#f59e0b' },
    { id: 'epsilon', name: 'Epsilon', color: '#8b5cf6' }
];

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Apex Protocol Mobile initializing...');
    
    // Load stored data
    const stored = localStorage.getItem('apex_session');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            state.ideas = data.ideas || [];
        } catch(e) {
            loadFallbackIdeas();
        }
    } else {
        loadFallbackIdeas();
    }
    
    // Setup scroll progress indicator
    setupScrollProgress();
    
    // Render initial state
    renderIdeasList();
    renderAgentGrid();
    
    // Load settings
    const apiKeyInput = document.getElementById('settingsApiKey');
    if (apiKeyInput && state.apiKey) {
        apiKeyInput.value = state.apiKey;
    }
    
    // Hide loader
    setTimeout(() => {
        const loader = document.getElementById('apex-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1500);
    
    console.log('✅ Mobile app ready');
});

// === NAVIGATION ===
window.showView = function(viewName) {
    // Hide all views
    document.querySelectorAll('.mobile-view').forEach(v => {
        v.classList.remove('active');
    });
    
    // Show selected view
    const view = document.getElementById(`view-${viewName}`);
    if (view) {
        view.classList.add('active');
    }
    
    // Update nav
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const navItem = document.querySelector(`[data-view="${viewName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
};

window.showDetailTab = function(tabName) {
    // Hide all tabs
    document.querySelectorAll('.mobile-tab-content').forEach(t => {
        t.style.display = 'none';
    });
    
    // Show selected tab
    const tab = document.getElementById(`tab-${tabName}`);
    if (tab) {
        tab.style.display = 'block';
    }
    
    // Update tab buttons
    document.querySelectorAll('.mobile-detail-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
};

// === IDEAS LIST ===
function renderIdeasList() {
    const container = document.getElementById('ideasList');
    const countEl = document.getElementById('ideasCount');
    
    if (!container) return;
    
    countEl.textContent = `${state.ideas.length} OPERATION${state.ideas.length !== 1 ? 'S' : ''} READY`;
    
    if (state.ideas.length === 0) {
        container.innerHTML = `
            <div class="mobile-empty-state">
                <svg class="mobile-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <div class="mobile-empty-title">No Operations Generated</div>
                <div class="mobile-empty-subtitle">Tap "New" to create your first operation</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.ideas.map((idea, idx) => `
        <div class="mobile-idea-card" onclick="showIdea(${idea.id})">
            <div class="mobile-idea-header">
                <span class="mobile-idea-rank">#${idx + 1}</span>
                <span class="mobile-idea-value">${idea.valuation || '$10M'}</span>
            </div>
            <div class="mobile-idea-name">${idea.name}</div>
            <div class="mobile-idea-tagline">${idea.tagline}</div>
        </div>
    `).join('');
}

window.showIdea = function(id) {
    const idea = state.ideas.find(i => i.id === id);
    if (!idea) return;
    
    state.activeIdeaId = id;
    const idx = state.ideas.indexOf(idea);
    
    // Update header
    document.getElementById('detailRank').textContent = `#${idx + 1}`;
    document.getElementById('detailValue').textContent = idea.valuation || '$10M';
    document.getElementById('detailName').textContent = idea.name;
    document.getElementById('detailTagline').textContent = idea.tagline;
    
    // Render Intel tab
    renderIntelTab(idea);
    
    // Render Blueprint tab
    renderBlueprintTab(idea);
    
    // Reset other tabs
    document.getElementById('pitchContent').innerHTML = '';
    document.getElementById('chatMessages').innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #78716c;">
            <p style="font-size: 0.9rem;">Council uplink active for <strong>${idea.name}</strong></p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem;">Select an agent and ask questions</p>
        </div>
    `;
    document.getElementById('warRoomContent').innerHTML = '';
    
    // Show detail view
    showView('detail');
    
    // Reset to Intel tab
    showDetailTab('intel');
};

function renderIntelTab(idea) {
    const container = document.getElementById('tab-intel');
    container.innerHTML = `
        <div style="padding: 1rem;">
            <div class="mobile-detail-section">
                <div class="mobile-detail-label" style="color: #f97316;">THE AGONY</div>
                <div class="mobile-detail-text">${idea.agony}</div>
            </div>
            
            <div class="mobile-detail-section">
                <div class="mobile-detail-label" style="color: #3b82f6;">THE SOLUTION</div>
                <div class="mobile-detail-text">${idea.solution}</div>
            </div>
            
            <div class="mobile-detail-section">
                <div class="mobile-detail-label">DEFENSIBILITY</div>
                <div class="mobile-detail-text">${idea.moat}</div>
            </div>
            
            <div class="mobile-detail-section">
                <div class="mobile-detail-label">REVENUE MODEL</div>
                <div class="mobile-detail-text">${idea.revenue}</div>
            </div>
            
            <div class="mobile-detail-section">
                <div class="mobile-detail-label">MARKET TIMING</div>
                <div class="mobile-detail-text">${idea.whynow || 'Market conditions are optimal for this venture.'}</div>
            </div>
        </div>
    `;
}

function renderBlueprintTab(idea) {
    const container = document.getElementById('tab-blueprint');
    const steps = idea.blueprint || [];
    
    container.innerHTML = `
        <div style="padding: 1rem;">
            <div style="margin-bottom: 1.5rem;">
                <div class="mobile-detail-label" style="color: #f97316; margin-bottom: 1rem;">EXECUTION ROADMAP</div>
            </div>
            ${steps.map((step, i) => `
                <div class="mobile-blueprint-item">
                    <div class="mobile-blueprint-phase">PHASE ${i + 1}</div>
                    <div class="mobile-blueprint-text">${step}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// === AGENTS & CHAT ===
function renderAgentGrid() {
    const grid = document.getElementById('agentGrid');
    if (!grid) return;
    
    grid.innerHTML = AGENTS.map(agent => `
        <button 
            class="mobile-agent-btn ${agent.id === state.selectedAgent ? 'active' : ''}" 
            onclick="selectAgent('${agent.id}')"
            style="color: ${agent.id === state.selectedAgent ? agent.color : '#78716c'}">
            ${agent.name}
        </button>
    `).join('');
}

window.selectAgent = function(agentId) {
    state.selectedAgent = agentId;
    renderAgentGrid();
};

window.sendMobileChat = async function() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    
    const messagesContainer = document.getElementById('chatMessages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'mobile-chat-bubble user';
    userMsg.textContent = msg;
    messagesContainer.appendChild(userMsg);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    if (!state.apiKey) {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'mobile-chat-bubble ai';
        aiMsg.textContent = '⚠️ Please configure your API key in Settings';
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return;
    }
    
    const idea = state.ideas.find(i => i.id === state.activeIdeaId);
    const agent = AGENTS.find(a => a.id === state.selectedAgent);
    
    const prompt = `
        Context: Startup "${idea.name}" - ${idea.solution}.
        You are ${agent.name} (${agent.id}). 
        User Question: "${msg}"
        Answer strictly in character. Be sharp, concise, and insightful.
    `;
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${state.apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        const reply = data.candidates[0].content.parts[0].text;
        
        const aiMsg = document.createElement('div');
        aiMsg.className = 'mobile-chat-bubble ai';
        aiMsg.innerHTML = `<strong style="color: ${agent.color}">[${agent.name}]</strong> ${reply}`;
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch(e) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'mobile-chat-bubble ai';
        errorMsg.textContent = '❌ Connection error. Check your API key.';
        messagesContainer.appendChild(errorMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

// === PITCH GENERATION ===
window.generateMobilePitch = async function() {
    const container = document.getElementById('pitchContent');
    const idea = state.ideas.find(i => i.id === state.activeIdeaId);
    
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #f97316;">Generating pitch deck...</div>';
    
    try {
        const slides = await generatePitchSlides(idea);
        container.innerHTML = slides.map((slide, i) => `
            <div class="mobile-detail-section">
                <div class="mobile-detail-label" style="color: #f97316;">SLIDE ${i + 1}: ${slide.title}</div>
                <ul style="color: #d6d3d1; font-size: 0.9rem; line-height: 1.8; list-style: none; padding-left: 0;">
                    ${slide.bullets.map(b => `<li style="margin-bottom: 0.5rem;">• ${b}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Generation failed. Check API key.</div>';
    }
};

async function generatePitchSlides(idea) {
    if (!state.apiKey) {
        return getFallbackPitch(idea);
    }
    
    const prompt = `Create an 8-slide VC pitch deck for "${idea.name}". Solution: ${idea.solution}. Return JSON: [{"title": "...", "bullets": ["...", "..."]}]`;
    
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${state.apiKey}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const data = await res.json();
    const txt = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    return JSON.parse(txt);
}

function getFallbackPitch(idea) {
    return [
        {title: "The Problem", bullets: ["Market pain point is severe", "Current solutions inadequate", "Timing is perfect"]},
        {title: "The Solution", bullets: [idea.solution, "10x better than alternatives", "Scalable technology"]},
        {title: "Market Size", bullets: ["TAM: $10B", "SAM: $2B", "SOM: $500M"]},
        {title: "Business Model", bullets: [idea.revenue, "High margins", "Recurring revenue"]},
        {title: "Traction", bullets: ["Early validation", "Growing demand", "Pilot customers"]},
        {title: "Competition", bullets: [idea.moat, "Unique advantages", "Defensible position"]},
        {title: "Team", bullets: ["Expert founders", "Domain expertise", "Proven track record"]},
        {title: "The Ask", bullets: ["Raising $2M", "18-month runway", "Scale to $1M ARR"]}
    ];
}

// === WAR ROOM ===
window.runMobileWarRoom = async function() {
    const container = document.getElementById('warRoomContent');
    const idea = state.ideas.find(i => i.id === state.activeIdeaId);
    
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Running war games...</div>';
    
    try {
        const scenarios = await generateWarScenarios(idea);
        container.innerHTML = scenarios.map(s => `
            <div class="mobile-detail-section" style="border-left: 3px solid #ef4444;">
                <div class="mobile-detail-label" style="color: #ef4444;">${s.type} THREAT</div>
                <div style="color: #fff; font-weight: 700; margin-bottom: 0.75rem; font-size: 1.1rem;">${s.title}</div>
                <div class="mobile-detail-text" style="margin-bottom: 1rem;">${s.desc}</div>
                <div style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 8px;">
                    <div style="color: #ef4444; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.5rem;">SURVIVAL PROTOCOL</div>
                    <div style="color: #d6d3d1; font-size: 0.85rem;">${s.protocol}</div>
                </div>
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Failed. Check API key.</div>';
    }
};

async function generateWarScenarios(idea) {
    if (!state.apiKey) {
        return [
            {type: "COMPETITOR", title: "Big Tech Clone", desc: "Major competitor copies your feature", protocol: "Pivot to Enterprise & build moat"},
            {type: "REGULATORY", title: "New Regulations", desc: "New laws impact core business", protocol: "Lobby & geographic arbitrage"},
            {type: "TECHNICAL", title: "Scale Failure", desc: "Architecture can't handle growth", protocol: "Rebuild core systems"}
        ];
    }
    
    const prompt = `Analyze "${idea.name}": ${idea.solution}. Generate 3 threat scenarios. Return JSON: {"scenarios": [{"type": "...", "title": "...", "desc": "...", "protocol": "..."}]}`;
    
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${state.apiKey}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const data = await res.json();
    const txt = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    return JSON.parse(txt).scenarios;
}

// === NEW OPERATION ===
window.runMobileOperation = async function() {
    const domain = document.getElementById('newDomain').value;
    const catalyst = document.getElementById('newCatalyst').value;
    const risk = document.getElementById('newRisk').value;
    
    // Show loader
    const loader = document.getElementById('apex-loader');
    loader.classList.remove('hidden');
    loader.style.display = 'flex';
    
    try {
        const res = await fetch(API_BASE + '/ideas/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ domain, catalyst, risk })
        });
        const data = await res.json();
        state.ideas = data.ideas;
        localStorage.setItem('apex_session', JSON.stringify({ideas: state.ideas}));
        renderIdeasList();
        
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.style.display = 'none', 500);
            showView('ideas');
        }, 1500);
    } catch(e) {
        console.error(e);
        const ideas = getFallbackIdeas(domain);
        state.ideas = ideas;
        localStorage.setItem('apex_session', JSON.stringify({ideas}));
        renderIdeasList();
        
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.style.display = 'none', 500);
            showView('ideas');
        }, 1500);
    }
};

// === SETTINGS ===
window.saveMobileSettings = function() {
    const key = document.getElementById('settingsApiKey').value;
    state.apiKey = key;
    localStorage.setItem('apex_key', key);
    
    alert('✅ API Key saved!');
};

// === FALLBACK DATA ===
function loadFallbackIdeas() {
    state.ideas = getFallbackIdeas('General Tech');
    localStorage.setItem('apex_session', JSON.stringify({ideas: state.ideas}));
}

function getFallbackIdeas(topic) {
    return [
        {id:1, name:"AdminAI", tagline:"Life Admin Automation", valuation:"$1.2B", agony:"People waste 20hrs/mo on bills.", solution:"AI with Power of Attorney to negotiate bills.", revenue:"20% of savings.", moat:"Banking integrations.", whynow:"AI assistants mainstream.", blueprint:["Build OCR Scanner","Manual Pilot","Scale AI","Enterprise"]},
        {id:2, name:"LegacyVault", tagline:"Digital Estate Planning", valuation:"$850M", agony:"Assets lost on death.", solution:"Dead man's switch for crypto & passwords.", revenue:"Freemium model.", moat:"Security trust.", whynow:"Crypto adoption growing.", blueprint:["Vault MVP","Legal API","Insurance Partnership","Global"]},
        {id:3, name:"DeepVax", tagline:"In-Silico Drug Trials", valuation:"$4B", agony:"Drug trials too slow.", solution:"Simulate human biology for testing.", revenue:"Pharma licensing.", moat:"Data models.", whynow:"AI revolution in healthcare.", blueprint:["Train Models","Retro-Test","FDA Pilot","Scale"]},
        {id:4, name:"Fabric", tagline:"Local Manufacturing Network", valuation:"$300M", agony:"Supply chains fragile.", solution:"Network of 3D printers/makers.", revenue:"Marketplace fee.", moat:"Network density.", whynow:"Supply chain crisis.", blueprint:["Recruit Makers","Pattern Library","Consumer App","B2B"]},
        {id:5, name:"Orbit", tagline:"Third Place App", valuation:"$150M", agony:"Loneliness epidemic.", solution:"Unlocks cafe tables for meetups.", revenue:"Booking fee.", moat:"Network effects.", whynow:"Post-pandemic connection need.", blueprint:["City Pilot","Cafe Operations","Scale Cities","Membership"]}
    ];
}

// === SCROLL PROGRESS ===
function setupScrollProgress() {
    const updateScroll = () => {
        const activeView = document.querySelector('.mobile-view.active');
        if (!activeView) return;
        
        const scrollTop = activeView.scrollTop;
        const scrollHeight = activeView.scrollHeight - activeView.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        const indicator = document.getElementById('scrollProgress');
        if (indicator) {
            indicator.style.width = `${progress}%`;
        }
    };
    
    document.querySelectorAll('.mobile-view').forEach(view => {
        view.addEventListener('scroll', updateScroll);
    });
}

console.log('📱 Mobile app module loaded');
