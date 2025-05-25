/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { NekretnineService } from './nekretnine.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Nekretnine } from './nekretnine.entity';
import { Lokacija } from '../lokacija.entity';

describe('NekretnineService', () => {
  let service: NekretnineService;

  const mockNekretnineRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLokacijaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NekretnineService,
        {
          provide: getRepositoryToken(Nekretnine),
          useValue: mockNekretnineRepository,
        },
        {
          provide: getRepositoryToken(Lokacija),
          useValue: mockLokacijaRepository,
        },
      ],
    }).compile();

    service = module.get<NekretnineService>(NekretnineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of nekretnine', async () => {
      const mockData = [
        { nekretnina_id: 1, naslov: 'Apartman', cijena: 120000 },
      ];
      mockNekretnineRepository.find.mockResolvedValue(mockData);

      const result = await service.findAll();

      expect(result).toEqual(mockData);
      expect(mockNekretnineRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return single nekretnina', async () => {
      const mockData = { nekretnina_id: 1, naslov: 'Apartman', cijena: 120000 };
      mockNekretnineRepository.findOneBy.mockResolvedValue(mockData);

      const result = await service.findOne(1);

      expect(result).toEqual(mockData);
      expect(mockNekretnineRepository.findOneBy).toHaveBeenCalledWith({
        nekretnina_id: 1,
      });
    });

    it('should throw error if not found', async () => {
      mockNekretnineRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        'Nekretnina sa ID 1 nije pronađena',
      );
    });
  });

  describe('create', () => {
    const mockCreateData = {
      naslov: 'Nova nekretnina',
      opis: 'Opis nekretnine',
      cijena: 150000,
      povrsina: 75,
      status: 'dostupna',
      lokacija: {
        adresa: 'Test adresa 1',
        grad: 'Zagreb',
        drzava: 'Hrvatska',
      },
      tipNekretnine: { tip_nekretnine_id: 1 } as any,
      agent: { agent_id: 1 } as any,
    };

    it('should create nekretnina with new lokacija', async () => {
      const savedLokacija = { lokacija_id: 1, ...mockCreateData.lokacija };
      const savedNekretnina = { nekretnina_id: 1, ...mockCreateData };

      mockLokacijaRepository.create.mockReturnValue(mockCreateData.lokacija);
      mockLokacijaRepository.save.mockResolvedValue(savedLokacija);
      mockNekretnineRepository.create.mockReturnValue(mockCreateData);
      mockNekretnineRepository.save.mockResolvedValue(savedNekretnina);

      const result = await service.create(mockCreateData);

      expect(result).toEqual(savedNekretnina);
      expect(mockLokacijaRepository.create).toHaveBeenCalledWith({
        adresa: 'Test adresa 1',
        grad: 'Zagreb',
        drzava: 'Hrvatska',
      });
      expect(mockLokacijaRepository.save).toHaveBeenCalled();
      expect(mockNekretnineRepository.create).toHaveBeenCalled();
      expect(mockNekretnineRepository.save).toHaveBeenCalled();
    });

    it('should throw error if tipNekretnine is missing', async () => {
      const { tipNekretnine, ...dataWithoutTip } = mockCreateData;

      await expect(service.create(dataWithoutTip)).rejects.toThrow(
        'Tip nekretnine je obavezan.',
      );
    });

    it('should throw error if agent is missing', async () => {
      const { agent, ...dataWithoutAgent } = mockCreateData;

      await expect(service.create(dataWithoutAgent)).rejects.toThrow(
        'Agent je obavezan.',
      );
    });
  });

  describe('update', () => {
    const updateData = {
      naslov: 'Novija nekretnina',
      cijena: 180000,
      lokacija: {
        lokacija_id: 1,
        adresa: 'Novija adresa',
        grad: 'Split',
        drzava: 'Hrvatska',
      },
    };

    it('should update nekretnina and lokacija', async () => {
      const updatedNekretnina = { nekretnina_id: 1, ...updateData };

      mockLokacijaRepository.update.mockResolvedValue({ affected: 1 });
      mockNekretnineRepository.update.mockResolvedValue({ affected: 1 });
      mockNekretnineRepository.findOneBy.mockResolvedValue(updatedNekretnina);

      const result = await service.update(1, updateData);

      expect(result).toEqual(updatedNekretnina);
      expect(mockLokacijaRepository.update).toHaveBeenCalledWith(1, {
        adresa: 'Novija adresa',
        grad: 'Split',
        drzava: 'Hrvatska',
      });
      expect(mockNekretnineRepository.update).toHaveBeenCalledWith(1, {
        naslov: 'Novija nekretnina',
        cijena: 180000,
      });
    });

    it('should update nekretnina without lokacija', async () => {
      const simpleUpdate = { naslov: 'Novi naslov', cijena: 200000 };
      const updatedNekretnina = { nekretnina_id: 1, ...simpleUpdate };

      mockNekretnineRepository.update.mockResolvedValue({ affected: 1 });
      mockNekretnineRepository.findOneBy.mockResolvedValue(updatedNekretnina);

      const result = await service.update(1, simpleUpdate);

      expect(result).toEqual(updatedNekretnina);
      expect(mockNekretnineRepository.update).toHaveBeenCalledWith(
        1,
        simpleUpdate,
      );
      expect(mockLokacijaRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete nekretnina', async () => {
      mockNekretnineRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);

      expect(mockNekretnineRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
