import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Nekretnine } from '../nekretnine/nekretnine.entity';
import { Korisnik } from '../korisnik/korisnik.entity';
import { Agenti } from '../agenti/agenti.entity';

@Entity('kontakt_zahtjev')
export class KontaktZahtjevi {
  @PrimaryGeneratedColumn({ name: 'zahtjev_id' })
  zahtjev_id: number;

  @Column()
  poruka: string;

  @ManyToOne(() => Nekretnine)
  @JoinColumn({ name: 'nekretnina_id' })
  nekretnina: Nekretnine;

  @ManyToOne(() => Korisnik)
  @JoinColumn({ name: 'korisnik_id' })
  korisnik: Korisnik;

  @ManyToOne(() => Agenti)
  @JoinColumn({ name: 'agent_id' })
  agent: Agenti;
}
