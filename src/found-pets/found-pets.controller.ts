import { Body, Controller, Post } from '@nestjs/common';
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
}
