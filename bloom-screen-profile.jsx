// ===== Profile / Settings =====
window.ScreenProfile = function({ bloom, nav, anim, install, authUser, onSignOut }){
  const { state, reset, setUser } = bloom;
  const [push, setPush] = React.useState(true);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [confirmSignOut, setConfirmSignOut] = React.useState(false);
  const [editName, setEditName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState('');

  const userName = authUser?.displayName || state.user.name;
  const userInitial = (userName && userName.charAt(0)) || '✨';
  const userEmail = authUser?.email || null;
  const adoptedDays = window.daysUntil(state.user.joined) * -1;

  const openEditName = () => {
    setNameDraft(userName || '');
    setEditName(true);
  };
  const saveName = async () => {
    const n = nameDraft.trim();
    if (!n) return;
    try {
      if (authUser && authUser.updateProfile){
        await authUser.updateProfile({ displayName: n });
      }
    } catch(e){ console.warn('updateProfile failed', e); }
    setUser({ name: n });
    setEditName(false);
  };

  return (
    <div className={`screen bg-lilac ${anim||''}`}>
      <div className="scr-head">
        <div>
          <span className="h-script" style={{color:'var(--soft)', fontSize:18}}>mon profil</span>
          <h1><span className="em">{userName}</span></h1>
        </div>
      </div>

      <div className="box" style={{background:'var(--butter)', display:'flex', alignItems:'center', gap:14, marginBottom:14, cursor:'pointer'}} onClick={openEditName}>
        <div style={{
          width:64, height:64, borderRadius:'50%',
          background:'var(--pink)', border:'2.5px solid var(--ink)',
          boxShadow:'3px 3px 0 0 var(--ink)',
          display:'grid', placeItems:'center',
          fontFamily:'DM Serif Display, serif', fontSize:28
        }}>{userInitial}</div>
        <div style={{flex:1}}>
          <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:20}}>{userName}</div>
          {userEmail
            ? <div className="tiny" style={{color:'var(--soft)'}}>{userEmail} · ☁️ synchronisé</div>
            : <div className="tiny" style={{color:'var(--soft)'}}>Jardinière depuis {adoptedDays} jours · 📱 local uniquement</div>
          }
        </div>
        <div className="pill outline" style={{flexShrink:0}}>✎</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14}}>
        <div className="box" style={{background:'var(--mint)', textAlign:'center'}}>
          <div style={{fontFamily:'DM Serif Display, serif', fontSize:30, lineHeight:1}}>{state.plants.length}</div>
          <div className="tiny" style={{color:'var(--soft)', marginTop:4}}>plantes adoptées</div>
        </div>
        <div className="box" style={{background:'var(--pink)', textAlign:'center'}}>
          <div style={{fontFamily:'DM Serif Display, serif', fontSize:30, lineHeight:1}}>{state.completedTasks.length}</div>
          <div className="tiny" style={{color:'var(--soft)', marginTop:4}}>soins prodigués</div>
        </div>
      </div>

      <div className="h-mono" style={{marginLeft:4, marginBottom:6}}>Préférences</div>

      <div className="toggle-row" onClick={()=>setPush(!push)}>
        <div>
          <div className="label">Rappels d'arrosage</div>
          <div className="desc">Notifications à 10h tous les jours</div>
        </div>
        <div className={`toggle ${push?'on':''}`}/>
      </div>

      <div className="toggle-row" onClick={()=>setReduceMotion(!reduceMotion)}>
        <div>
          <div className="label">Réduire les animations</div>
          <div className="desc">Désactive les sparkles & motions</div>
        </div>
        <div className={`toggle ${reduceMotion?'on':''}`}/>
      </div>

      <div className="h-mono" style={{marginLeft:4, marginBottom:6, marginTop:14}}>Application</div>

      {install.show && (
        <div className="box" style={{background:'var(--coral)', color:'var(--paper)', marginBottom:10, cursor:'pointer'}}
          onClick={install.action}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{
              width:40,height:40,borderRadius:12,
              background:'var(--paper)',border:'2px solid var(--ink)',
              display:'grid',placeItems:'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 V15 M8 11 L12 15 L16 11"/><path d="M5 19 H19"/></svg>
            </div>
            <div style={{flex:1}}>
              <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:16, color:'var(--paper)'}}>Installer Bloom</div>
              <div style={{fontSize:11, opacity:.85}}>Sur ton écran d'accueil ✨</div>
            </div>
            <div className="pill" style={{background:'var(--paper)', color:'var(--ink)'}}>→</div>
          </div>
        </div>
      )}

      <div className="box" style={{background:'var(--paper)', cursor:'pointer'}} onClick={()=>setConfirmReset(true)}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:15}}>Réinitialiser la démo</div>
            <div className="tiny" style={{color:'var(--soft)'}}>Restaure les plantes d'origine</div>
          </div>
          <div className="pill outline">↺</div>
        </div>
      </div>

      {(authUser || !authUser) && (
        <div className="box" style={{background:'var(--paper)', cursor:'pointer', marginTop:10}} onClick={()=>setConfirmSignOut(true)}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:15}}>
                {authUser ? 'Se déconnecter' : 'Créer un compte / Se connecter'}
              </div>
              <div className="tiny" style={{color:'var(--soft)'}}>
                {authUser ? 'Tes données restent dans le cloud' : 'Synchronise tes plantes entre appareils'}
              </div>
            </div>
            <div className="pill outline">→</div>
          </div>
        </div>
      )}

      <div className="box" style={{background:'var(--paper)', marginTop:10}}>
        <div className="h-mono">À propos</div>
        <div className="t-serif" style={{fontFamily:'DM Serif Display, serif', fontSize:15, marginTop:2}}>Bloom <span className="em">&amp; care</span></div>
        <div className="tiny" style={{color:'var(--soft)', marginTop:4}}>Prototype interactif · v1.0</div>
      </div>

      {confirmReset && (
        <>
          <div className="sheet-bg" onClick={()=>setConfirmReset(false)}/>
          <div className="sheet">
            <div className="handle"/>
            <h2 className="huge" style={{fontSize:22, marginBottom:8}}>Réinitialiser ?</h2>
            <p className="txt">Toutes tes plantes et souvenirs personnels seront remplacés par les exemples d'origine.</p>
            <div style={{display:'flex', gap:10, marginTop:14}}>
              <div className="btn ghost" style={{flex:1}} onClick={()=>setConfirmReset(false)}>Annuler</div>
              <div className="btn coral" style={{flex:1}} onClick={()=>{
                reset();
                setConfirmReset(false);
              }}>Réinitialiser</div>
            </div>
          </div>
        </>
      )}

      {confirmSignOut && (
        <>
          <div className="sheet-bg" onClick={()=>setConfirmSignOut(false)}/>
          <div className="sheet">
            <div className="handle"/>
            <h2 className="huge" style={{fontSize:22, marginBottom:8}}>
              {authUser ? 'Se déconnecter ?' : 'Connexion'}
            </h2>
            <p className="txt">
              {authUser
                ? 'Tes données restent en sécurité dans le cloud. Tu pourras les retrouver à la prochaine connexion.'
                : 'Tu vas être redirigé·e vers l\'écran de connexion. Tes plantes actuelles seront conservées localement.'}
            </p>
            <div style={{display:'flex', gap:10, marginTop:14}}>
              <div className="btn ghost" style={{flex:1}} onClick={()=>setConfirmSignOut(false)}>Annuler</div>
              <div className="btn coral" style={{flex:1}} onClick={onSignOut}>
                {authUser ? 'Déconnexion' : 'Se connecter'}
              </div>
            </div>
          </div>
        </>
      )}
      {editName && (
        <>
          <div className="sheet-bg" onClick={()=>setEditName(false)}/>
          <div className="sheet">
            <div className="handle"/>
            <h2 className="huge" style={{fontSize:22, marginBottom:8}}>Modifier ton prénom</h2>
            <p className="txt" style={{marginBottom:14}}>Comment souhaites-tu être appelée ?</p>
            <input
              type="text"
              value={nameDraft}
              onChange={e=>setNameDraft(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') saveName(); }}
              placeholder="Ton prénom"
              autoFocus
              style={{
                width:'100%',
                border:'2.5px solid var(--ink)',
                borderRadius:14,
                padding:'12px 14px',
                fontFamily:'Space Grotesk, sans-serif',
                fontSize:16,
                background:'var(--paper)',
                color:'var(--ink)',
                boxShadow:'2px 2px 0 var(--ink)',
                outline:'none',
              }}
            />
            <div style={{display:'flex', gap:10, marginTop:14}}>
              <div className="btn ghost" style={{flex:1}} onClick={()=>setEditName(false)}>Annuler</div>
              <div className="btn dark" style={{flex:1}} onClick={saveName}>Sauvegarder</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
