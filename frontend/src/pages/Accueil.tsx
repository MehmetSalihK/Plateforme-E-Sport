import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, Gamepad2, Bell, Shield, ArrowRight, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const Accueil: React.FC = () => {
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

    return (
        <div className="flex flex-col min-h-screen">
            {/* Section Hero */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background -z-10" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-8">
                            <Star className="w-3 h-3 mr-1" />
                            La plateforme #1 pour l'E-Sport
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Maîtrisez vos Tournois<br />
                            <span className="text-primary">Dominez le Jeu</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Créez, gérez et participez à des tournois E-Sport professionnels.
                            Système ELO, brackets automatiques et suivi en temps réel.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/tournois" className={cn(
                                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8"
                            )}>
                                Voir les Tournois
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link to="/inscription" className={cn(
                                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-8"
                            )}>
                                Créer un Compte
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section Fonctionnalités */}
            <section className="py-24 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Tout ce dont vous avez besoin</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Une suite complète d'outils pour organiser des tournois inoubliables.
                        </p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: Trophy,
                                title: "Gestion de Tournois",
                                desc: "Brackets automatiques, formats BO1/BO3/BO5 et gestion des scores."
                            },
                            {
                                icon: Users,
                                title: "Système ELO",
                                desc: "Classement dynamique basé sur vos performances réelles en match."
                            },
                            {
                                icon: Zap,
                                title: "Temps Réel",
                                desc: "Mises à jour instantanées des scores et de l'avancement du tournoi."
                            },
                            {
                                icon: Gamepad2,
                                title: "Multi-Jeux",
                                desc: "Support natif pour League of Legends, Valorant, CS2 et plus."
                            },
                            {
                                icon: Shield,
                                title: "Équipes",
                                desc: "Créez votre roster, gérez les rôles et affrontez d'autres équipes."
                            },
                            {
                                icon: Bell,
                                title: "Notifications",
                                desc: "Ne ratez jamais un match grâce aux alertes intelligentes."
                            }
                        ].map((feature, index) => (
                            <motion.div key={index} variants={item} className="group relative overflow-hidden rounded-lg border bg-background p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section Statistiques */}
            <section className="py-24 border-t">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "1.5k+", label: "Joueurs Actifs" },
                            { number: "250+", label: "Tournois" },
                            { number: "5k+", label: "Matchs Joués" },
                            { number: "50+", label: "Équipes" }
                        ].map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="text-4xl font-bold text-primary">{stat.number}</div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary -z-20" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 -z-10" />

                <div className="container mx-auto px-4 text-center text-primary-foreground">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à entrer dans l'arène ?</h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Rejoignez la communauté dès aujourd'hui et commencez votre ascension vers le sommet.
                    </p>
                    <Link to="/inscription" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-primary hover:bg-background/90 h-12 px-8 text-lg shadow-xl">
                        Créer un Compte Gratuit
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Accueil;
