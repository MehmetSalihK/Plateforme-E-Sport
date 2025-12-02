import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

// Énumération des rôles utilisateur
export enum RoleUtilisateur {
    JOUEUR = 'joueur',
    ORGANISATEUR = 'organisateur',
    ADMIN = 'admin'
}

@Entity('utilisateurs')
export class Utilisateur {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    motDePasseHash: string;

    @Column({
        type: 'enum',
        enum: RoleUtilisateur,
        default: RoleUtilisateur.JOUEUR
    })
    role: RoleUtilisateur;

    @Column({ nullable: true })
    prenom: string;

    @Column({ nullable: true })
    nom: string;

    @Column({ default: true })
    estActif: boolean;

    @Column({ default: false })
    emailVerifie: boolean;

    @Column({ nullable: true })
    tokenVerificationEmail: string;

    @Column({ nullable: true })
    tokenReinitialisationMdp: string;

    @Column({ type: 'timestamp', nullable: true })
    expirationReinitialisationMdp: Date;

    @Column({ type: 'timestamp', nullable: true })
    derniereConnexion: Date;

    @Column({ default: 0 })
    tentativesConnexionEchouees: number;

    @Column({ type: 'timestamp', nullable: true })
    verrouillageJusqua: Date;

    @CreateDateColumn()
    creeLe: Date;

    @UpdateDateColumn()
    modifieLe: Date;

    @Column({ type: 'timestamp', nullable: true })
    supprimeLe: Date;
}
