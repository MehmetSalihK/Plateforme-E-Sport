import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Users, Gamepad2, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Tournoi {
    id: number;
    nom: string;
    jeu: string;
    statut: string;
    maxParticipants: number;
    participantsActuels: number;
    dateDebut: string;
    urlImageCouverture?: string;
}

const Tournois: React.FC = () => {
    const [tournois, setTournois] = useState<Tournoi[]>([]);
    const [chargement, setChargement] = useState(true);
    const [filtreStatut, setFiltreStatut] = useState('tous');
    const [recherche, setRecherche] = useState('');

    useEffect(() => {
        recupererTournois();
    }, []);

    const recupererTournois = async () => {
        try {
            const reponse = await axios.get(`${URL_API}/tournois`);
            setTournois(reponse.data.donnees);
        } catch (erreur) {
            console.error('Erreur lors de la récupération des tournois:', erreur);
        } finally {
            setChargement(false);
        }
    };

    const tournoisFiltres = tournois.filter(tournoi => {
        const matchStatut = filtreStatut === 'tous' || tournoi.statut === filtreStatut;
        const matchRecherche = tournoi.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            tournoi.jeu.toLowerCase().includes(recherche.toLowerCase());
        return matchStatut && matchRecherche;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const obtenirBadgeStatut = (statut: string) => {
        const styles: Record<string, string> = {
            ouvert: 'bg-green-500/10 text-green-500 border-green-500/20',
            en_cours: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            termine: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            brouillon: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        };
        const labels: Record<string, string> = {
            ouvert: 'Inscriptions ouvertes',
            en_cours: 'En cours',
            termine: 'Terminé',
            brouillon: 'Brouillon'
        };

        return (
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[statut] || styles.brouillon)}>
                {labels[statut] || statut}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Tournois</h1>
                        <p className="text-muted-foreground">Découvrez et rejoignez les meilleures compétitions</p>
                    </div>
                    <Link
                        to="/tournois/creer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <Trophy className="mr-2 h-4 w-4" />
                        Créer un Tournoi
                    </Link>
                </div>

                {/* Barre de filtres et recherche */}
                <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-4 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {['tous', 'ouvert', 'en_cours', 'termine'].map((statut) => (
                                <button
                                    key={statut}
                                    onClick={() => setFiltreStatut(statut)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                        filtreStatut === statut
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                    )}
                                >
                                    {statut === 'tous' ? 'Tous' : statut.charAt(0).toUpperCase() + statut.slice(1).replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Rechercher un tournoi..."
                                value={recherche}
                                onChange={(e) => setRecherche(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                            />
                        </div>
                    </div>
                </div>

                {chargement ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-80 rounded-xl bg-card/50 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {tournoisFiltres.map((tournoi) => (
                                <motion.div
                                    key={tournoi.id}
                                    variants={item}
                                    layout
                                    className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Link to={`/tournois/${tournoi.id}`} className="block h-full">
                                        <div className="aspect-video w-full relative overflow-hidden bg-muted">
                                            {tournoi.urlImageCouverture ? (
                                                <img
                                                    src={tournoi.urlImageCouverture}
                                                    alt={tournoi.nom}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                    <Gamepad2 className="w-12 h-12 text-primary/40" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                {obtenirBadgeStatut(tournoi.statut)}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                                    {tournoi.nom}
                                                </h3>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                                <Gamepad2 className="w-4 h-4" />
                                                {tournoi.jeu}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-4 h-4" />
                                                    <span>{tournoi.participantsActuels}/{tournoi.maxParticipants}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(tournoi.dateDebut).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!chargement && tournoisFiltres.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Filter className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Aucun tournoi trouvé</h3>
                        <p className="text-muted-foreground">
                            Essayez de modifier vos filtres ou votre recherche
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tournois;
