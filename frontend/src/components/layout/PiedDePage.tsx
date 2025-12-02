import React from 'react';
import { Trophy, Github, Twitter, Linkedin } from 'lucide-react';

const PiedDePage: React.FC = () => {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Trophy className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">E-Sport Platform</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            La plateforme de référence pour l'organisation et la gestion de tournois E-Sport.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Plateforme</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Tournois</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Classement</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Équipes</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Jeux</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Aide</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">CGU</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Suivez-nous</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} E-Sport Platform. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default PiedDePage;
