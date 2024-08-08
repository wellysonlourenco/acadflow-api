import { OrderParamSchema, orderValidationPipe, PageParamSchema, pageValidatioPipe, PerPageParamSchema, perPageValidationPipe, SearchParamSchema, searchValidationPipe } from '@/schema/page-param';
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
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


  @Get(':id')
  @HttpCode(200) // OK
  async getCategoriaById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoriaService.getById(id);
  }

  @Get()
  @HttpCode(200) // OK
  async getCategorias(
    @Query('page', pageValidatioPipe) page: PageParamSchema,
    @Query('limit', perPageValidationPipe) limit: PerPageParamSchema,
    @Query('search', searchValidationPipe) search: SearchParamSchema,
    @Query('sort', orderValidationPipe) sort: OrderParamSchema,
  ) {
    const take = limit || 10;
    const skip = limit * (page - 1);
    const orderBy = sort;

    console.log(search)

    const categorias = await this.categoriaService.getCategorias(
      take,
      skip,
      search,
      orderBy
    );

    const countCategorias = await this.categoriaService.getCategoriasCount()

    const totalCategorias = countCategorias || 0;
    const porPagina = limit || 10;
    const pagina = page || 1;
    const totalPaginas = Math.ceil(countCategorias / limit);

    return { categorias, pagina, porPagina, totalPaginas, totalCategorias }
  }

  @Patch(':id')
  @HttpCode(200) // OK
  //@UsePipes(CategoriaValidationPipe)
  async updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { descricao: string }
  ) {
    return this.categoriaService.update(id, body.descricao);
  }


  @Delete(':id')
  @HttpCode(200) // OK
  async deleteCategoria(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoriaService.deleteCategoria(id);
  }

}
