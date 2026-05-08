import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async create(@Body() dto: CreateLostPetDto) {
    const result = await this.lostPetsService.create(dto);
    return {
      message: 'Mascota perdida registrada exitosamente',
      data: result,
    };
  }

  /** GET /api/lost-pets — Listado de mascotas perdidas activas (caché 60s) */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('lost_pets_all')
  @CacheTTL(60_000)
  async findAll() {
    const data = await this.lostPetsService.findAll();
    return {
      message: 'Mascotas perdidas activas',
      total: data.length,
      data,
    };
  }

  /**
   * GET /api/lost-pets/nearby?lat=21.12&lon=-101.68&radius=500
   * Búsqueda por radio usando PostGIS ST_DWithin
   */
  @Get('nearby')
  async findNearby(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius: string,
  ) {
    const data = await this.lostPetsService.findNearby(
      parseFloat(lat),
      parseFloat(lon),
      radius ? parseFloat(radius) : 500,
    );
    return {
      message: `Mascotas perdidas en un radio de ${radius ?? 500}m`,
      total: data.length,
      data,
    };
  }
}

