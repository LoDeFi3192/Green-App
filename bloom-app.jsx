// ===== Bloom — main app shell, routing, auth, install handling =====

function App(){
  const [authUser, setAuthUser] = React.useState(undefined); // undefined = loading, null = guest
  const [guestMode, setGuestMode] = React.useState(() => localStorage.getItem('bloom-guest') === '1');
  const [route, setRoute] = React.useState({ name:'home', params:{}, dir:'fwd' });
  const [toast, setToast] = React.useState(null);
  const [confetti, setConfetti] = React.useState(0);
  const toastKey = React.useRef(0);

  // Watch Firebase auth state
  React.useEffect(() => {
    if (!window.firebase || !window.firebase.auth) {
      setAuthUser(null); // firebase not available → guest mode only
      return;
    }
    const unsub = window.bloomAuth.onUser(u => setAuthUser(u || null));
    return () => unsub && unsub();
  }, []);

  // Use cloud-aware bloom when logged in, plain local otherwise
  const bloom = window.useBloomCloud ? window.useBloomCloud(authUser || null) : window.useBloom();

  // PWA install handling
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [installVisible, setInstallVisible] = React.useState(false);
  const [iosHelp, setIosHelp] = React.useState(false);
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const standalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);

  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    if (isIOS && !standalone && !localStorage.getItem('bloom-install-dismissed')){
      setTimeout(()=> setInstallVisible(true), 1500);
    }
    window.addEventListener('appinstalled', () => {
      setInstallVisible(false);
      localStorage.setItem('bloom-install-dismissed','1');
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt){
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted'){
        localStorage.setItem('bloom-install-dismissed','1');
        setInstallVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS){
      setIosHelp(true);
    } else {
      showToast('Utilise le menu de ton navigateur pour installer');
    }
  };

  const navigate = (name, params = {}) => {
    setRoute(prev => {
      const fwdOrder = { home:0, care:1, add:2, journal:3, profile:4, detail:5 };
      const dir = (fwdOrder[name] ?? 0) < (fwdOrder[prev.name] ?? 0) ? 'back' : 'fwd';
      return { name, params, dir };
    });
  };

  const showToast = (msg) => {
    toastKey.current++;
    setToast({ msg, k: toastKey.current });
    setTimeout(() => setToast(t => (t && t.k === toastKey.current) ? null : t), 2500);
  };

  const fireConfetti = () => setConfetti(c => c+1);

  // === Loading state while we check auth ===
  if (authUser === undefined){
    return (
      <Phone>
        <div className="screen bg-cream" style={{display:'grid', placeItems:'center'}}>
          <div style={{textAlign:'center'}}>
            <div className="sun-halo" style={{width:80, height:80, margin:'0 auto'}}/>
            <div className="h-script" style={{marginTop:14, color:'var(--soft)'}}>chargement…</div>
          </div>
        </div>
      </Phone>
    );
  }

  // === Show auth screen if not logged in AND user hasn't picked guest ===
  if (!authUser && !guestMode){
    return (
      <Phone>
        <ScreenAuth showToast={showToast} onUser={(u)=>{
          if (u){ setAuthUser(u); }
          else { localStorage.setItem('bloom-guest','1'); setGuestMode(true); }
        }}/>
        {toast && <Toast msg={toast.msg} k={toast.k}/>}
      </Phone>
    );
  }

  const anim = route.dir === 'back' ? 'slide-in-l' : 'slide-in-r';

  let screen;
  if (route.name === 'home')       screen = <ScreenHome bloom={bloom} nav={navigate} anim={anim} showToast={showToast}/>;
  else if (route.name === 'care')   screen = <ScreenCare bloom={bloom} nav={navigate} anim={anim} showToast={showToast} fireConfetti={fireConfetti}/>;
  else if (route.name === 'add')    screen = <ScreenAdd bloom={bloom} nav={navigate} anim="slide-in-up" showToast={showToast}/>;
  else if (route.name === 'journal')screen = <ScreenJournal bloom={bloom} nav={navigate} anim={anim}/>;
  else if (route.name === 'profile')screen = <ScreenProfile bloom={bloom} nav={navigate} anim={anim} install={{show: installVisible, action: triggerInstall}} authUser={authUser} onSignOut={async ()=>{
    await window.bloomAuth.signOut();
    localStorage.removeItem('bloom-guest');
    setGuestMode(false);
    setAuthUser(null);
  }}/>;
  else if (route.name === 'detail') screen = <ScreenDetail bloom={bloom} nav={navigate} anim={anim} plantId={route.params.plantId} showToast={showToast}/>;
  else                              screen = <ScreenHome bloom={bloom} nav={navigate} anim={anim} showToast={showToast}/>;

  const tabActive = ['home','care','journal','profile'].includes(route.name) ? route.name : null;

  return (
    <Phone>
      <div className="screen-stack">
        {screen}
      </div>

      {installVisible && route.name !== 'profile' && (
        <div className="install-banner">
          <div style={{
            width:32,height:32,borderRadius:10,
            background: 'conic-gradient(from 200deg, #FF8A6B, #FFD66B, #9EE6C1, #C9B6E4, #FF8A6B)',
            border:'2px solid var(--ink)', flexShrink:0
          }}/>
          <div className="grow">
            <b>Installer Bloom</b>
            <div style={{fontSize:11, color:'var(--soft)'}}>Sur ton écran d'accueil ✨</div>
          </div>
          <button onClick={triggerInstall}>Installer</button>
          <button className="x" onClick={()=>{
            setInstallVisible(false);
            localStorage.setItem('bloom-install-dismissed','1');
          }}>×</button>
        </div>
      )}

      {iosHelp && (
        <>
          <div className="sheet-bg" onClick={()=>setIosHelp(false)}/>
          <div className="sheet">
            <div className="handle"/>
            <h2 className="huge" style={{fontSize:22}}>Ajouter à l'écran</h2>
            <p className="txt">Sur iPhone, ouvre Safari puis :</p>
            <ol style={{paddingLeft:0, listStyle:'none', counterReset:'s', marginTop:10}}>
              {[
                <>Appuie sur l'icône <b>Partager</b></>,
                <>Choisis « <b>Sur l'écran d'accueil</b> »</>,
                <>Appuie sur <b>Ajouter</b> en haut à droite</>,
              ].map((step,i)=>(
                <li key={i} style={{counterIncrement:'s', position:'relative', padding:'12px 12px 12px 48px', border:'2px solid var(--ink)', borderRadius:14, background:'var(--cream)', marginBottom:8, boxShadow:'2px 2px 0 var(--ink)'}}>
                  <div style={{
                    position:'absolute', left:8, top:'50%', transform:'translateY(-50%)',
                    width:30, height:30, borderRadius:'50%',
                    background:'var(--hot)', color:'var(--paper)', border:'2px solid var(--ink)',
                    display:'grid', placeItems:'center',
                    fontWeight:700, fontFamily:'DM Serif Display, serif'
                  }}>{i+1}</div>
                  {step}
                </li>
              ))}
            </ol>
            <div className="btn dark full" style={{marginTop:6}} onClick={()=>setIosHelp(false)}>Compris ✨</div>
          </div>
        </>
      )}

      {toast && <Toast msg={toast.msg} k={toast.k}/>}
      <Confetti trigger={confetti}/>

      {/* Cloud sync indicator */}
      {authUser && bloom.synced && (
        <div style={{
          position:'absolute', top:14, left:14, zIndex:5,
          fontSize:10, color:'var(--leaf)', display:'flex', alignItems:'center', gap:4,
          fontWeight:700, fontFamily:'Space Grotesk, sans-serif',
          background:'var(--paper)', border:'1.5px solid var(--ink)',
          borderRadius:999, padding:'3px 8px', boxShadow:'1px 1px 0 var(--ink)'
        }}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--leaf)'}}/>
          synced
        </div>
      )}

      {tabActive && (
        <TabBar
          active={tabActive}
          onChange={(k)=>navigate(k)}
          onAdd={()=>navigate('add')}
        />
      )}
    </Phone>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
