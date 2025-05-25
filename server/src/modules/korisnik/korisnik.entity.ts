import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('korisnik')
export class Korisnik {
  @PrimaryGeneratedColumn({ name: 'korisnik_id' })
  korisnik_id: number;

  @Column()
  email: string;

  @Column()
  lozinka: string;

  @Column()
  ime: string;

  @Column()
  prezime: string;
}
