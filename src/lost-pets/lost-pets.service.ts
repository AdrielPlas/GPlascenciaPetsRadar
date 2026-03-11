import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
  ) {}

  async create(dto: CreateLostPetDto): Promise<LostPet> {
    const newLostPet = this.lostPetRepository.create({
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      color: dto.color,
      size: dto.size,
      description: dto.description,
      photo_url: dto.photo_url,
      owner_name: dto.owner_name,
      owner_email: dto.owner_email,
      owner_phone: dto.owner_phone,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      },
      address: dto.address,
      lost_date: dto.lost_date ? new Date(dto.lost_date) : new Date(),
      is_active: true,
    });

    return this.lostPetRepository.save(newLostPet);
  }
}