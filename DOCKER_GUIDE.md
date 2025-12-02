# Guide d'Utilisation Docker

Ce projet est configuré pour fonctionner avec Docker et Docker Compose, ce qui facilite le déploiement et le développement local sans avoir à installer manuellement toutes les dépendances (Node.js, MySQL, Redis).

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé sur votre machine.

## Architecture des Services

Le `docker-compose.yml` orchestre les services suivants :

1.  **MySQL** : Base de données relationnelle (Port 3306).
2.  **Redis** : Base de données clé-valeur pour le cache (Port 6379).
3.  **Backend** : API Node.js/Express (Port 5000).
4.  **Frontend** : Application React/Vite (Port 3300).
5.  **PhpMyAdmin** : Interface web pour gérer la base de données MySQL (Port 8080).

## Démarrage Rapide

1.  Ouvrez un terminal à la racine du projet.
2.  Lancez les conteneurs :

    ```bash
    docker-compose up --build
    ```

    L'option `--build` force la reconstruction des images Docker, ce qui est recommandé lors de la première exécution ou après des modifications dans les fichiers `package.json`.

3.  Une fois les services démarrés, vous pouvez accéder à :
    -   **Frontend** : [http://localhost:3000](http://localhost:3000)
    -   **Backend API** : [http://localhost:5000/api](http://localhost:5000/api)
    -   **PhpMyAdmin** : [http://localhost:8080](http://localhost:8080) (Serveur: `mysql`, Utilisateur: `root`, Mot de passe: `root`)

## Commandes Utiles

### Arrêter les services

Pour arrêter les conteneurs tout en conservant les données (volumes) :

```bash
docker-compose down
```

Pour arrêter les conteneurs et **supprimer les volumes** (attention, cela efface la base de données) :

```bash
docker-compose down -v
```

### Voir les logs

Pour voir les logs de tous les services en temps réel :

```bash
docker-compose logs -f
```

Pour un service spécifique (ex: backend) :

```bash
docker-compose logs -f backend
```

### Exécuter une commande dans un conteneur

Pour ouvrir un shell dans le conteneur backend (par exemple pour exécuter des scripts de migration) :

```bash
docker-compose exec backend sh
```

Ensuite, vous pouvez lancer des commandes npm, par exemple :

```bash
npm run db:create
```

## Dépannage

-   **Erreur de port déjà utilisé** : Assurez-vous que vous n'avez pas d'autres services (MySQL local, autre projet Node) utilisant les ports 3306, 5000 ou 3000.
-   **Hot Reload ne fonctionne pas (Windows)** : Le fichier `docker-compose.yml` inclut `CHOKIDAR_USEPOLLING=true` pour le frontend, ce qui devrait résoudre les problèmes de rafraîchissement sur Windows.
