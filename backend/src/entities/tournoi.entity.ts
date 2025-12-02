import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';

// Statuts possibles d'un tournoi
export enum StatutTournoi {
    BROUILLON = 'brouillon',
    OUVERT = 'ouvert',
    EN_COURS = 'en_cours',
    TERMINE = 'termine',
    ANNULE = 'annule'
}

// Types de bracket (arbre de tournoi)
export enum TypeBracket {
    ELIMINATION_SIMPLE = 'elimination_simple',
    ELIMINATION_DOUBLE = 'elimination_double',
    ROUND_ROBIN = 'round_robin',
    SUISSE = 'suisse'
}

// Formats de match
export enum FormatMatch {
    BO1 = 'BO1',
    BO3 = 'BO3',
    BO5 = 'BO5',
    BO7 = 'BO7'
}

@Entity('tournois')
export class Tournoi {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    nom: string;

    @Column({ unique: true, length: 250 })
    slug: string;

    @Column({ length: 100 })
    jeu: string;

    @Column()
    organisateurId: number;

    @ManyToOne(() => Utilisateur)
    @JoinColumn({ name: 'organisateurId' })
    organisateur: Utilisateur;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    texteRegles: string;

    @Column()
    maxParticipants: number;

    @Column({ default: 0 })
    participantsActuels: number;

    @Column({
        type: 'enum',
        enum: FormatMatch,
        default: FormatMatch.BO1
    })
    format: FormatMatch;

    @Column({
        type: 'enum',
        enum: TypeBracket,
        default: TypeBracket.ELIMINATION_SIMPLE
    })
    typeBracket: TypeBracket;

    @Column({
        type: 'enum',
        enum: StatutTournoi,
        default: StatutTournoi.BROUILLON
    })
    statut: StatutTournoi;

    @Column({ type: 'timestamp' })
    dateDebut: Date;

    @Column({ type: 'timestamp', nullable: true })
    dateFin: Date;

    @Column({ type: 'timestamp' })
    debutInscriptions: Date;

    @Column({ type: 'timestamp' })
    finInscriptions: Date;

    @Column({ type: 'timestamp', nullable: true })
    debutCheckIn: Date;

    @Column({ type: 'timestamp', nullable: true })
    finCheckIn: Date;

    @Column({ default: true })
    eloActive: boolean;

    @Column({ default: 32 })
    facteurKElo: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cagnotte: number;

    @Column({ length: 3, default: 'EUR' })
    devise: string;

    @Column({ nullable: true })
    urlImageCouverture: string;

    @Column({ nullable: true })
    urlImageBanniere: string;

    @Column({ default: true })
    estPublic: boolean;

    @Column({ default: false })
    estMisEnAvant: boolean;

    @CreateDateColumn()
    creeLe: Date;

    @UpdateDateColumn()
    modifieLe: Date;

    @Column({ type: 'timestamp', nullable: true })
    supprimeLe: Date;

    // Méthodes utilitaires
    estComplet(): boolean {
        return this.participantsActuels >= this.maxParticipants;
    }

    peutSinscrire(): boolean {
        const maintenant = new Date();
        return (
            this.statut === StatutTournoi.OUVERT &&
            maintenant < this.finInscriptions &&
            !this.estComplet()
        );
    }
}
