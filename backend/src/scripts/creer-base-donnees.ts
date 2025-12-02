import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function creerBaseDeDonnees() {
    const nomBD = process.env.DB_NAME || 'esport_platform';

    // Connexion sans spécifier de base de données
    const connexion = await mysql.createConnection({
        host: process.env.DB_HOST || '192.168.1.67',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root'
    });

    try {
        // Créer la base de données si elle n'existe pas
        await connexion.query(
            `CREATE DATABASE IF NOT EXISTS \`${nomBD}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        console.log(`✅ Base de données '${nomBD}' créée ou déjà existante`);
    } catch (erreur) {
        console.error('❌ Erreur lors de la création de la base de données:', erreur);
        throw erreur;
    } finally {
        await connexion.end();
    }
}

creerBaseDeDonnees()
    .then(() => {
        console.log('✅ Script terminé avec succès');
        process.exit(0);
    })
    .catch((erreur) => {
        console.error('❌ Échec du script:', erreur);
        process.exit(1);
    });
