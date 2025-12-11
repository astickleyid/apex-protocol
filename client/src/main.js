// --- CONSTANTS ---
const MODEL = "gemini-2.0-flash-exp";
let apiKey = "";
let appState = { ideas: [], activeId: null, selectedAgent: "ALL" };

// Charts
let funnelChart = null;
let marketChart = null;

const AGENTS = [
    { id: "ALL", name: "The Council", role: "Consensus", color: "text-white" },
    { id: "alpha", name: "Alpha", role: "Futurist", color: "text-blue-400" },
    { id: "beta", name: "Beta", role: "Skeptic", color: "text-red-400" },
    { id: "gamma", name: "Gamma", role: "Humanist", color: "text-emerald-400" },
    { id: "delta", name: "Delta", role: "Capitalist", color: "text-amber-400" },
    { id: "epsilon", name: "Epsilon", role: "Engineer", color: "text-purple-400" }
];

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    const k = localStorage.getItem('apex_key');
    if(k) { apiKey = k; document.getElementById('apiKeyInp').value = k; }
    
    initCharts();
    renderAgents();
    renderAgentSelectors();
    
    // Auto-load fallback
    const stored = localStorage.getItem('apex_session');
    if(stored) {
        try {
            const data = JSON.parse(stored);
            appState.ideas = data.ideas;
            updateCharts(appState.ideas);
            renderList();
            selectIdea(appState.ideas[0].id);
        } catch(e) { loadFallback(); }
    } else {
        loadFallback(); 
    }
    
    // Hide loader after app initializes
    setTimeout(() => {
        const loader = document.getElementById('apex-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }
    }, 1500);
});

// --- CORE LOGIC ---

async function runSimulation() {
    const domain = document.getElementById('inpDomain').value || "General Tech";
    const catalyst = document.getElementById('inpCatalyst').value;
    const risk = document.getElementById('inpRisk').value;
    
    closeMissionModal();
    document.getElementById('simModal').classList.remove('hidden');
    const log = document.getElementById('simLog');
    const bar = document.getElementById('simBar');
    
    log.innerHTML = '';
    bar.style.width = '0%';

    // Visual Simulation Steps
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 4;
        if(progress > 95) progress = 95;
        bar.style.width = `${progress}%`;
        
        if(Math.random() > 0.6) {
            const agent = AGENTS.slice(1)[Math.floor(Math.random() * (AGENTS.length - 1))];
            log.innerHTML += `<div class="mb-1"><span class="${agent.color} font-bold">[${agent.name}]</span> Analyzing vector...</div>`;
            log.scrollTop = log.scrollHeight;
        }
    }, 300);

    try {
        let ideas = [];
        
        if(apiKey) {
            // Real AI Call
            const res = await fetch('/api/ideas/generate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ domain, catalyst, risk })
            });
            const data = await res.json();
            ideas = data.ideas;
        } else {
            await new Promise(r => setTimeout(r, 4000));
            ideas = getFallbackIdeas(domain);
        }

        clearInterval(interval);
        bar.style.width = '100%';
        
        appState.ideas = ideas;
        localStorage.setItem('apex_session', JSON.stringify({ideas}));
        
        setTimeout(() => {
            document.getElementById('simModal').classList.add('hidden');
            updateCharts(ideas);
            renderList();
            selectIdea(ideas[0].id);
        }, 800);

    } catch(e) {
        console.error(e);
        clearInterval(interval);
        alert("Error during simulation. Loading offline backup.");
        loadFallback();
        document.getElementById('simModal').classList.add('hidden');
    }
}

