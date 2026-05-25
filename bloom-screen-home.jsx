// ===== Home / Garden screen =====
window.ScreenHome = function({ bloom, nav, anim }){
  const { state } = bloom;
  const [filter, setFilter] = React.useState('all');
  const rooms = ['all', ...new Set(state.plants.map(p=>p.room))];
  const filtered = filter === 'all' ? state.plants : state.plants.filter(p=>p.room===filter);
  const todayCount = state.plants.filter(p => window.daysUntil(p.nextWater) <= 0).length;
  const firstName = (state.user.name && state.user.name.trim()) || '✨';
  const initial = firstName.charAt(0) || '✨';

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bon matin';
    if (h < 18) return "Bel après-midi";
    return 'Belle soirée';
  })();

  const Pill = ({val, label, color}) => (
    <div className={`pill ${filter===val?'hot':'outline'}`} onClick={()=>setFilter(val)}>
      {label}
    </div>
  );

  return (
    <div className={`screen bg-cream ${anim||''}`}>
      <div className="scr-head">
        <div>
          <span className="h-script" style={{color:'var(--soft)', fontSize:18}}>{greeting} ☀️</span>
          <h1>Salut <span className="em">{firstName}</span></h1>
        </div>
        <div className="avatar" onClick={()=>nav('profile')}>{initial}</div>
      </div>

      {todayCount > 0 && (
        <div className="today-strip" onClick={()=>nav('care')}>
          <div className="ic"><Drop w={22}/></div>
          <div className="grow">
            <h3>{todayCount} plante{todayCount>1?'s':''} à arroser</h3>
            <p>Aujourd'hui · prends-soin de tes copines 💧</p>
          </div>
          <div className="pill" style={{background:'var(--paper)'}}>→</div>
        </div>
      )}

      <div className="chips-row">
        <Pill val="all" label={`Toutes · ${state.plants.length}`}/>
        {rooms.filter(r=>r!=='all').map(r => (
          <div key={r} className={`pill ${filter===r?'leaf':'outline'}`} onClick={()=>setFilter(r)}>{r}</div>
        ))}
      </div>

      <div className="plant-grid">
        {filtered.map(p => {
          const days = window.daysUntil(p.nextWater);
          const need = days <= 0 ? 'urgent' : days <= 2 ? 'today' : '';
          const needLabel = days <= 0 ? 'maintenant 💧' : days === 1 ? 'demain' : `dans ${days}j`;
          return (
            <div key={p.id} className="plant-card" style={{background: `var(--${p.mood})`}} onClick={()=>nav('detail', { plantId: p.id })}>
              <div className="top">
                <PotPlant kind={p.kindIdx} scale={.78} mood={p.mood}/>
                <span className="sparkle" style={{top:6, left:6}}>✦</span>
              </div>
              <h3>{p.name}</h3>
              <div className="sub">{window.BLOOM_KINDS.find(k=>k.id===p.kind)?.name}</div>
              <div className={`need ${need}`}>
                <Drop c={need==='urgent'?'#FFF':'#9EE6C1'} w={12}/>
                {needLabel}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fab" onClick={()=>nav('add')}>+</div>
    </div>
  );
};
