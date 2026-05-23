// ===== Journal / Timeline =====
window.ScreenJournal = function({ bloom, nav, anim }){
  const { state } = bloom;
  const [filter, setFilter] = React.useState('all');

  let entries = state.journal;
  if (filter !== 'all') entries = entries.filter(e => e.kind === filter);

  const moodToColor = (color) => color === 'hot' ? 'pink' : color === 'leaf' ? 'mint' : color;

  return (
    <div className={`screen bg-coral ${anim||''}`}>
      <div className="scr-head">
        <div>
          <span className="h-script" style={{color:'var(--soft)', fontSize:18}}>mes souvenirs</span>
          <h1><span className="em">Journal</span> de pousse</h1>
        </div>
        <div className="btn icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5 V19 M5 12 H19"/></svg>
        </div>
      </div>

      <div className="chips-row">
        {[
          { id:'all', label:'Tout' },
          { id:'milestone', label:'🌱 Étapes' },
          { id:'adoption', label:'💚 Adoptions' },
          { id:'repot', label:'🪴 Rempotage' },
          { id:'photo', label:'📷 Photos' },
          { id:'water', label:'💧 Soins' },
        ].map(f => (
          <div key={f.id} className={`pill ${filter===f.id?'hot':'outline'}`} onClick={()=>setFilter(f.id)}>
            {f.label}
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="box dashed" style={{textAlign:'center', padding:30}}>
          <p className="txt">Pas encore de souvenirs ici 💭</p>
        </div>
      )}

      <div className="timeline">
        {entries.map((e,i) => {
          const plant = state.plants.find(p => p.id === e.plantId);
          return (
            <div key={e.id} className={`timeline-item ${e.color==='leaf'?'leaf':e.color==='butter'?'butter':e.color==='lav'?'lav':''}`}>
              <div className="box" style={{background: `var(--${moodToColor(e.color)})`, cursor: plant?'pointer':'default'}}
                onClick={()=> plant && nav('detail', {plantId: plant.id})}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10}}>
                  <div style={{flex:1}}>
                    <div className="tiny" style={{fontWeight:700, color:'var(--soft)'}}>{window.formatDate(e.date)}</div>
                    <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:16, marginTop:2, lineHeight:1.2}}>{e.text}</div>
                    {plant && <div className="h-script" style={{fontSize:14, color:'var(--soft)', marginTop:4}}>· {plant.name}</div>}
                  </div>
                  {plant && (
                    <div style={{
                      width:60, height:60, borderRadius:14,
                      border:'2px solid var(--ink)', background:'var(--paper)',
                      display:'grid', placeItems:'center', flexShrink:0,
                      overflow:'hidden'
                    }}>
                      <PotPlant kind={plant.kindIdx} scale={.5} mood={plant.mood}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
