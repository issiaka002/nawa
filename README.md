# NAWA · site de démonstration

Page d'accueil animée au défilement pour **NAWA**, une maison de chocolat
**fictive** à Soubré (Côte d'Ivoire). Aucune tablette n'est en vente : c'est un
site de test, construit avec le skill [scroll-craft](https://github.com/nateherkai/scroll-craft).

## Ce que montre la page

- un héros en plans superposés (plantation, panier de cabosses, branche) qui suit la souris ;
- une phrase qui s'assemble ligne par ligne ;
- les étapes du cacao en défilement latéral ;
- une vidéo de conche pilotée image par image par la molette ;
- une tablette dont un carré se détache : c'est le bouton.

## Lancer en local

La vidéo est chargée par `fetch`, il faut donc un serveur web (pas `file://`).

```bash
python3 -m http.server 4500
```

Puis ouvrir http://localhost:4500.

## Crédits et licences

- Photos : Wikimedia Commons (CC BY-SA 4.0 et CC0), recadrées, étalonnées et
  pour trois d'entre elles détourées. Les versions modifiées sont partagées sous
  la même licence CC BY-SA 4.0. Détail dans [CREDITS.md](CREDITS.md).
- Vidéos : Pexels (licence Pexels).
- Moteur `scrollcraft.js` / `scrollcraft.css` : MIT, voir [LICENSE-scrollcraft.txt](LICENSE-scrollcraft.txt).
- Polices : Bricolage Grotesque et Geist, SIL Open Font License 1.1.
