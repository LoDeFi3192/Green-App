// ============= Firebase integration =============
// Loaded via firebase compat SDK (window.firebase available globally)

window.BLOOM_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAbbYqho_R3etBzTVEEoB042rZIT3iGTws",
  authDomain: "green-2ef92.firebaseapp.com",
  projectId: "green-2ef92",
  storageBucket: "green-2ef92.firebasestorage.app",
  messagingSenderId: "18209799877",
  appId: "1:18209799877:web:7a8e5437c6a6342ca03aac",
};

// Initialize once
(function initFirebase(){
  if (!window.firebase || window.__bloomFbInit) return;
  try {
    window.firebase.initializeApp(window.BLOOM_FIREBASE_CONFIG);
    window.__bloomFbInit = true;
    // Enable offline persistence
    try {
      window.firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch(()=>{});
    } catch(e){}
  } catch(e){
    console.warn('Firebase init failed', e);
  }
})();

// Auth helpers
window.bloomAuth = {
  signUp: async (email, password, name) => {
    const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if (name && cred.user) await cred.user.updateProfile({ displayName: name });
    return cred.user;
  },
  signIn: async (email, password) => {
    const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
    return cred.user;
  },
  signInGoogle: async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const cred = await firebase.auth().signInWithPopup(provider);
    return cred.user;
  },
  signOut: () => firebase.auth().signOut(),
  resetPassword: (email) => firebase.auth().sendPasswordResetEmail(email),
  onUser: (cb) => firebase.auth().onAuthStateChanged(cb),
};

// Firestore sync — one doc per user containing the whole bloom state
window.bloomCloud = {
  loadState: async (uid) => {
    const doc = await firebase.firestore().collection('bloom').doc(uid).get();
    if (doc.exists) return doc.data();
    return null;
  },
  saveState: async (uid, state) => {
    await firebase.firestore().collection('bloom').doc(uid).set(state, { merge: false });
  },
  // realtime listener
  subscribe: (uid, cb) => {
    return firebase.firestore().collection('bloom').doc(uid)
      .onSnapshot(snap => { if (snap.exists) cb(snap.data()); });
  },
};

// React hook that wraps useBloom + cloud sync when logged in
window.useBloomCloud = function(user){
  // base local hook
  const local = window.useBloom();
  const [synced, setSynced] = React.useState(false);
  const lastWrittenRef = React.useRef(null);
  const writeTimerRef = React.useRef(null);

  // First load from cloud when user appears
  React.useEffect(() => {
    if (!user) { setSynced(false); return; }
    let unsub = null;
    (async () => {
      try {
        const cloudState = await window.bloomCloud.loadState(user.uid);
        if (cloudState) {
          // Hydrate local with cloud — careful about shape
          if (cloudState.plants && cloudState.journal) {
            local.setState && local.setState(cloudState);
          }
        } else {
          // First time: push current local state to cloud
          await window.bloomCloud.saveState(user.uid, local.state);
        }
        setSynced(true);

        // Realtime sync from server → local
        unsub = window.bloomCloud.subscribe(user.uid, (data) => {
          const s = JSON.stringify(data);
          if (s !== lastWrittenRef.current && data.plants && data.journal) {
            local.setState && local.setState(data);
          }
        });
      } catch(e){ console.warn('cloud load failed', e); setSynced(true); }
    })();
    return () => { unsub && unsub(); };
  }, [user?.uid]);

  // Debounced write to cloud on state change
  React.useEffect(() => {
    if (!user || !synced) return;
    if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    writeTimerRef.current = setTimeout(async () => {
      try {
        const payload = JSON.parse(JSON.stringify(local.state));
        lastWrittenRef.current = JSON.stringify(payload);
        await window.bloomCloud.saveState(user.uid, payload);
      } catch(e){ console.warn('cloud save failed', e); }
    }, 800);
    return () => writeTimerRef.current && clearTimeout(writeTimerRef.current);
  }, [user, synced, local.state]);

  return { ...local, synced };
};
