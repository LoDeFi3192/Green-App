// ===== Bloom — Auth screen (email/password + Google + guest) =====
window.ScreenAuth = function ScreenAuth({ showToast, onUser }){
  const [mode, setMode] = React.useState('signin'); // signin | signup | reset
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const fbReady = !!(window.firebase && window.firebase.auth);

  const handle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (!fbReady) {
        showToast && showToast('Firebase indisponible — mode invité');
        onUser && onUser(null);
        return;
      }
      if (mode === 'signin'){
        const u = await window.bloomAuth.signIn(email.trim(), password);
        onUser && onUser(u);
      } else if (mode === 'signup'){
        if (password.length < 6) { showToast && showToast('Mot de passe trop court (6+)'); return; }
        const u = await window.bloomAuth.signUp(email.trim(), password, name.trim() || undefined);
        onUser && onUser(u);
      } else if (mode === 'reset'){
        await window.bloomAuth.resetPassword(email.trim());
        showToast && showToast('Email de réinitialisation envoyé ✨');
        setMode('signin');
      }
    } catch (e){
      console.warn(e);
      showToast && showToast(translateAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    if (!fbReady) { onUser && onUser(null); return; }
    setBusy(true);
    try {
      const u = await window.bloomAuth.signInGoogle();
      onUser && onUser(u);
    } catch(e){
      console.warn(e);
      showToast && showToast(translateAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const guest = () => onUser && onUser(null);

  return (
    <div className="screen bg-cream">
      <div style={{paddingTop:16, textAlign:'center'}}>
        <div className="sun-halo" style={{width:96, height:96, margin:'0 auto', borderRadius:'50%',
          background:'conic-gradient(from 200deg, #FF8A6B, #FFD66B, #9EE6C1, #C9B6E4, #FF8A6B)',
          border:'2.5px solid var(--ink)', boxShadow:'4px 4px 0 var(--ink)'}}/>
        <h1 className="huge" style={{fontFamily:'DM Serif Display, serif', fontSize:38, margin:'18px 0 4px', letterSpacing:'-.02em'}}>Bloom</h1>
        <p className="txt" style={{margin:0}}>Tes plantes, ton rituel ✨</p>
      </div>

      <div style={{marginTop:28, display:'flex', flexDirection:'column', gap:12}}>
        {mode === 'signup' && (
          <div className="field">
            <label className="h-mono">Prénom</label>
            <input
              type="text"
              value={name}
              onChange={e=>setName(e.target.value)}
              placeholder="Léa"
              style={inputStyle}
            />
          </div>
        )}

        <div className="field">
          <label className="h-mono">Email</label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="toi@email.fr"
            style={inputStyle}
          />
        </div>

        {mode !== 'reset' && (
          <div className="field">
            <label className="h-mono">Mot de passe</label>
            <input
              type="password"
              autoComplete={mode==='signup'?'new-password':'current-password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>
        )}

        <button className="btn dark full lg" onClick={handle} disabled={busy} style={{marginTop:8}}>
          {busy ? '...' : mode === 'signin' ? 'Connexion' : mode === 'signup' ? 'Créer un compte' : 'Recevoir le lien'}
        </button>

        {mode !== 'reset' && (
          <button className="btn full" onClick={google} disabled={busy}>
            <span style={{fontSize:18}}>G</span> Continuer avec Google
          </button>
        )}

        <button className="btn ghost full" onClick={guest}>
          Continuer sans compte
        </button>

        <div style={{textAlign:'center', marginTop:10, fontSize:13}}>
          {mode === 'signin' && (
            <>
              <span style={{color:'var(--soft)'}}>Pas encore de compte ? </span>
              <a onClick={()=>setMode('signup')} style={linkStyle}>Créer un compte</a>
              <div style={{marginTop:6}}><a onClick={()=>setMode('reset')} style={linkStyle}>Mot de passe oublié</a></div>
            </>
          )}
          {mode === 'signup' && (
            <>
              <span style={{color:'var(--soft)'}}>Déjà un compte ? </span>
              <a onClick={()=>setMode('signin')} style={linkStyle}>Connexion</a>
            </>
          )}
          {mode === 'reset' && (
            <a onClick={()=>setMode('signin')} style={linkStyle}>← Retour</a>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width:'100%',
  border:'2.5px solid var(--ink)',
  borderRadius:14,
  padding:'12px 14px',
  fontFamily:'Space Grotesk, sans-serif',
  fontSize:15,
  background:'var(--paper)',
  color:'var(--ink)',
  boxShadow:'2px 2px 0 var(--ink)',
  outline:'none',
};

const linkStyle = {
  color:'var(--hot)',
  fontWeight:700,
  cursor:'pointer',
  textDecoration:'underline',
};

function translateAuthError(e){
  const code = e && e.code || '';
  const map = {
    'auth/invalid-email': 'Email invalide',
    'auth/user-not-found': 'Compte introuvable',
    'auth/wrong-password': 'Mot de passe incorrect',
    'auth/invalid-credential': 'Identifiants invalides',
    'auth/email-already-in-use': 'Email déjà utilisé',
    'auth/weak-password': 'Mot de passe trop faible',
    'auth/popup-closed-by-user': 'Connexion annulée',
    'auth/network-request-failed': 'Problème de réseau',
  };
  return map[code] || (e && e.message) || 'Une erreur est survenue';
}
