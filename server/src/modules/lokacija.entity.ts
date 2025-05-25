import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lokacija')
export class Lokacija {
  @PrimaryGeneratedColumn('increment', { name: 'lokacija_id' })
  lokacija_id?: number;

  @Column()
  adresa: string;

  @Column()
  grad: string;

  @Column()
  drzava: string;
}
