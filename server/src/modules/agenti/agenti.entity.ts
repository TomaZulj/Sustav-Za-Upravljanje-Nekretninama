import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Korisnik } from '../korisnik/korisnik.entity';

@Entity('agent')
export class Agenti {
  @PrimaryGeneratedColumn({ name: 'agent_id' })
  agent_id: number;

  @Column()
  datum_zaposlenja: Date;

  @OneToOne(() => Korisnik, { eager: true })
  @JoinColumn({ name: 'agent_id', referencedColumnName: 'korisnik_id' })
  korisnik: Korisnik;
}
