# 🌿 Bloom — Plant care PWA

Tes plantes, ton rituel. Application web progressive (PWA) avec sync cloud Firebase.

## Stack

- React 18 + Babel standalone (transpilation in-browser)
- Firebase Auth (Email/Password + Google) + Firestore
- Service Worker + Manifest (installable)
- Single HTML entry, modules JSX servis statiques

## Structure

```
index.html               # Entrée — charge React, Babel, Firebase, modules
bloom-app.css            # Styles complets (fullscreen, no mockup)
bloom-app.jsx            # App shell, routing, auth state, name prompt
bloom-data.jsx           # useBloom hook + state local (localStorage)
bloom-firebase.jsx       # Firebase init, bloomAuth, bloomCloud, useBloomCloud
bloom-shell.jsx          # Phone wrapper (fullscreen), TabBar, Toast, Confetti, icons
bloom-screen-auth.jsx    # Login / Signup / Reset / Guest
bloom-screen-home.jsx    # Garden home (plant list + filters)
bloom-screen-care.jsx    # Today's care tasks
bloom-screen-add.jsx     # Add plant
bloom-screen-detail.jsx  # Plant detail
bloom-screen-journal.jsx # Journal entries
bloom-screen-profile.jsx # Profile + name editor + settings
sw.js                    # Service worker (cache-first)
manifest.webmanifest     # PWA manifest
vercel.json              # Vercel routing/headers config
firestore.rules          # Security rules (à publier dans Firebase Console)
icon-192.png / icon-512.png
```

## Deploy

Auto-deploy via Vercel sur push `main`. Aucun build step (HTML statique + JSX transpilé client).

### Firebase setup (à faire UNE FOIS dans la console)

1. **Authentication → Settings → Authorized domains** : ajouter `green-app-indol.vercel.app`
2. **Firestore → Rules** : coller le contenu de `firestore.rules` et publier
3. **Authentication → Sign-in methods** : activer Email/Password (et Google si besoin)

## Comportement clé

- **Login avec displayName** → header affiche le prénom automatiquement
- **Login sans displayName** (Google sans nom, signup sans prénom) → prompt obligatoire
- **Profile → carte avatar** : éditable, sauve dans Firebase Auth (`updateProfile`) + state
- **Mode invité** : possible via "Continuer sans compte", data 100% locale
