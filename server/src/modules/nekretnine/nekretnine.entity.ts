import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipNekretnine } from '../tip-nekretnine/tip-nekretnine.entity';
import { Agenti } from '../agenti/agenti.entity';
import { Lokacija } from '../lokacija.entity';

@Entity('nekretnina')
export class Nekretnine {
  @PrimaryGeneratedColumn('increment', { name: 'nekretnina_id' })
  nekretnina_id: number;

  @Column()
  naslov: string;

  @Column()
  opis: string;

  @Column()
  cijena: number;

  @Column()
  povrsina: number;

  @Column()
  status: string;

  @ManyToOne(() => Lokacija, { cascade: true, eager: true })
  @JoinColumn({ name: 'lokacija_id' })
  lokacija: Lokacija;

  @ManyToOne(() => TipNekretnine, { eager: true })
  @JoinColumn({ name: 'tip_nekretnine_id' })
  tipNekretnine: TipNekretnine;

  @ManyToOne(() => Agenti, { eager: true })
  @JoinColumn({ name: 'agent_id' })
  agent: Agenti;
}
