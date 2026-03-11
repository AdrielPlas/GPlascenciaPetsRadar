import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { EmailService } from 'src/email/email.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { generateFoundPetEmailTemplate } from './templates/found-pet-email.template';
import { EmailOptions } from 'src/core/interfaces/mail-options.interface';

const NOTIFICATION_EMAIL = 'petradar.notificaciones@gmail.com';
const SEARCH_RADIUS_METERS = 500;

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly emailService: EmailService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateFoundPetDto): Promise<{
    foundPet: FoundPet;
    matchesFound: number;
    notificationsSent: number;
  }> {
    // 1. Guardar la mascota encontrada
    const newFoundPet = this.foundPetRepository.create({
      species: dto.species,
      breed: dto.breed,
      color: dto.color,
      size: dto.size,
      description: dto.description,
      photo_url: dto.photo_url,
      finder_name: dto.finder_name,
      finder_email: dto.finder_email,
      finder_phone: dto.finder_phone,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      },
      address: dto.address,
      found_date: dto.found_date ? new Date(dto.found_date) : new Date(),
    });
    const savedFoundPet = await this.foundPetRepository.save(newFoundPet);

    // 2. Buscar mascotas perdidas en radio de 500m usando ST_DWithin + geografía
    const nearbyLostPets: (LostPet & { distance: number; lost_lat: number; lost_lon: number })[] =
      await this.dataSource.query(
        `
        SELECT *,
          ST_Y(location::geometry) AS lost_lat,
          ST_X(location::geometry) AS lost_lon,
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
        [dto.lon, dto.lat, SEARCH_RADIUS_METERS],
      );

    // 3. Enviar correo por cada coincidencia
    let notificationsSent = 0;
    for (const lostPet of nearbyLostPets) {
      const html = generateFoundPetEmailTemplate(dto, lostPet, lostPet.distance, lostPet.lost_lat, lostPet.lost_lon);

      const options: EmailOptions = {
        to: NOTIFICATION_EMAIL,
        subject: `🐾 PetRadar: posible coincidencia para "${lostPet.name}" a ${Math.round(lostPet.distance)}m`,
        html,
      };

      const sent = await this.emailService.sendEmail(options);
      if (sent) notificationsSent++;
    }

    return {
      foundPet: savedFoundPet,
      matchesFound: nearbyLostPets.length,
      notificationsSent,
    };
  }
}