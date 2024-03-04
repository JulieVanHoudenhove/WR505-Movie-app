### WR505 - Movie App - Julie VAN HOUDENHOVE - TPE

## Prérequis

- [Node.js](https://nodejs.org/en/)
- [Npm](https://www.npmjs.com/get-npm)
- Partie Backend du projet [WR506 - Movie App](https://github.com/JulieVanHoudenhove/WR506-Movie-app.git)

## Installation

1. Cloner le projet
   ```bash
    git clone https://github.com/JulieVanHoudenhove/WR506-Movie-app.git
    ```
2. Installer les dépendances
     ```bash
       npm i
       # ou
       npm install
     ```
3. Modifier le fichier .env en rensignant le lien vers l'api
     ```
       VITE_SERVER_API_URL #(lien vers l'api)
     ```
4. Lancer le serveur
   - Développement
      ```bash
        npm run dev
      ```
   - Production
      ```bash
        npm run build
      ```

Les identifiants par défauts pour se connecter à l'application sont :
  - Admin
      - email : ``` admin@gmail.com ```
      - mot de passe : ``` admin ```
  - User
      - email : ``` user1@gmail.com ```
      - mot de passe : ``` password1 ```
