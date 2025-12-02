import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Inscription: React.FC = () => {
    const [donnees, setDonnees] = useState({
        prenom: '',
        nom: '',
        pseudo: '',
        email: '',
        motDePasse: '',
        confirmerMotDePasse: ''
    });
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const naviguer = useNavigate();

    const gererChangement = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDonnees({ ...donnees, [e.target.name]: e.target.value });
    };

    const gererSoumission = async (e: React.FormEvent) => {
        e.preventDefault();
        setErreur('');

        if (donnees.motDePasse !== donnees.confirmerMotDePasse) {
            setErreur('Les mots de passe ne correspondent pas');
            return;
        }

        setChargement(true);

        try {
            await axios.post(`${URL_API}/auth/inscription`, {
                prenom: donnees.prenom,
                nom: donnees.nom,
                pseudo: donnees.pseudo,
                email: donnees.email,
                motDePasse: donnees.motDePasse
            });

            naviguer('/connexion');
        } catch (err: any) {
            setErreur(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background -z-10" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <div className="bg-card border shadow-xl rounded-xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Créer un compte</h2>
                            <p className="text-muted-foreground mt-2">
                                Rejoignez la communauté et commencez la compétition
                            </p>
                        </div>

                        {erreur && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 mb-6"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {erreur}
                            </motion.div>
                        )}

                        <form onSubmit={gererSoumission} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="prenom">Prénom</label>
                                    <input
                                        id="prenom"
                                        name="prenom"
                                        value={donnees.prenom}
                                        onChange={gererChangement}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="nom">Nom</label>
                                    <input
                                        id="nom"
                                        name="nom"
                                        value={donnees.nom}
                                        onChange={gererChangement}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="pseudo">Pseudo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="pseudo"
                                        name="pseudo"
                                        value={donnees.pseudo}
                                        onChange={gererChangement}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={donnees.email}
                                        onChange={gererChangement}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="motDePasse">Mot de passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            id="motDePasse"
                                            name="motDePasse"
                                            type="password"
                                            value={donnees.motDePasse}
                                            onChange={gererChangement}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="confirmerMotDePasse">Confirmer</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            id="confirmerMotDePasse"
                                            name="confirmerMotDePasse"
                                            type="password"
                                            value={donnees.confirmerMotDePasse}
                                            onChange={gererChangement}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={chargement}
                                className={cn(
                                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                    "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full mt-6"
                                )}
                            >
                                {chargement ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Inscription...
                                    </>
                                ) : (
                                    <>
                                        Créer mon compte
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="bg-muted/50 p-4 text-center text-sm text-muted-foreground border-t">
                        Déjà un compte ?{' '}
                        <Link to="/connexion" className="font-medium text-primary hover:underline">
                            Se connecter
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Inscription;
