# Bloom 🌿 — App plantes

App mobile (PWA) pour enregistrer et entretenir ses plantes.  
Design dopamine deco · synchronisation cloud via Firebase.

## 🚀 Déployer sur Vercel (depuis GitHub)

### 1. Pousser le code sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<TON_USER>/bloom.git
git push -u origin main
```

### 2. Importer dans Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → sélectionne ton repo `bloom`
3. **Framework Preset** : **Other** (laisse vide, c'est du HTML statique)
4. **Build & Output Settings** : laisse les valeurs par défaut
5. Clique **Deploy**

⏱ Premier déploiement en ~30 secondes. Tu reçois une URL `https://bloom-xxx.vercel.app`.

### 3. Autoriser le domaine Vercel dans Firebase ⚠️ ÉTAPE CRUCIALE

Sinon Firebase Auth refusera la connexion.

1. Console Firebase → **Authentication** → onglet **Settings** → **Authorized domains**
2. Clique **Add domain**
3. Ajoute ton URL Vercel : `bloom-xxx.vercel.app`
4. Si tu mets un domaine perso (`bloom.tondomaine.fr`), ajoute-le aussi

### 4. Déployer les règles Firestore sécurisées

Tes règles actuelles autorisent tout le monde — il faut les remplacer.

**Option A — via la console (le plus simple)**
1. Console Firebase → **Firestore Database** → onglet **Règles**
2. Copie-colle le contenu du fichier [`firestore.rules`](./firestore.rules)
3. Clique **Publier**

**Option B — via la CLI Firebase**
```bash
npm i -g firebase-tools
firebase login
firebase use --add  # sélectionne ton projet
firebase deploy --only firestore:rules
```

### 5. C'est en ligne 🎉

- Ouvre l'URL sur ton téléphone
- Bouton **« Installer »** en bas → app sur écran d'accueil (Android)
- Sur iOS : Partager → « Sur l'écran d'accueil »

---

## 📁 Structure du projet

```
.
├── index.html               # Entrée principale (l'app)
├── bloom-app.css            # Styles complets
├── bloom-app.jsx            # Routing + shell
├── bloom-data.jsx           # State + persistance localStorage
├── bloom-firebase.jsx       # Auth + sync Firestore
├── bloom-shell.jsx          # Phone frame, tab bar, illustrations
├── bloom-screen-*.jsx       # 7 écrans
├── manifest.webmanifest     # Config PWA
├── sw.js                    # Service worker (offline)
├── icon-192.png             # Icônes app
├── icon-512.png
├── firestore.rules          # Règles sécurité Firestore
├── vercel.json              # Config Vercel
└── README.md                # Ce fichier
```

## 🛠 Stack

- **HTML/CSS** statique — pas de build
- **React 18** + **Babel** (transpilé dans le navigateur)
- **Firebase Auth** + **Firestore** (compat SDK v10)
- **PWA** : manifest + service worker + offline-first

## 🔒 Sécurité

- Chaque utilisateur ne peut accéder qu'à son propre document (`/bloom/{uid}`)
- Les clés Firebase publiques (apiKey, etc.) sont normales et conçues pour le navigateur — la sécurité passe par les règles Firestore
- Mode offline : si Firebase n'est pas joignable, l'app continue de fonctionner en local

## 🧪 Tester en local

Tu ne peux pas juste double-cliquer sur `index.html` (le service worker et les modules JSX ont besoin d'un serveur). Lance un serveur local :

```bash
# Avec Python
python3 -m http.server 8000

# Ou avec Node
npx serve

# Puis ouvre http://localhost:8000
```

## 🔮 Roadmap

- [ ] Photos de plantes (Firebase Storage)
- [ ] Notifications push de rappel d'arrosage (Firebase Messaging)
- [ ] Reconnaissance réelle de plantes via API (PlantNet)
- [ ] Partage de plantes entre comptes

---

Made with 🌿 + dopamine
