import { OrderParamSchema, orderValidationPipe, PageParamSchema, pageValidatioPipe, PerPageParamSchema, perPageValidationPipe } from '@/schema/page-param';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { InscricaoDto } from './dto/inscricao.dto';
import { InscricaoService } from './inscricao.service';

@Controller('inscricao')
export class InscricaoController {
  constructor(private readonly inscricaoService: InscricaoService) { }


  @Post()
  async createInscricao(
    @Body() inscricaoDto: InscricaoDto
  ) {
    return await this.inscricaoService.create(inscricaoDto)
  }

  @Get(':id')
  async findInscricaoById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return await this.inscricaoService.findByid(id)
  }

  @Get('evento/:id')
  async findInscricaoByEventoId(
    @Param('id', ParseIntPipe) eventoId: number,
    @Query('page', pageValidatioPipe) page: PageParamSchema,
    @Query('limit', perPageValidationPipe) limit: PerPageParamSchema,
    @Query('sort', orderValidationPipe) sort: OrderParamSchema,
  ) {

    const take = limit || 10;
    const skip = limit * (page - 1);
    const orderBy = sort;

    const evento = await this.inscricaoService.findInscriptionsByEvent(
      eventoId,
      take,
      skip,
      orderBy
    )

    const countEvento = await this.inscricaoService.countInscricaoByEvent(eventoId)

    const totalInscricao = countEvento || 0;
    const porPagina = limit || 10;
    const pagina = page || 1;
    const totalPaginas = Math.ceil(totalInscricao / limit);

    return { evento, pagina, porPagina, totalPaginas, totalInscricao }
  }

  @Get('usuario/:id')
  async findInscricaoByUsuarioId(
    @Param('id', ParseIntPipe) usuarioId: number,
    @Query('page', pageValidatioPipe) page: PageParamSchema,
    @Query('limit', perPageValidationPipe) limit: PerPageParamSchema,
    @Query('sort', orderValidationPipe) sort: OrderParamSchema,
  ) {

    const take = limit || 10;
    const skip = limit * (page - 1);
    const orderBy = sort;


    const usuario = await this.inscricaoService.findInscriptionsByUser(
      usuarioId,
      take,
      skip,
      orderBy
    )

    const countUsuario = await this.inscricaoService.countInscricaoByUser(usuarioId)

    const totalInscricao = countUsuario || 0;
    const porPagina = limit || 10;
    const pagina = page || 1;
    const totalPaginas = Math.ceil(totalInscricao / limit);

    return { usuario, pagina, porPagina, totalPaginas, totalInscricao }
  }

}
