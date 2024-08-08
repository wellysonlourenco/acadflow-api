import { Body, Controller, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}


  @Post()
  async createCategoria(
    @Body() body: { descricao: string }
  ) {
    return await this.categoriaService.create(body.descricao)
  }

}
