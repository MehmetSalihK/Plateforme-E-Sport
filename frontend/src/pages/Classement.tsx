import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, TrendingDown, Crown } from 'lucide-react';
import { cn } from '../lib/utils';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Joueur {
    id: number;
    pseudo: string;
    classementElo: number;
    totalMatchs: number;
    victoires: number;
    defaites: number;
    tauxVictoire: number;
    rang?: number;
}

const Classement: React.FC = () => {
    const [joueurs, setJoueurs] = useState<Joueur[]>([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        recupererClassement();
    }, []);

    const recupererClassement = async () => {
        try {
            const reponse = await axios.get(`${URL_API}/joueurs/classement/global`);
            setJoueurs(reponse.data.donnees);
        } catch (erreur) {
            console.error('Erreur lors de la récupération du classement:', erreur);
        } finally {
            setChargement(false);
        }
    };

    const obtenirIconeRang = (rang: number) => {
        switch (rang) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />;
            case 2: return <Medal className="w-6 h-6 text-gray-400 fill-gray-400/20" />;
            case 3: return <Medal className="w-6 h-6 text-amber-600 fill-amber-600/20" />;
            default: return <span className="font-bold text-muted-foreground">#{rang}</span>;
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Classement Global</h1>
                    <p className="text-muted-foreground">Les meilleurs joueurs de la plateforme</p>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border rounded-xl shadow-xl overflow-hidden">
                    {chargement ? (
                        <div className="p-8 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Rang</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Joueur</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">ELO</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Matchs</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Victoires</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Défaites</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Winrate</th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {joueurs.map((joueur, index) => (
                                        <motion.tr
                                            key={joueur.id}
                                            variants={item}
                                            className={cn(
                                                "border-b last:border-0 hover:bg-muted/50 transition-colors",
                                                index < 3 ? "bg-primary/5" : ""
                                            )}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center w-8">
                                                    {obtenirIconeRang(joueur.rang || index + 1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {joueur.pseudo.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {joueur.pseudo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-primary">
                                                {joueur.classementElo}
                                            </td>
                                            <td className="px-6 py-4 text-center text-muted-foreground">
                                                {joueur.totalMatchs}
                                            </td>
                                            <td className="px-6 py-4 text-center text-green-500 font-medium">
                                                {joueur.victoires}
                                            </td>
                                            <td className="px-6 py-4 text-center text-red-500 font-medium">
                                                {joueur.defaites}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={cn(
                                                        "font-medium",
                                                        joueur.tauxVictoire >= 50 ? "text-green-500" : "text-yellow-500"
                                                    )}>
                                                        {joueur.tauxVictoire.toFixed(1)}%
                                                    </span>
                                                    {joueur.tauxVictoire >= 50 ? (
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="w-4 h-4 text-yellow-500" />
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                    )}

                    {!chargement && joueurs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Aucun joueur classé pour le moment</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Classement;
