import { Test, TestingModule } from '@nestjs/testing';
import { KontaktZahtjeviService } from './kontakt-zahtjevi.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KontaktZahtjevi } from './kontakt-zahtjevi.entity';
import { NotFoundException } from '@nestjs/common';

describe('KontaktZahtjeviService', () => {
  let service: KontaktZahtjeviService;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KontaktZahtjeviService,
        {
          provide: getRepositoryToken(KontaktZahtjevi),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<KontaktZahtjeviService>(KontaktZahtjeviService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByNekretninaId', () => {
    it('should return kontakt zahtjevi by nekretnina ID', async () => {
      const mockData = [{ zahtjev_id: 1, poruka: 'Test poruka' }];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await service.findByNekretninaId(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { nekretnina: { nekretnina_id: 1 } },
        relations: ['nekretnina', 'korisnik', 'agent'],
      });
    });
  });

  describe('findOne', () => {
    it('should return single kontakt zahtjev', async () => {
      const mockData = { zahtjev_id: 1, poruka: 'Test poruka' };
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await service.findOne(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ zahtjev_id: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create new kontakt zahtjev', async () => {
      const createData = { poruka: 'Nova poruka' };
      const savedData = { zahtjev_id: 1, ...createData };

      mockRepository.create.mockReturnValue(createData);
      mockRepository.save.mockResolvedValue(savedData);

      const result = await service.create(createData);

      expect(result).toEqual(savedData);
      expect(mockRepository.create).toHaveBeenCalledWith(createData);
      expect(mockRepository.save).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update kontakt zahtjev', async () => {
      const updateData = { poruka: 'Azurirana poruka' };
      const updatedData = { zahtjev_id: 1, poruka: 'Azurirana poruka' };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(updatedData);

      const result = await service.update(1, updateData);

      expect(result).toEqual(updatedData);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('delete', () => {
    it('should delete kontakt zahtjev', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