// --- PITCH DECK LOGIC ---
async function generatePitch() {
    if(!appState.activeId) return;
    const idea = appState.ideas.find(i => i.id === appState.activeId);
    
    document.getElementById('pitchEmpty').classList.add('hidden');
    document.getElementById('pitchContent').classList.add('hidden');
    document.getElementById('pitchLoading').classList.remove('hidden');

    try {
        let slides = [];
        if(apiKey) {
            const res = await fetch('/api/pitch/generate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ ideaId: idea.id, idea })
            });
            const data = await res.json();
            slides = data.slides;
        } else {
            await new Promise(r => setTimeout(r, 2000));
            slides = [
                {title: "The Problem", bullets: ["Inefficiency is high", "Cost is prohibitive", "Users are frustrated"]},
                {title: "The Solution", bullets: ["AI-First approach", "Automated workflows", "Seamless integration"]},
                {title: "Market Size", bullets: ["TAM: $10B", "SAM: $2B", "SOM: $500M"]},
                {title: "Business Model", bullets: ["SaaS Subscription", "Enterprise Tiers", "High Margins"]},
                {title: "Go-to-Market", bullets: ["Direct Sales", "Content Marketing", "Partnerships"]},
                {title: "Competition", bullets: ["Incumbents are slow", "Legacy tech debt", "We are 10x faster"]},
                {title: "The Team", bullets: ["Ex-Google Engineers", "Serial Founders", "Domain Experts"]},
                {title: "The Ask", bullets: ["Raising $2M", "18 months runway", "Achieve $1M ARR"]}
            ];
        }

        const container = document.getElementById('pitchContent');
        container.innerHTML = '';
        slides.forEach((s, i) => {
            let html = `<div class="slide-card p-4 rounded-lg relative overflow-hidden group">
                <div class="absolute top-2 right-3 text-stone-700 font-bold text-4xl opacity-20 group-hover:text-orange-500 transition-colors">0${i+1}</div>
                <h4 class="text-orange-500 font-bold mb-3 uppercase text-xs tracking-wider">${s.title}</h4>
                <ul class="space-y-2">`;
            s.bullets.forEach(b => html += `<li class="text-stone-400 text-xs leading-snug">• ${b}</li>`);
            html += `</ul></div>`;
            container.innerHTML += html;
        });

        document.getElementById('pitchLoading').classList.add('hidden');
        document.getElementById('pitchContent').classList.remove('hidden');

    } catch(e) {
        console.error(e);
        alert("Deck generation failed.");
        document.getElementById('pitchLoading').classList.add('hidden');
        document.getElementById('pitchEmpty').classList.remove('hidden');
    }
}

// --- WAR ROOM LOGIC ---
async function runWarGame() {
    if(!appState.activeId) return;
    const idea = appState.ideas.find(i => i.id === appState.activeId);
    
    document.getElementById('warRoomEmpty').classList.add('hidden');
    document.getElementById('warRoomContent').classList.add('hidden');
    document.getElementById('warRoomLoading').classList.remove('hidden');

    try {
        let scenarios = [];
        if(apiKey) {
            const res = await fetch('/api/warroom/analyze', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ ideaId: idea.id, idea })
            });
            const data = await res.json();
            scenarios = data.scenarios;
        } else {
            await new Promise(r => setTimeout(r, 2000));
            scenarios = [
                {type: "COMPETITOR", title: "Big Tech Clone", desc: "A giant integrates your feature.", protocol: "Pivot to Enterprise."},
                {type: "BLACK SWAN", title: "Regulator Ban", desc: "New law kills core mechanic.", protocol: "Lobby & geo-arbitrage."},
                {type: "INTERNAL", title: "Tech Debt", desc: "Scale breaks architecture.", protocol: "Rewrite core engine."}
            ];
        }

        const grid = document.getElementById('warRoomGrid');
        grid.innerHTML = '';
        scenarios.forEach(s => {
            grid.innerHTML += `
                <div class="bg-stone-900 border border-red-900/30 rounded-lg p-5 hover:border-red-600 transition-colors">
                    <div class="text-xs font-bold text-red-500 mb-2 uppercase tracking-widest">${s.type} THREAT</div>
                    <h4 class="text-white font-bold text-lg mb-2">${s.title}</h4>
                    <p class="text-stone-400 text-sm mb-4 leading-relaxed">${s.desc}</p>
                    <div class="bg-red-900/10 p-3 rounded border-l-2 border-red-600">
                        <div class="text-[10px] text-red-400 font-bold mb-1 uppercase">Survival Protocol</div>
                        <p class="text-xs text-stone-300">${s.protocol}</p>
                    </div>
                </div>
            `;
        });

        document.getElementById('warRoomLoading').classList.add('hidden');
        document.getElementById('warRoomContent').classList.remove('hidden');

    } catch(e) {
        document.getElementById('warRoomLoading').classList.add('hidden');
        document.getElementById('warRoomEmpty').classList.remove('hidden');
    }
}

// --- RENDERING ---

