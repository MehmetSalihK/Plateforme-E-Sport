import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Trophy, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { cn } from '../../lib/utils';

const EnTete: React.FC = () => {
    const [menuOuvert, setMenuOuvert] = useState(false);
    const naviguer = useNavigate();
    const estAuthentifie = !!localStorage.getItem('tokenAcces');

    const gererDeconnexion = () => {
        localStorage.removeItem('tokenAcces');
        localStorage.removeItem('tokenRafraichissement');
        naviguer('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        E-Sport Platform
                    </span>
                </Link>

                {/* Menu Desktop */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/tournois" className="text-sm font-medium transition-colors hover:text-primary">
                        Tournois
                    </Link>
                    <Link to="/classement" className="text-sm font-medium transition-colors hover:text-primary">
                        Classement
                    </Link>

                    <div className="flex items-center space-x-4 border-l pl-6 ml-6">
                        <ModeToggle />

                        {estAuthentifie ? (
                            <>
                                <Link to="/profil" className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors">
                                    <User className="h-4 w-4" />
                                    <span>Profil</span>
                                </Link>
                                <button
                                    onClick={gererDeconnexion}
                                    className="flex items-center space-x-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Déconnexion</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/connexion" className={cn(
                                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                    "hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                )}>
                                    Connexion
                                </Link>
                                <Link to="/inscription" className={cn(
                                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                    "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                )}>
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Bouton Menu Mobile */}
                <div className="flex items-center space-x-4 md:hidden">
                    <ModeToggle />
                    <button
                        className="p-2"
                        onClick={() => setMenuOuvert(!menuOuvert)}
                    >
                        {menuOuvert ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Menu Mobile */}
                {menuOuvert && (
                    <div className="absolute top-16 left-0 w-full bg-background border-b md:hidden p-4 space-y-4 animate-in slide-in-from-top-5">
                        <Link to="/tournois" className="block text-sm font-medium hover:text-primary">
                            Tournois
                        </Link>
                        <Link to="/classement" className="block text-sm font-medium hover:text-primary">
                            Classement
                        </Link>
                        <div className="border-t pt-4 space-y-4">
                            {estAuthentifie ? (
                                <>
                                    <Link to="/profil" className="flex items-center space-x-2 text-sm font-medium hover:text-primary">
                                        <User className="h-4 w-4" />
                                        <span>Profil</span>
                                    </Link>
                                    <button onClick={gererDeconnexion} className="flex items-center space-x-2 text-sm font-medium text-destructive">
                                        <LogOut className="h-4 w-4" />
                                        <span>Déconnexion</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                    <Link to="/connexion" className="flex items-center justify-center space-x-2 h-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                                        <LogIn className="h-4 w-4" />
                                        <span>Connexion</span>
                                    </Link>
                                    <Link to="/inscription" className="flex items-center justify-center space-x-2 h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                                        <UserPlus className="h-4 w-4" />
                                        <span>Inscription</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default EnTete;
