// ===== Plant detail screen =====
window.ScreenDetail = function({ bloom, nav, anim, plantId, showToast }){
  const { state, updatePlant, removePlant, completeTask, addJournal } = bloom;
  const plant = state.plants.find(p => p.id === plantId);
  const [editing, setEditing] = React.useState(false);
  const [tab, setTab] = React.useState('care');
  const [confirmDel, setConfirmDel] = React.useState(false);

  if (!plant) {
    return (
      <div className={`screen bg-cream ${anim||''}`}>
        <div className="scr-head">
          <div className="btn icon" onClick={()=>nav('home')}>←</div>
        </div>
        <p className="txt">Plante introuvable.</p>
      </div>
    );
  }

  const kind = window.BLOOM_KINDS.find(k => k.id === plant.kind);
  const days = window.daysUntil(plant.nextWater);
  const needLabel = days <= 0 ? "Maintenant" : days === 1 ? "Demain" : `Dans ${days}j`;
  const journal = state.journal.filter(j => j.plantId === plant.id);

  const water = () => {
    completeTask(plant.id);
    addJournal({ date: new Date().toISOString().slice(0,10), plantId: plant.id, kind:'water', text:`${plant.name} arrosée 💧`, color:'mint' });
    showToast(`${plant.name} arrosée ✨`);
  };

  return (
    <div className={`screen bg-${plant.mood==='leaf'?'mint':plant.mood} ${anim||''}`}>
      <div className="scr-head">
        <div className="btn icon" onClick={()=>nav('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="2.5" strokeLinecap="round"><path d="M15 6 L9 12 L15 18"/></svg>
        </div>
        <div style={{display:'flex', gap:8}}>
          <div className="btn icon" onClick={()=>setEditing(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round"><path d="M14 4 L20 10 L8 22 H2 V16 Z"/></svg>
          </div>
          <div className="btn icon" onClick={()=>setConfirmDel(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 21 H17 L18 7"/></svg>
          </div>
        </div>
      </div>

      <div className="detail-hero">
        <div className="halo"/>
        <div style={{position:'relative', zIndex:2}}>
          <PotPlant kind={plant.kindIdx} scale={1.5} mood={plant.mood}/>
        </div>
        <span className="sparkle" style={{top:30, left:50, fontSize:24}}>✦</span>
        <span className="sparkle" style={{bottom:30, right:40, fontSize:28, color:'var(--leaf)'}}>✿</span>
        <span className="sparkle" style={{top:60, right:60}}>✦</span>
      </div>

      <div style={{textAlign:'center'}}>
        <span className="h-script" style={{color:'var(--soft)', fontSize:18}}>{kind?.name} · {plant.room}</span>
        <h1 className="huge" style={{marginTop:2, fontSize:36}}>{plant.name}</h1>
      </div>

      <div className="stats-row">
        <div className="stat-card" style={{background:'var(--mint)'}}>
          <Drop w={20}/>
          <div className="v">{needLabel}</div>
          <div className="l">arrosage</div>
        </div>
        <div className="stat-card" style={{background:'var(--butter)'}}>
          <Sun w={20}/>
          <div className="v">{kind?.light}</div>
          <div className="l">lumière</div>
        </div>
        <div className="stat-card" style={{background:'var(--lav)'}}>
          <Leaf w={20}/>
          <div className="v">{kind?.temp}°</div>
          <div className="l">température</div>
        </div>
      </div>

      <div style={{display:'flex', gap:6, marginBottom:10}}>
        <div className={`pill ${tab==='care'?'leaf':'outline'}`} onClick={()=>setTab('care')}>Soins</div>
        <div className={`pill ${tab==='journal'?'leaf':'outline'}`} onClick={()=>setTab('journal')}>Journal · {journal.length}</div>
        <div className={`pill ${tab==='notes'?'leaf':'outline'}`} onClick={()=>setTab('notes')}>Notes</div>
      </div>

      {tab === 'care' && (
        <div className="col" style={{gap:10}}>
          <div className="box">
            <div className="h-mono">Prochain soin</div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6}}>
              <div>
                <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:16}}>Arrosage</div>
                <div className="tiny" style={{color:'var(--soft)', fontSize:11, marginTop:2}}>tous les {kind?.water} jours</div>
              </div>
              <div className="btn coral" onClick={water}>
                <Drop c="#FFF" w={14}/> Arroser
              </div>
            </div>
          </div>

          <div className="box" style={{background:'var(--mint)'}}>
            <div className="h-mono">Conseils {kind?.name}</div>
            <p className="txt" style={{margin:'4px 0 0', color:'var(--ink)'}}>
              {kind?.id==='monstera' && 'Aime la lumière indirecte vive. Vaporise les feuilles régulièrement, et essuie-les avec un linge humide pour qu\'elles respirent.'}
              {kind?.id==='cactus' && 'Très peu d\'eau ! Préfère un sol bien drainé. En hiver, espace encore plus les arrosages.'}
              {kind?.id==='pothos' && 'Très facile à vivre. Tolère l\'oubli mais adore l\'humidité ambiante.'}
              {kind?.id==='anthurium' && 'Aime la chaleur et l\'humidité. Arrose quand le substrat est sec en surface.'}
              {kind?.id==='ficus' && 'Évite de la déplacer trop souvent — elle aime ses habitudes !'}
              {kind?.id==='succulente' && 'Soleil direct + arrosage très espacé. Drainage essentiel.'}
              {kind?.id==='basilic' && 'Beaucoup de soleil + arrosage régulier. Pince les fleurs pour favoriser les feuilles.'}
            </p>
          </div>

          <div className="box" style={{background:'var(--butter)'}}>
            <div className="h-mono">Adoption</div>
            <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:16, marginTop:2}}>
              {window.formatDate(plant.adoptedAt)} · il y a {Math.abs(window.daysUntil(plant.adoptedAt))} jours
            </div>
          </div>
        </div>
      )}

      {tab === 'journal' && (
        <div className="col" style={{gap:8}}>
          {journal.length === 0 && <p className="txt">Pas encore de souvenirs pour {plant.name}.</p>}
          {journal.map(j => (
            <div key={j.id} className="box" style={{background:`var(--${j.color==='hot'?'pink':j.color==='leaf'?'mint':j.color})`}}>
              <div className="tiny" style={{fontWeight:700, color:'var(--soft)'}}>{window.formatDate(j.date)}</div>
              <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:15, marginTop:2}}>{j.text}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'notes' && (
        <div className="box">
          <div className="h-mono">Notes personnelles</div>
          <textarea
            defaultValue={plant.notes}
            placeholder="Écris ce que tu observes…"
            onBlur={e => updatePlant(plant.id, { notes: e.target.value })}
            style={{
              width:'100%', minHeight:120, marginTop:8,
              border:'2px solid var(--ink)', borderRadius:12, padding:10,
              fontFamily:"'Patrick Hand', cursive", fontSize:15,
              background:'var(--paper)', resize:'none', outline:'none', color:'var(--ink)'
            }}
          />
        </div>
      )}

      {editing && (
        <>
          <div className="sheet-bg" onClick={()=>setEditing(false)}/>
          <div className="sheet">
            <div className="handle"/>
            <h2 className="huge" style={{fontSize:24, marginBottom:14}}>Modifier {plant.name}</h2>
            <div className="field">
              <label>Nom</label>
              <input defaultValue={plant.name} onBlur={e=>updatePlant(plant.id, {name: e.target.value})}/>
            </div>
            <div className="field">
              <label>Pièce</label>
              <select defaultValue={plant.room} onChange={e=>updatePlant(plant.id, {room: e.target.value})}>
                {['Salon','Cuisine','Chambre','Bureau','Balcon','Salle de bain'].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Couleur de pot</label>
              <div className="mood-row">
                {window.BLOOM_MOODS.map(m => (
                  <div key={m.id} className={`m ${plant.mood===m.id?'sel':''}`}
                    style={{background:m.c}}
                    onClick={()=>updatePlant(plant.id, {mood: m.id})}/>
                ))}
              </div>
            </div>
            <div className="btn dark full lg" onClick={()=>setEditing(false)}>Terminé ✨</div>
          </div>
        </>
      )}

      {confirmDel && (
        <>
          <div className="sheet-bg" onClick={()=>setConfirmDel(false)}/>
          <div className="sheet">
            <div className="handle"/>
            <h2 className="huge" style={{fontSize:22, marginBottom:8}}>Supprimer {plant.name} ?</h2>
            <p className="txt">Cette action est définitive. Son journal sera perdu.</p>
            <div style={{display:'flex', gap:10, marginTop:14}}>
              <div className="btn ghost" style={{flex:1}} onClick={()=>setConfirmDel(false)}>Annuler</div>
              <div className="btn coral" style={{flex:1}} onClick={()=>{
                removePlant(plant.id);
                showToast('Plante supprimée');
                nav('home');
              }}>Supprimer</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
