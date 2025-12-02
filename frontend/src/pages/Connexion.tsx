import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Connexion: React.FC = () => {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const naviguer = useNavigate();

    const gererSoumission = async (e: React.FormEvent) => {
        e.preventDefault();
        setErreur('');
        setChargement(true);

        try {
            const reponse = await axios.post(`${URL_API}/auth/connexion`, {
                email,
                motDePasse
            });

            localStorage.setItem('tokenAcces', reponse.data.tokenAcces);
            localStorage.setItem('tokenRafraichissement', reponse.data.tokenRafraichissement);

            naviguer('/tournois');
        } catch (err: any) {
            setErreur(err.response?.data?.message || 'Erreur lors de la connexion');
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
                className="w-full max-w-md"
            >
                <div className="bg-card border shadow-xl rounded-xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                <LogIn className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Bon retour parmi nous</h2>
                            <p className="text-muted-foreground mt-2">
                                Connectez-vous pour accéder à vos tournois
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                        placeholder="nom@exemple.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                        Mot de passe
                                    </label>
                                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                                        Oublié ?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={motDePasse}
                                        onChange={(e) => setMotDePasse(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={chargement}
                                className={cn(
                                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                    "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
                                )}
                            >
                                {chargement ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Connexion...
                                    </>
                                ) : (
                                    <>
                                        Se connecter
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="bg-muted/50 p-4 text-center text-sm text-muted-foreground border-t">
                        Pas encore de compte ?{' '}
                        <Link to="/inscription" className="font-medium text-primary hover:underline">
                            S'inscrire gratuitement
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Connexion;
