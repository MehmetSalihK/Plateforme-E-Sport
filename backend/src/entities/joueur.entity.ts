import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';

@Entity('joueurs')
export class Joueur {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    utilisateurId: number;

    @ManyToOne(() => Utilisateur)
    @JoinColumn({ name: 'utilisateurId' })
    utilisateur: Utilisateur;

    @Column({ unique: true, length: 50 })
    pseudo: string;

    @Column({ nullable: true })
    urlAvatar: string;

    @Column({ type: 'text', nullable: true })
    biographie: string;

    @Column({ length: 2, nullable: true })
    codePays: string;

    @Column({ default: 1200 })
    classementElo: number;

    @Column({ default: 0 })
    totalMatchs: number;

    @Column({ default: 0 })
    victoires: number;

    @Column({ default: 0 })
    defaites: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    get tauxVictoire(): number {
        return this.totalMatchs > 0 ? (this.victoires / this.totalMatchs) * 100 : 0;
    }

    @CreateDateColumn()
    creeLe: Date;

    @UpdateDateColumn()
    modifieLe: Date;
}
