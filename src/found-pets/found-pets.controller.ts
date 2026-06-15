import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  async create(@Body() dto: CreateFoundPetDto) {
    const result = await this.foundPetsService.create(dto);
    return {
      message: 'Mascota encontrada registrada exitosamente',
      data: result.foundPet,
      matchesFound: result.matchesFound,
      notificationsSent: result.notificationsSent,
    };
  }

  /** GET /api/found-pets — Listado de mascotas encontradas (caché 60s) */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('found_pets_all')
  @CacheTTL(60_000)
  async findAll() {
    const data = await this.foundPetsService.findAll();
    return {
      message: 'Mascotas encontradas',
      total: data.length,
      data,
    };
  }
}

