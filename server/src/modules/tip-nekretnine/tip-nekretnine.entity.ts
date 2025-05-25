import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tip_nekretnine')
export class TipNekretnine {
  @PrimaryGeneratedColumn({ name: 'tip_nekretnine_id' })
  tip_nekretnine_id: number;

  @Column()
  naziv: string;

  @Column()
  opis: string;
}
