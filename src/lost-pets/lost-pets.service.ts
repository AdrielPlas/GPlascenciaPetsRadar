import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly dataSource: DataSource,
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

  /** Retorna todas las mascotas perdidas activas (con caché en el controlador) */
  async findAll(): Promise<LostPet[]> {
    return this.lostPetRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Busca mascotas perdidas activas en un radio dado.
   * Usado por GET /lost-pets/nearby?lat=&lon=&radius=
   */
  async findNearby(
    lat: number,
    lon: number,
    radius: number = 500,
  ): Promise<(LostPet & { distance: number })[]> {
    return this.dataSource.query(
      `
      SELECT *,
        ST_Y(location::geometry) AS lat,
        ST_X(location::geometry) AS lon,
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM lost_pets
      WHERE is_active = true
        AND ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY distance ASC
      `,
      [lon, lat, radius],
    );
  }
}
