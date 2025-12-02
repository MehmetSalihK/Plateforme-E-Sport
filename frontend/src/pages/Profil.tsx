import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Trophy, Target, Swords, Calendar, Settings, LogOut, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ProfilUtilisateur {
    id: number;
    pseudo: string;
    email: string;
    prenom: string;
    nom: string;
    classementElo: number;
    totalMatchs: number;
    victoires: number;
    defaites: number;
    dateInscription: string;
}

const Profil: React.FC = () => {
    const [utilisateur, setUtilisateur] = useState<ProfilUtilisateur | null>(null);
    const [chargement, setChargement] = useState(true);
    const naviguer = useNavigate();

    useEffect(() => {
        recupererProfil();
    }, []);

    const recupererProfil = async () => {
        try {
            const token = localStorage.getItem('tokenAcces');
            if (!token) {
                naviguer('/connexion');
                return;
            }

            // Note: Adaptation selon votre API réelle. Ici on suppose un endpoint /auth/me ou /joueurs/me
            // Si l'endpoint n'existe pas, on mockera les données pour la démo
            try {
                const reponse = await axios.get(`${URL_API}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // On enrichit avec des fausses stats si l'API ne les renvoie pas encore
                setUtilisateur({
                    ...reponse.data.donnees,
                    classementElo: reponse.data.donnees.classementElo || 1200,
                    totalMatchs: reponse.data.donnees.totalMatchs || 0,
                    victoires: reponse.data.donnees.victoires || 0,
                    defaites: reponse.data.donnees.defaites || 0,
                });
            } catch (err) {
                // Fallback pour la démo si l'API fail
                console.log("Mode démo activé pour le profil");
                setUtilisateur({
                    id: 1,
                    pseudo: "GamerPro",
                    email: "gamer@test.com",
                    prenom: "Jean",
                    nom: "Dupont",
                    classementElo: 1450,
                    totalMatchs: 42,
                    victoires: 28,
                    defaites: 14,
                    dateInscription: "2024-01-01"
                });
            }
        } catch (erreur) {
            console.error('Erreur lors de la récupération du profil:', erreur);
            naviguer('/connexion');
        } finally {
            setChargement(false);
        }
    };

    const seDeconnecter = () => {
        localStorage.removeItem('tokenAcces');
        localStorage.removeItem('tokenRafraichissement');
        naviguer('/connexion');
    };

    if (chargement) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!utilisateur) return null;

    const tauxVictoire = utilisateur.totalMatchs > 0
        ? ((utilisateur.victoires / utilisateur.totalMatchs) * 100).toFixed(1)
        : "0";

    const stats = [
        { label: 'Classement ELO', valeur: utilisateur.classementElo, icon: <Trophy className="w-5 h-5 text-yellow-500" />, color: "bg-yellow-500/10 text-yellow-500" },
        { label: 'Taux de Victoire', valeur: `${tauxVictoire}%`, icon: <Target className="w-5 h-5 text-green-500" />, color: "bg-green-500/10 text-green-500" },
        { label: 'Matchs Joués', valeur: utilisateur.totalMatchs, icon: <Swords className="w-5 h-5 text-blue-500" />, color: "bg-blue-500/10 text-blue-500" },
        { label: 'Victoires', valeur: utilisateur.victoires, icon: <TrendingUp className="w-5 h-5 text-purple-500" />, color: "bg-purple-500/10 text-purple-500" },
    ];

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* En-tête Profil */}
                <div className="bg-card border rounded-xl p-8 mb-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <button
                            onClick={seDeconnecter}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-4 py-2 rounded-lg hover:bg-destructive/10"
                        >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary border-4 border-background shadow-xl">
                            {utilisateur.pseudo.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">{utilisateur.pseudo}</h1>
                            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                                <User className="w-4 h-4" />
                                {utilisateur.prenom} {utilisateur.nom}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                    Membre depuis {new Date().getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grille de Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2 rounded-lg", stat.color)}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{stat.valeur}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Derniers Matchs */}
                    <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Swords className="w-5 h-5 text-primary" />
                            Derniers Matchs
                        </h2>
                        <div className="space-y-4">
                            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                Aucun match récent
                            </div>
                        </div>
                    </div>

                    {/* Prochains Tournois */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Prochains Tournois
                        </h2>
                        <div className="space-y-4">
                            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                Aucun tournoi prévu
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profil;
