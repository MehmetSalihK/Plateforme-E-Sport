import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Trophy, MapPin, Clock, ChevronLeft, Gamepad2, Shield } from 'lucide-react';
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
    description?: string;
    regles?: string;
    recompenses?: string;
    urlImageCouverture?: string;
}

const DetailsTournoi: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tournoi, setTournoi] = useState<Tournoi | null>(null);
    const [chargement, setChargement] = useState(true);
    const [ongletActif, setOngletActif] = useState('infos');

    useEffect(() => {
        recupererDetailsTournoi();
    }, [id]);

    const recupererDetailsTournoi = async () => {
        try {
            const reponse = await axios.get(`${URL_API}/tournois/${id}`);
            setTournoi(reponse.data.donnees);
        } catch (erreur) {
            console.error('Erreur lors de la récupération du tournoi:', erreur);
        } finally {
            setChargement(false);
        }
    };

    if (chargement) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!tournoi) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Tournoi non trouvé</h2>
                <Link to="/tournois" className="text-primary hover:underline flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour aux tournois
                </Link>
            </div>
        );
    }

    const onglets = [
        { id: 'infos', label: 'Informations', icon: <Shield className="w-4 h-4" /> },
        { id: 'participants', label: 'Participants', icon: <Users className="w-4 h-4" /> },
        { id: 'arbre', label: 'Arbre du tournoi', icon: <Trophy className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Hero Header */}
            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                {tournoi.urlImageCouverture ? (
                    <img
                        src={tournoi.urlImageCouverture}
                        alt={tournoi.nom}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        <Gamepad2 className="w-24 h-24 text-primary/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/tournois" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Retour aux tournois
                        </Link>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            {tournoi.nom}
                        </motion.h1>
                        <div className="flex flex-wrap gap-4 text-sm md:text-base text-muted-foreground">
                            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border">
                                <Gamepad2 className="w-4 h-4 text-primary" />
                                {tournoi.jeu}
                            </div>
                            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border">
                                <Calendar className="w-4 h-4 text-primary" />
                                {new Date(tournoi.dateDebut).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border">
                                <Users className="w-4 h-4 text-primary" />
                                {tournoi.participantsActuels} / {tournoi.maxParticipants} Joueurs
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* Navigation des onglets */}
                <div className="flex space-x-1 border-b mb-8 overflow-x-auto">
                    {onglets.map((onglet) => (
                        <button
                            key={onglet.id}
                            onClick={() => setOngletActif(onglet.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                                ongletActif === onglet.id
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {onglet.icon}
                            {onglet.label}
                            {ongletActif === onglet.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Contenu des onglets */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={ongletActif}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {ongletActif === 'infos' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-primary" />
                                            Description
                                        </h3>
                                        <p className="text-muted-foreground whitespace-pre-line">
                                            {tournoi.description || "Aucune description disponible pour ce tournoi."}
                                        </p>
                                    </div>
                                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                                        <h3 className="text-xl font-semibold mb-4">Règlement</h3>
                                        <p className="text-muted-foreground whitespace-pre-line">
                                            {tournoi.regles || "Le règlement standard de la plateforme s'applique."}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold mb-4">Récompenses</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Trophy className="w-8 h-8 text-yellow-500" />
                                                <div>
                                                    <div className="font-bold">1ère Place</div>
                                                    <div className="text-sm text-muted-foreground">1000€ + Points ELO</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Medal className="w-8 h-8 text-gray-400" />
                                                <div>
                                                    <div className="font-bold">2ème Place</div>
                                                    <div className="text-sm text-muted-foreground">500€ + Points ELO</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full btn btn-primary py-6 text-lg shadow-lg shadow-primary/20">
                                        S'inscrire au tournoi
                                    </button>
                                </div>
                            </div>
                        )}

                        {ongletActif === 'participants' && (
                            <div className="bg-card border rounded-xl p-8 text-center">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Liste des participants</h3>
                                <p className="text-muted-foreground">
                                    La liste des participants sera disponible une fois les inscriptions closes.
                                </p>
                            </div>
                        )}

                        {ongletActif === 'arbre' && (
                            <div className="bg-card border rounded-xl p-8 text-center">
                                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Arbre du tournoi</h3>
                                <p className="text-muted-foreground">
                                    L'arbre du tournoi sera généré automatiquement au début de la compétition.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Composant Medal manquant dans l'import lucide-react ci-dessus, je l'ajoute ici pour la démo
const Medal = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
);

export default DetailsTournoi;
