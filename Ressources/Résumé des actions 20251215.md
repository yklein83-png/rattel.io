# RATTEL - Projet Coming Soon Page

## Contexte
Plateforme de financement participatif **100% Nouvelle-Calédonie**
- Ancien nom : CORE funding
- Nouveau nom : **RATTEL**
- Mascotte : Ratel (honey badger) en pixel art

## Objectif
Créer une page HTML "Coming Soon" interactive avec un mini-jeu pour patienter avant le lancement.

## Spécifications Techniques

### Design Global
- **Palette de couleurs** :
  - Orange principal : `#FF6B35`
  - Bleu foncé : `#1a1a2e`
  - Bleu secondaire : `#0F3460`
  - Accent rouge : `#E94560`
- **Fond** : Dégradé diagonal bleu foncé → bleu secondaire
- **100% responsive** : Mobile-first avec `clamp()` pour toutes les dimensions

### Structure HTML
```
Logo "RATTEL" (grande taille, orange, effet glow)
   ↓
Sous-titre "FINANCEMENT PARTICIPATIF" (lettres espacées)
   ↓
Zone de jeu (game container avec backdrop-blur)
   ↓
Barre de progression animée
   ↓
Message marketing
   ↓
Bouton CTA "Me prévenir du lancement"
```

### Mini-Jeu (Style Chrome Dino)

**Personnage Principal** : Ratel en pixel art
- Dimension : 60x40px (50x35px sur mobile)
- Pixel art CSS pur (div avec classe `.pixel`)
- 2 frames d'animation pour effet de course (200ms entre frames)
- Couleurs :
  - `#B8B0A0` : Manteau gris (dos)
  - `#1C1814` : Corps noir
  - `#FF6B35` : Yeux orange (avec glow)
- Saut : animation 0.5s ease-out (hauteur max 100px)

**Contrôles** :
- Clic/Tap sur la zone de jeu
- Touche Espace
- Touche Flèche Haut
- Premier clic démarre le jeu

**Obstacles** :
1. **Cactus petit** : 20x35px, avec bras latéral
2. **Cactus large** : 25x50px, avec 2 bras
3. **Rochers** : 30x20px, forme arrondie
4. **Oiseaux** : 35x25px, 3 hauteurs possibles (60, 80, 100px), ailes animées
   - Probabilité : 30% oiseau, 70% obstacle au sol

**Mécanique de jeu** :
- Sol qui défile en boucle (repeating-linear-gradient)
- 3 nuages qui défilent en parallaxe (vitesses 25s, 30s, 35s)
- Obstacles générés toutes les 1500ms
- Vitesse initiale : 3-4 secondes de traversée
- Difficulté progressive : +10% de vitesse tous les 500 points
- Score incrémenté tous les 100ms (+1 point)
- High score stocké dans `localStorage` (clé: 'rattelHighScore')

**Détection collision** :
- Hitbox réduite de 10px (left/right) et 5px (top/bottom)
- Vérification toutes les 10ms
- Game Over → affichage overlay avec score final + bouton restart

**États du jeu** :
- Idle : Nuages animés, sol statique, ratel immobile
- Running : Tout animé + génération obstacles + détection collision
- Game Over : Tout figé + overlay modal

### Interface Utilisateur

**Score Display** :
- Position : top-right du game screen
- Format : "HI: 0000" / "SCORE: 0000" (padding 4 chiffres)
- Police : Courier New, monospace
- Couleur : #535353

**Instructions** :
"🎮 Appuyez ou cliquez pour sauter • Évitez les obstacles"
- Style : italic, semi-transparent
- Responsive : clamp(0.8rem, 2.5vw, 0.9rem)

**Message Marketing** :
```
La première plateforme de financement participatif
100% Nouvelle-Calédonie
arrive très bientôt
```
- "100% Nouvelle-Calédonie" en orange (classe `.highlight`)

**Bouton CTA** :
- Texte : "Me prévenir du lancement"
- Style : gradient orange→rouge, border-radius 50px
- Action : `prompt()` pour demander email
  - Si valide (contient @) : alert de confirmation
  - Sinon : alert d'erreur
- TODO : Intégrer avec système de newsletter

### Animations CSS

**@keyframes définies** :
- `moveGround` : scroll horizontal infini
- `jump` : courbe parabolique pour le ratel
- `moveObstacle` : défilement droite→gauche
- `moveBird` : défilement droite→gauche (même vitesse)
- `moveCloud` : défilement lent droite→gauche
- `flapLeft` / `flapRight` : battement d'ailes (±20deg)
- `load` : progression 0→70→100% (3s infinite)

### Optimisations Mobile

**Media Query @max-width: 480px** :
- Ratel : 50x35px
- Pixels : 3x3px (au lieu de 4x4px)
- Game container padding réduit

**Touch optimizations** :
- `touch-action: manipulation` sur game screen
- `touchstart` event avec `preventDefault()`
- Hover effects désactivés sur tactile

### Structure Fichier
- **Type** : Single HTML file (tout inline)
- **Poids estimé** : ~15-20KB
- **Dépendances** : Aucune (vanilla JS/CSS)
- **Compatibilité** : Tous navigateurs modernes

## Fonctionnalités Implémentées
✅ Pixel art ratel animé (2 frames)
✅ 4 types d'obstacles variés
✅ Système de score + high score persistant
✅ Difficulté progressive
✅ Détection collision précise
✅ Écran game over + restart
✅ 100% responsive
✅ Touch events optimisés
✅ Animations fluides (60fps)

## TODO / Améliorations Futures
- [ ] Intégrer formulaire email avec backend (Mailchimp/Brevo)
- [ ] Ajouter meta tags Open Graph pour partage réseaux sociaux
- [ ] Mentions légales RGPD/CNIL
- [ ] Analytics (Google Analytics / Matomo)
- [ ] Mode sombre/clair ?
- [ ] Sons ? (saut, collision, score milestone)

## Notes Techniques
- LocalStorage key : `rattelHighScore`
- Tous les intervals sont clearés au Game Over
- Le jeu démarre au premier clic (pas d'autostart)
- Les obstacles sont supprimés du DOM après sortie d'écran