function renderList() {
    const list = document.getElementById('candidateList');
    list.innerHTML = '';
    appState.ideas.forEach((idea, idx) => {
        const el = document.createElement('div');
        el.className = 'idea-row p-4 border-b border-stone-800 cursor-pointer';
        el.onclick = () => selectIdea(idea.id);
        el.id = `row-${idea.id}`;
        el.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-orange-500 font-mono text-xs font-bold">0${idx+1}</span>
                <span class="text-stone-500 text-[10px] font-mono">${idea.valuation || '$10M'}</span>
            </div>
            <div class="text-white font-bold text-sm mb-1">${idea.name}</div>
            <div class="text-stone-500 text-xs truncate">${idea.tagline}</div>
        `;
        list.appendChild(el);
    });
}

function selectIdea(id) {
    appState.activeId = id;
    const idea = appState.ideas.find(i => i.id === id);
    if(!idea) return;

    document.querySelectorAll('.idea-row').forEach(e => e.classList.remove('active'));
    const row = document.getElementById(`row-${id}`);
    if(row) row.classList.add('active');

    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('contentPanel').classList.remove('hidden');

    // Reset tabs
    document.getElementById('warRoomContent').classList.add('hidden');
    document.getElementById('warRoomEmpty').classList.remove('hidden');
    document.getElementById('pitchContent').classList.add('hidden');
    document.getElementById('pitchEmpty').classList.remove('hidden');

    // Populate Intel
    document.getElementById('detailName').innerText = idea.name;
    document.getElementById('detailTagline').innerText = idea.tagline;
    document.getElementById('detailVal').innerText = idea.valuation || "$15M";
    document.getElementById('detailRank').innerText = `RANK #${appState.ideas.indexOf(idea)+1}`;
    document.getElementById('intelAgony').innerText = idea.agony;
    document.getElementById('intelSolution').innerText = idea.solution;
    document.getElementById('intelMoat').innerText = idea.moat;
    document.getElementById('intelRev').innerText = idea.revenue;
    document.getElementById('intelWhy').innerText = idea.whynow || "Market conditions optimal.";

    // Populate Blueprint
    const bp = document.getElementById('blueprintContainer');
    bp.innerHTML = '';
    (idea.blueprint || []).forEach((step, idx) => {
        bp.innerHTML += `
            <div class="timeline-node fade-in" style="animation-delay: ${idx*0.1}s">
                <div class="timeline-dot"></div>
                <div class="text-orange-500 font-mono text-xs mb-1">PHASE 0${idx+1}</div>
                <div class="text-stone-300 text-sm leading-relaxed">${step}</div>
            </div>
        `;
    });

    document.getElementById('chatContainer').innerHTML = '';
    addChatMsg(`Uplink active for ${idea.name}. Select an agent or ask the full Council.`, 'ai');
    setTab('intel');
}

// --- CHARTS ---
function initCharts() {
    if (funnelChart) funnelChart.destroy();
    const ctx1 = document.getElementById('funnelChart').getContext('2d');
    funnelChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Raw', 'Filtered', 'Final'],
            datasets: [{ data: [15000, 1400, 10], backgroundColor: ['#292524', '#57534e', '#f97316'], barPercentage: 0.5 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { type: 'logarithmic', display: false } } }
    });

    if (marketChart) marketChart.destroy();
    const ctx2 = document.getElementById('marketChart').getContext('2d');
    marketChart = new Chart(ctx2, {
        type: 'bar',
        data: { labels: [], datasets: [{ data: [], backgroundColor: '#44403c', hoverBackgroundColor: '#f97316', borderRadius: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
}

function updateCharts(ideas) {
    funnelChart.data.datasets[0].data = [Math.floor(Math.random()*5000)+10000, Math.floor(Math.random()*200)+100, ideas.length];
    funnelChart.update();
    marketChart.data.labels = ideas.map(i => i.name.substring(0, 3));
    marketChart.data.datasets[0].data = ideas.map((_, i) => (ideas.length - i) * 2 + Math.random()*2);
    marketChart.update();
}

// --- CHAT & AGENTS ---

function renderAgentSelectors() {
    const container = document.getElementById('chatAgentSelector');
    container.innerHTML = '';
    AGENTS.forEach((a, i) => {
        const isSelected = i === 0 ? 'selected' : '';
        container.innerHTML += `
            <button onclick="selectAgent('${a.id}')" id="agent-btn-${a.id}" 
                class="agent-toggle ${isSelected} px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ${a.color} bg-stone-900 border border-stone-800">
                ${a.name}
            </button>
        `;
    });
}

function selectAgent(id) {
    appState.selectedAgent = id;
    document.querySelectorAll('.agent-toggle').forEach(el => el.classList.remove('selected'));
    document.getElementById(`agent-btn-${id}`).classList.add('selected');
}

async function sendChat() {
    const inp = document.getElementById('chatInput');
    const msg = inp.value.trim();
    if(!msg) return;
    
    addChatMsg(msg, 'user');
    inp.value = '';
    
    if(!apiKey) {
        setTimeout(() => addChatMsg("OFFLINE MODE: Please add API key in settings.", 'ai'), 500);
        return;
    }

    const activeIdea = appState.ideas.find(i => i.id === appState.activeId);
    const agent = AGENTS.find(a => a.id === appState.selectedAgent);
    
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                message: msg, 
                context: { idea: activeIdea, agent: agent }
            })
        });
        const data = await res.json();
        const reply = data.response;
        addChatMsg(`<span class="${agent.color} font-bold mr-2">[${agent.name}]</span> ${reply}`, 'ai');
    } catch(e) {
        addChatMsg("Connection Error.", 'ai');
    }
}

