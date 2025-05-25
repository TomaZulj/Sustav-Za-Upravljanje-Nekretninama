import { Test, TestingModule } from '@nestjs/testing';
import { TipNekretnineService } from './tip-nekretnine.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipNekretnine } from './tip-nekretnine.entity';
import { NotFoundException } from '@nestjs/common';

describe('TipNekretnineService', () => {
  let service: TipNekretnineService;

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
        TipNekretnineService,
        {
          provide: getRepositoryToken(TipNekretnine),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TipNekretnineService>(TipNekretnineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of tip nekretnine', async () => {
      const mockData = [
        { tip_nekretnine_id: 1, naziv: 'Apartman', opis: 'Test' },
      ];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await service.findAll();

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return single tip nekretnine', async () => {
      const mockData = {
        tip_nekretnine_id: 1,
        naziv: 'Apartman',
        opis: 'Test',
      };
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await service.findOne(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        tip_nekretnine_id: 1,
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create new tip nekretnine', async () => {
      const createData = { naziv: 'Vila', opis: 'Luksuzna nekretnina' };
      const savedData = { tip_nekretnine_id: 1, ...createData };

      mockRepository.create.mockReturnValue(createData);
      mockRepository.save.mockResolvedValue(savedData);

      const result = await service.create(createData);

      expect(result).toEqual(savedData);
      expect(mockRepository.create).toHaveBeenCalledWith(createData);
      expect(mockRepository.save).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update tip nekretnine', async () => {
      const updateData = { naziv: 'Azuriran naziv' };
      const updatedData = {
        tip_nekretnine_id: 1,
        naziv: 'Azuriran naziv',
        opis: 'Test',
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(updatedData);

      const result = await service.update(1, updateData);

      expect(result).toEqual(updatedData);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('delete', () => {
    it('should delete tip nekretnine', async () => {
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
