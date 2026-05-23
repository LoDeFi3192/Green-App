// ===== Bloom data: state + persistence + seed =====
window.BLOOM_KINDS = [
  { id: 'monstera', name: 'Monstera', emoji:'🌿', water: 7, light:'indirect', temp:22 },
  { id: 'cactus', name: 'Cactus', emoji:'🌵', water: 14, light:'plein soleil', temp:24 },
  { id: 'pothos', name: 'Pothos', emoji:'🪴', water: 5, light:'tamisée', temp:21 },
  { id: 'anthurium', name: 'Anthurium', emoji:'🌸', water: 6, light:'indirect', temp:22 },
  { id: 'ficus', name: 'Ficus', emoji:'🌳', water: 8, light:'vive', temp:22 },
  { id: 'succulente', name: 'Succulente', emoji:'🪷', water: 12, light:'plein soleil', temp:23 },
  { id: 'basilic', name: 'Basilic', emoji:'🌱', water: 2, light:'plein soleil', temp:22 },
];

window.BLOOM_MOODS = [
  { id:'pink', c:'#F4B6C2', label:'Rose poudre' },
  { id:'mint', c:'#9EE6C1', label:'Menthe' },
  { id:'butter', c:'#FFD66B', label:'Beurre' },
  { id:'lav', c:'#C9B6E4', label:'Lavande' },
  { id:'coral', c:'#FF8A6B', label:'Corail' },
  { id:'leaf', c:'#9ED1A4', label:'Feuille' },
];

const today = new Date();
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); };
const daysAhead = (n) => { const d = new Date(today); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };

window.BLOOM_SEED = {
  user: { name: 'Léa', joined: daysAgo(120) },
  plants: [
    { id: 'p1', name: 'Monsie', kind:'monstera', mood:'pink', room:'Salon', nextWater: daysAhead(2), lastWater: daysAgo(5), notes:'Adore la lumière du matin ☀️', adoptedAt: daysAgo(80), kindIdx: 0 },
    { id: 'p2', name: 'Pico', kind:'cactus', mood:'butter', room:'Bureau', nextWater: daysAhead(8), lastWater: daysAgo(6), notes:'', adoptedAt: daysAgo(150), kindIdx: 1 },
    { id: 'p3', name: 'Lola', kind:'pothos', mood:'mint', room:'Cuisine', nextWater: daysAhead(0), lastWater: daysAgo(5), notes:'A besoin d\'humidité', adoptedAt: daysAgo(45), kindIdx: 2 },
    { id: 'p4', name: 'Rosie', kind:'anthurium', mood:'lav', room:'Chambre', nextWater: daysAhead(5), lastWater: daysAgo(1), notes:'', adoptedAt: daysAgo(30), kindIdx: 3 },
    { id: 'p5', name: 'Basile', kind:'basilic', mood:'leaf', room:'Cuisine', nextWater: daysAhead(0), lastWater: daysAgo(2), notes:'À tailler souvent', adoptedAt: daysAgo(20), kindIdx: 6 },
    { id: 'p6', name: 'Coco', kind:'succulente', mood:'coral', room:'Salon', nextWater: daysAhead(0), lastWater: daysAgo(12), notes:'', adoptedAt: daysAgo(60), kindIdx: 5 },
  ],
  journal: [
    { id:'j1', date: daysAgo(2), plantId:'p1', kind:'milestone', text:'Première nouvelle feuille perlée 🌱', color:'leaf' },
    { id:'j2', date: daysAgo(8), plantId:'p2', kind:'repot', text:'Rempotage de Pico dans un pot terracotta', color:'butter' },
    { id:'j3', date: daysAgo(15), plantId:'p4', kind:'photo', text:'Photo souvenir de Rosie en pleine floraison', color:'lav' },
    { id:'j4', date: daysAgo(28), plantId:'p3', kind:'milestone', text:'Lola a doublé de taille en un mois !', color:'leaf' },
    { id:'j5', date: daysAgo(45), plantId:'p5', kind:'adoption', text:'Adoption de Basile — bienvenue ✨', color:'hot' },
  ],
  completedTasks: [],
};

window.useBloom = function(){
  const [state, _setState] = React.useState(() => {
    try {
      const stored = localStorage.getItem('bloom-state');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return JSON.parse(JSON.stringify(window.BLOOM_SEED));
  });

  const setState = (updater) => {
    _setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  };

  React.useEffect(() => {
    localStorage.setItem('bloom-state', JSON.stringify(state));
  }, [state]);

  const addPlant = (p) => setState(s => ({ ...s, plants: [...s.plants, { ...p, id: 'p'+Date.now() }] }));
  const updatePlant = (id, patch) => setState(s => ({ ...s, plants: s.plants.map(p => p.id===id ? {...p, ...patch} : p) }));
  const removePlant = (id) => setState(s => ({ ...s, plants: s.plants.filter(p=>p.id!==id) }));
  const addJournal = (e) => setState(s => ({ ...s, journal: [{...e, id:'j'+Date.now()}, ...s.journal] }));
  const completeTask = (plantId) => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    setState(s => ({
      ...s,
      plants: s.plants.map(p => p.id===plantId
        ? {...p, lastWater: new Date().toISOString().slice(0,10), nextWater: d.toISOString().slice(0,10)}
        : p
      ),
      completedTasks: [...s.completedTasks, { plantId, at: Date.now() }]
    }));
  };
  const reset = () => { localStorage.removeItem('bloom-state'); _setState(JSON.parse(JSON.stringify(window.BLOOM_SEED))); };
  const setUser = (patch) => setState(s => ({ ...s, user: { ...s.user, ...patch } }));

  return { state, setState, addPlant, updatePlant, removePlant, addJournal, completeTask, reset, setUser };
};

window.daysUntil = function(iso){
  const t = new Date(); t.setHours(0,0,0,0);
  const d = new Date(iso); d.setHours(0,0,0,0);
  return Math.round((d - t) / (1000*60*60*24));
};

window.formatDate = function(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
};