function addChatMsg(txt, role) {
    const box = document.getElementById('chatContainer');
    const d = document.createElement('div');
    d.className = `chat-bubble ${role === 'user' ? 'chat-user' : 'chat-ai'} fade-in`;
    d.innerHTML = txt;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
}

// --- HELPERS ---
function renderAgents() {
    const list = document.getElementById('agentStatusList');
    AGENTS.slice(1).forEach(a => {
        list.innerHTML += `<div class="flex justify-between items-center text-[10px] font-mono text-stone-400 border-b border-stone-800 pb-1"><span class="${a.color} font-bold">${a.name}</span><span>ACTIVE</span></div>`;
    });
}

function setTab(name) {
    ['intel','blueprint','pitch','uplink','warroom'].forEach(t => {
        document.getElementById(`view-${t}`).classList.add('hidden');
        document.getElementById(`tab-${t}`).classList.remove('active');
    });
    document.getElementById(`view-${name}`).classList.remove('hidden');
    document.getElementById(`tab-${name}`).classList.add('active');
}

function loadFallback() {
    fetch('/api/ideas/fallback')
        .then(res => res.json())
        .then(data => {
            appState.ideas = data.ideas;
            updateCharts(data.ideas);
            renderList();
            selectIdea(data.ideas[0].id);
        })
        .catch(e => {
            const ideas = getFallbackIdeas("General Tech");
            appState.ideas = ideas;
            updateCharts(ideas);
            renderList();
            selectIdea(ideas[0].id);
        });
}

function getFallbackIdeas(topic) {
    return [
        {id:1, name:"AdminAI", tagline:"Life Admin Automation", valuation:"$1.2B", agony:"People spend 20hrs/mo on bills.", solution:"AI with Power of Attorney to negotiate/cancel bills.", revenue:"20% of savings.", moat:"Banking Integrations.", blueprint:["Build OCR Scanner","Manual Pilot","Scale AI","Enterprise Benefit"]},
        {id:2, name:"LegacyVault", tagline:"Digital Estate Planning", valuation:"$850M", agony:"Assets lost on death.", solution:"Dead man's switch for crypto & passwords.", revenue:"Freemium.", moat:"Security Trust.", blueprint:["Vault MVP","Legal API","Insurer Deal","Global Standard"]},
        {id:3, name:"DeepVax", tagline:"In-Silico Trials", valuation:"$4B", agony:"Drug trials slow.", solution:"Simulate human biology for testing.", revenue:"Pharma License.", moat:"Data Models.", blueprint:["Model Train","Retro-Test","FDA Pilot","Scale"]},
        {id:4, name:"Fabric", tagline:"Local Manufacturing", valuation:"$300M", agony:"Supply chain breaks.", solution:"Network of 3D printers/sewers.", revenue:"Marketplace Fee.", moat:"Node Density.", blueprint:["Recruit Makers","Pattern Lib","Consumer App","B2B"]},
        {id:5, name:"Orbit", tagline:"Third Place App", valuation:"$150M", agony:"Loneliness epidemic.", solution:"Unlocks cafe tables for interest groups.", revenue:"Booking Fee.", moat:"Network Effect.", blueprint:["City Pilot","Cafe Ops","Scale","Membership"]}
    ];
}

// Modals
window.openMissionModal = () => document.getElementById('missionModal').classList.remove('hidden');
window.closeMissionModal = () => document.getElementById('missionModal').classList.add('hidden');
window.toggleSettings = () => document.getElementById('settingsModal').classList.toggle('hidden');
window.saveKey = () => {
    const k = document.getElementById('apiKeyInp').value;
    apiKey = k; localStorage.setItem('apex_key', k);
    toggleSettings();
};

// Global exports
window.runSimulation = runSimulation;
window.generatePitch = generatePitch;
window.runWarGame = runWarGame;
window.selectAgent = selectAgent;
window.sendChat = sendChat;
window.setTab = setTab;
