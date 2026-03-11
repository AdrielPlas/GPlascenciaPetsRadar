import { Body, Controller, Post } from '@nestjs/common';
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
}
