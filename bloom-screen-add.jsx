// ===== Add plant flow (3 steps) =====
window.ScreenAdd = function({ bloom, nav, anim, showToast }){
  const [step, setStep] = React.useState(0);
  const [pick, setPick] = React.useState(null); // kind id
  const [name, setName] = React.useState('');
  const [room, setRoom] = React.useState('Salon');
  const [mood, setMood] = React.useState('pink');
  const [identifying, setIdentifying] = React.useState(false);

  const kind = pick ? window.BLOOM_KINDS.find(k => k.id === pick) : null;

  // simulate AI detection
  React.useEffect(() => {
    if (step === 0 && identifying){
      const t = setTimeout(() => {
        setIdentifying(false);
        const random = window.BLOOM_KINDS[Math.floor(Math.random()*window.BLOOM_KINDS.length)];
        setPick(random.id);
        showToast(`Identifié : ${random.name} ✨`);
        setStep(1);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [identifying, step]);

  const finish = () => {
    if (!name.trim()) { showToast("Donne-lui un petit nom 💌"); return; }
    const k = window.BLOOM_KINDS.find(kk => kk.id === pick);
    const kIdx = window.BLOOM_KINDS.indexOf(k);
    const today = new Date();
    const next = new Date(); next.setDate(today.getDate() + k.water);
    bloom.addPlant({
      name: name.trim(),
      kind: pick,
      kindIdx: kIdx,
      mood,
      room,
      nextWater: next.toISOString().slice(0,10),
      lastWater: today.toISOString().slice(0,10),
      notes:'',
      adoptedAt: today.toISOString().slice(0,10),
    });
    bloom.addJournal({
      date: today.toISOString().slice(0,10),
      plantId:'tmp', kind:'adoption',
      text: `Adoption de ${name.trim()} 💚`, color:'leaf'
    });
    showToast(`Bienvenue ${name.trim()} 🌿`);
    setTimeout(() => nav('home'), 400);
  };

  return (
    <div className={`screen bg-lilac ${anim||''}`}>
      <div className="scr-head">
        <div className="btn icon" onClick={() => step === 0 ? nav('home') : setStep(step-1)}>
          {step === 0 ? '×' : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="2.5" strokeLinecap="round"><path d="M15 6 L9 12 L15 18"/></svg>
          )}
        </div>
        <span className="h-script" style={{color:'var(--soft)', fontSize:18}}>étape {step+1}/3</span>
        <div style={{width:44}}/>
      </div>

      {step === 0 && (
        <>
          <h1 className="huge" style={{textAlign:'center', marginTop:8}}>
            Adopte une <span className="em">copine</span> 🪴
          </h1>
          <p className="txt" style={{textAlign:'center', marginTop:6}}>
            Prends une photo ou choisis dans la liste.
          </p>

          <div className="viewfinder" style={{marginTop:14}}>
            <div className="corner tl"/><div className="corner tr"/><div className="corner bl"/><div className="corner br"/>
            <div className="scanline"/>
            {identifying ? (
              <div style={{textAlign:'center'}}>
                <PotPlant kind={Math.floor(Math.random()*7)} scale={1.2} mood="pink"/>
                <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:18, marginTop:8}}>Analyse…</div>
                <div className="tiny" style={{color:'var(--soft)', marginTop:2}}>identification IA en cours ✨</div>
              </div>
            ) : (
              <div style={{textAlign:'center'}}>
                <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:18}}>Centre ta plante</div>
                <div className="tiny" style={{color:'var(--soft)', marginTop:2}}>dans le cadre 📷</div>
              </div>
            )}
          </div>

          <div style={{display:'flex', gap:10, marginTop:14}}>
            <div className="btn coral lg" style={{flex:1}} onClick={()=>setIdentifying(true)}>
              📷 Identifier
            </div>
            <div className="btn lg" style={{flex:1}} onClick={()=>setStep(1)}>
              ✍️ Choisir
            </div>
          </div>

          <div className="steps">
            <div className="s on"/><div className="s"/><div className="s"/>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h1 className="huge" style={{textAlign:'center', marginTop:8}}>
            <span className="em">Quelle</span> plante ?
          </h1>
          <p className="txt" style={{textAlign:'center', marginTop:6}}>
            Choisis l'espèce pour des soins adaptés.
          </p>

          <div className="kind-row" style={{marginTop:14}}>
            {window.BLOOM_KINDS.map((k, i) => (
              <div key={k.id} className={`kind-card ${pick===k.id?'sel':''}`} onClick={()=>setPick(k.id)}>
                <div style={{flex:1, display:'grid', placeItems:'center'}}>
                  <PotPlant kind={i} scale={.6} mood="pink"/>
                </div>
                <div className="name">{k.name}</div>
              </div>
            ))}
          </div>

          {kind && (
            <div className="box" style={{marginTop:14, background:'var(--paper)'}}>
              <div className="h-mono">{kind.name}</div>
              <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:16, marginTop:2}}>{kind.emoji} arrosage tous les {kind.water} jours</div>
              <div className="txt" style={{marginTop:4}}>Lumière {kind.light} · {kind.temp}°</div>
            </div>
          )}

          <div className="btn dark lg full" style={{marginTop:14}}
            onClick={()=> pick ? setStep(2) : showToast('Choisis une plante 🌱')}>
            Continuer →
          </div>

          <div className="steps">
            <div className="s"/><div className="s on"/><div className="s"/>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="huge" style={{textAlign:'center', marginTop:8}}>
            Donne-lui un <span className="em">nom</span> 💌
          </h1>

          <div style={{marginTop:14}}>
            <div className="field">
              <label>Petit nom</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="ex. Monsie, Lulu, Mimi…" autoFocus/>
            </div>
            <div className="field">
              <label>Dans quelle pièce ?</label>
              <select value={room} onChange={e=>setRoom(e.target.value)}>
                {['Salon','Cuisine','Chambre','Bureau','Balcon','Salle de bain'].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Sa couleur de pot</label>
              <div className="mood-row">
                {window.BLOOM_MOODS.map(m => (
                  <div key={m.id} className={`m ${mood===m.id?'sel':''}`}
                    style={{background:m.c}}
                    onClick={()=>setMood(m.id)}/>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:'grid', placeItems:'center', marginTop:14}}>
            <div className="box" style={{background:`var(--${mood})`, padding:14}}>
              {kind && <PotPlant kind={window.BLOOM_KINDS.indexOf(kind)} scale={.9} mood={mood}/>}
              <div style={{textAlign:'center'}}>
                <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:18}}>{name || 'Ma plante'}</div>
                <div className="tiny" style={{color:'var(--soft)'}}>{kind?.name}</div>
              </div>
            </div>
          </div>

          <div className="btn hot lg full" style={{marginTop:14}} onClick={finish}>
            Adopter 💚
          </div>

          <div className="steps">
            <div className="s"/><div className="s"/><div className="s on"/>
          </div>
        </>
      )}
    </div>
  );
};
