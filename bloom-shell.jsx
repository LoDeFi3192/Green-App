// ===== Bloom — shell components: fullscreen wrapper, TabBar, Toast, Confetti, icons =====

// ---------- Phone (fullscreen wrapper — no chrome) ----------
window.Phone = function Phone({ children }){
  return <div className="app-shell">{children}</div>;
};

// ---------- TabBar ----------
window.TabBar = function TabBar({ active, onChange, onAdd }){
  const tabs = [
    { k:'home',    icon: <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/> },
    { k:'care',    icon: <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/> },
    { k:'journal', icon: <><path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 9h8M8 13h6"/></> },
    { k:'profile', icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></> },
  ];
  return (
    <div className="tabbar">
      {tabs.slice(0,2).map(t => (
        <div key={t.k} className={`t ${active===t.k?'active':''}`} onClick={()=>onChange(t.k)}>
          <svg viewBox="0 0 24 24">{t.icon}</svg>
        </div>
      ))}
      <div className="t add" onClick={onAdd}>
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
      </div>
      {tabs.slice(2).map(t => (
        <div key={t.k} className={`t ${active===t.k?'active':''}`} onClick={()=>onChange(t.k)}>
          <svg viewBox="0 0 24 24">{t.icon}</svg>
        </div>
      ))}
    </div>
  );
};

// ---------- Toast ----------
window.Toast = function Toast({ msg }){
  return <div className="toast">{msg}</div>;
};

// ---------- Confetti ----------
window.Confetti = function Confetti({ trigger }){
  const [parts, setParts] = React.useState([]);
  React.useEffect(() => {
    if (!trigger) return;
    const colors = ['#FF8A6B','#FFD66B','#9EE6C1','#C9B6E4','#F4B6C2','#E85A8E'];
    const next = Array.from({length: 18}, (_, i) => ({
      id: trigger + '_' + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 0.9 + Math.random() * 0.6,
      color: colors[i % colors.length],
      rot: Math.random() * 360,
    }));
    setParts(next);
    const t = setTimeout(() => setParts([]), 1800);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!parts.length) return null;
  return (
    <div className="confetti">
      {parts.map(p => (
        <span key={p.id} style={{
          left: p.left + '%',
          background: p.color,
          animationDelay: p.delay + 's',
          animationDuration: p.duration + 's',
          transform: `rotate(${p.rot}deg)`,
        }}/>
      ))}
    </div>
  );
};

// ---------- Icons ----------
window.Drop = function Drop({ w = 20 }){
  return (
    <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12z"/>
    </svg>
  );
};

window.Leaf = function Leaf({ w = 20 }){
  return (
    <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20c10 0 16-6 16-16-10 0-16 6-16 16z"/>
      <path d="M4 20l8-8"/>
    </svg>
  );
};

window.Sun = function Sun({ w = 20 }){
  return (
    <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
    </svg>
  );
};

// ---------- PotPlant illustration ----------
window.PotPlant = function PotPlant({ kind = 0, scale = 1, mood = 'leaf' }){
  const size = 90 * scale;
  const variants = [
    <g key="m">
      <path d="M50 60 C 30 50, 25 30, 40 18 C 55 22, 60 40, 55 56 Z" fill="#3F8C6A"/>
      <path d="M50 60 C 70 52, 78 30, 65 16 C 50 22, 46 40, 50 58 Z" fill="#4FA67C"/>
      <circle cx="42" cy="30" r="3" fill="#FBF3E4"/>
      <circle cx="60" cy="28" r="3" fill="#FBF3E4"/>
    </g>,
    <g key="c">
      <rect x="42" y="20" width="16" height="50" rx="8" fill="#4FA67C"/>
      <rect x="28" y="40" width="12" height="22" rx="6" fill="#4FA67C"/>
      <rect x="60" y="34" width="12" height="28" rx="6" fill="#4FA67C"/>
      <circle cx="50" cy="28" r="2" fill="#FFB347"/>
    </g>,
    <g key="p">
      <path d="M50 60 C 38 56, 30 42, 36 28" stroke="#3F8C6A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M50 60 C 62 54, 68 38, 60 22" stroke="#3F8C6A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <ellipse cx="34" cy="30" rx="6" ry="4" fill="#4FA67C" transform="rotate(-30 34 30)"/>
      <ellipse cx="62" cy="26" rx="6" ry="4" fill="#4FA67C" transform="rotate(30 62 26)"/>
      <ellipse cx="50" cy="20" rx="6" ry="4" fill="#4FA67C"/>
    </g>,
    <g key="a">
      <path d="M50 60 C 30 56, 28 30, 50 24 C 72 30, 70 56, 50 60 Z" fill="#3F8C6A"/>
      <path d="M50 58 L 56 30" stroke="#FFD66B" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="58" cy="26" rx="6" ry="4" fill="#FF8A6B"/>
    </g>,
    <g key="f">
      <circle cx="50" cy="35" r="22" fill="#3F8C6A"/>
      <circle cx="42" cy="28" r="3" fill="#4FA67C"/>
      <circle cx="58" cy="30" r="3" fill="#4FA67C"/>
      <circle cx="50" cy="22" r="3" fill="#4FA67C"/>
    </g>,
    <g key="s">
      <circle cx="50" cy="40" r="14" fill="#9ED1A4"/>
      <circle cx="40" cy="36" r="6" fill="#BBD9A5"/>
      <circle cx="60" cy="36" r="6" fill="#BBD9A5"/>
      <circle cx="50" cy="30" r="6" fill="#BBD9A5"/>
      <circle cx="50" cy="46" r="6" fill="#BBD9A5"/>
      <circle cx="50" cy="40" r="5" fill="#3F8C6A"/>
    </g>,
    <g key="b">
      <path d="M40 62 L 38 28" stroke="#3F8C6A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M50 62 L 50 22" stroke="#3F8C6A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M60 62 L 62 30" stroke="#3F8C6A" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="34" cy="32" rx="5" ry="3" fill="#4FA67C" transform="rotate(-30 34 32)"/>
      <ellipse cx="42" cy="26" rx="5" ry="3" fill="#4FA67C" transform="rotate(30 42 26)"/>
      <ellipse cx="46" cy="22" rx="5" ry="3" fill="#4FA67C" transform="rotate(-30 46 22)"/>
      <ellipse cx="54" cy="20" rx="5" ry="3" fill="#4FA67C" transform="rotate(30 54 20)"/>
      <ellipse cx="58" cy="28" rx="5" ry="3" fill="#4FA67C" transform="rotate(-30 58 28)"/>
      <ellipse cx="66" cy="32" rx="5" ry="3" fill="#4FA67C" transform="rotate(30 66 32)"/>
    </g>,
  ];
  const variant = variants[kind] || variants[0];

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{display:'block'}}>
      <path d="M30 62 L 35 88 Q 50 92 65 88 L 70 62 Z" fill="#D86A4A" stroke="#2A2622" strokeWidth="2.5"/>
      <rect x="28" y="58" width="44" height="8" rx="2" fill="#FF8A6B" stroke="#2A2622" strokeWidth="2.5"/>
      <g>{variant}</g>
    </svg>
  );
};
