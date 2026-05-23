// ===== Care / Today's tasks =====
window.ScreenCare = function({ bloom, nav, anim, showToast, fireConfetti }){
  const { state, completeTask, addJournal } = bloom;
  const today = window.dateKey ? window.dateKey() : new Date().toISOString().slice(0,10);

  // Build today's tasks: any plant with daysUntil(nextWater) <= 0
  const allTasks = state.plants.map(p => {
    const days = window.daysUntil(p.nextWater);
    const isDone = state.completedTasks.some(t =>
      t.plantId === p.id &&
      new Date(t.at).toDateString() === new Date().toDateString()
    );
    return { plant: p, days, done: isDone, dueToday: days <= 0 };
  });

  const todays = allTasks.filter(t => t.dueToday || t.done);
  const upcoming = allTasks.filter(t => !t.dueToday && !t.done && t.days <= 5);

  const total = todays.length;
  const done = todays.filter(t => t.done).length;
  const allDone = total > 0 && done === total;

  React.useEffect(() => {
    if (allDone) fireConfetti();
  }, [allDone]);

  const doTask = (t) => {
    if (t.done) return;
    completeTask(t.plant.id);
    addJournal({ date: today, plantId: t.plant.id, kind:'water', text:`${t.plant.name} arrosée 💧`, color:'mint' });
    showToast(`${t.plant.name} arrosée ✨`);
  };

  return (
    <div className={`screen bg-mint ${anim||''}`}>
      <div className="scr-head">
        <div>
          <span className="h-script" style={{color:'var(--soft)', fontSize:18}}>{new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'})}</span>
          <h1>Mes <span className="em">soins</span></h1>
        </div>
        <div className="btn icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9 H21 M8 3 V7 M16 3 V7"/></svg>
        </div>
      </div>

      <div className="box" style={{marginBottom:14, background:'var(--paper)'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <div className="h-mono">Progression du jour</div>
          <div style={{fontFamily:'DM Serif Display, serif', fontSize:18}}>{done}/{total}</div>
        </div>
        <div className="progress">
          <div style={{width: total ? `${(done/total)*100}%` : '0%'}}/>
        </div>
        {allDone && <p className="h-script" style={{textAlign:'center', marginTop:8, fontSize:20, color:'var(--leaf)'}}>Toutes contentes aujourd'hui ✨</p>}
      </div>

      {todays.length === 0 ? (
        <div className="box" style={{textAlign:'center', padding:30, background:'var(--butter)'}}>
          <Sun w={40}/>
          <h2 className="huge" style={{fontSize:24, marginTop:8}}>Rien à faire</h2>
          <p className="txt">Tes plantes sont au top 🌿</p>
        </div>
      ) : (
        <div className="col" style={{gap:6}}>
          <div className="h-mono" style={{marginLeft:4}}>Aujourd'hui</div>
          {todays.map((t,i) => (
            <div key={t.plant.id+i} className={`task-row ${t.done?'done':''}`} onClick={()=>doTask(t)}
              style={{background: t.done ? 'var(--paper)' : `var(--${t.plant.mood})`}}>
              <div className="check">
                {t.done && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="3" strokeLinecap="round"><path d="M5 13 L10 18 L19 7"/></svg>
                )}
              </div>
              <div style={{width:40, height:40, display:'grid', placeItems:'center'}}>
                <PotPlant kind={t.plant.kindIdx} scale={.32} mood={t.plant.mood}/>
              </div>
              <div className="grow">
                <div className="name" style={{fontFamily:'DM Serif Display, serif', fontSize:15}}>{t.plant.name}</div>
                <div className="sub" style={{fontSize:11, color:'var(--soft)'}}>arrosage</div>
              </div>
              <Drop c="#9EE6C1" w={20}/>
            </div>
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{marginTop:14}}>
          <div className="h-mono" style={{marginLeft:4, marginBottom:6}}>Cette semaine</div>
          <div className="col" style={{gap:6}}>
            {upcoming.map(t => (
              <div key={t.plant.id} className="task-row" onClick={()=>nav('detail', {plantId: t.plant.id})}
                style={{background:'var(--paper)', opacity:.85}}>
                <div style={{width:40, height:40, display:'grid', placeItems:'center'}}>
                  <PotPlant kind={t.plant.kindIdx} scale={.32} mood={t.plant.mood}/>
                </div>
                <div className="grow">
                  <div className="name" style={{fontFamily:'DM Serif Display, serif', fontSize:15}}>{t.plant.name}</div>
                  <div className="sub" style={{fontSize:11, color:'var(--soft)'}}>dans {t.days}j</div>
                </div>
                <div className="pill butter sm">prévu</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
