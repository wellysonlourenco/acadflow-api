import { multerConfig } from '@/middleware/DiskStorage';
import { FileSizeValidationPipe } from '@/pipe/uploaded-file';
import { EventoValidationPipe } from '@/schema/evento';
import { OrderParamSchema, orderValidationPipe, PageParamSchema, pageValidatioPipe, PerPageParamSchema, perPageValidationPipe, SearchParamSchema, searchValidationPipe } from '@/schema/page-param';
import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import { EventoDto } from './dto/evento.dto';
import { EventoService } from './evento.service';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) { }


  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('imagem', multerConfig))
    //@UsePipes(EventoValidationPipe)
  async create(
    @Body() eventoDto: EventoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|gif|webp)/ }), // Use a expressão regular para permitir múltiplos tipos
        ],
        fileIsRequired: false,
      }),
    ) file: Express.Multer.File,
  ) {

    const {
      nome,
      descricao,
      dataInicio,
      dataFim,
      quantidateHoras,
      quantidadeVagas,
      local,
      status
    } = eventoDto;

    let imagem = null;
    if (file) {
      imagem = file.filename;
    }

    return this.eventoService.create(
      {
        nome,
        descricao,
        dataInicio,
        dataFim,
        quantidateHoras,
        quantidadeVagas,
        local,
        status,
        imagem
      }
    )
  }




  @Get()
  @HttpCode(200)
  async getEventos(
    @Query('page', pageValidatioPipe) page: PageParamSchema,
    @Query('limit', perPageValidationPipe) perPage: PerPageParamSchema,
    @Query('search', searchValidationPipe) search: SearchParamSchema,
    @Query('order', orderValidationPipe) order: OrderParamSchema,
  ) {
    const take = perPage || 10;
    const skip = perPage * (page - 1);
    const searchString = search;
    let orderBy = order;

    const eventos = await this.eventoService.getEventos(
      take,
      skip,
      searchString,
      orderBy
    );

    const eventosCount = await this.eventoService.getEventosCount()

    page = page;
    perPage = take;
    const countPages = Math.ceil(eventosCount / perPage);

    return { eventos, page, perPage, countPages, eventosCount }
  }

  @Get(':id')
  @HttpCode(200)
  async getEventoById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.eventoService.getEventoById(id)
  }


  @Patch(':id')
  @HttpCode(200)
  @UsePipes(EventoValidationPipe)
  async updateEvento(
    @Param('id', ParseIntPipe) id: number,
    @Body() eventoDto: EventoDto
  ) {
    return this.eventoService.updateEvento(id, eventoDto)

  }

  @Delete(':id')
  @HttpCode(200)
  async deleteEvento(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.eventoService.deleteEvento(id)
  }


  @Patch('imagem/:id')
  @UseInterceptors(FileInterceptor('imagem', multerConfig))
  async updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new FileSizeValidationPipe(),
    ) file: Express.Multer.File,
  ) {

    if (!file) {
      throw new HttpException('O arquivo nao é uma imagem', HttpStatus.BAD_REQUEST)
    }

    const evento = await this.eventoService.getEventoById(id);

    console.log(evento.imagem)
    if (evento.imagem) {
      try {
        await fs.unlink(`./assets/uploads/imagem/${evento.imagem}`)
      } catch (error) {
        evento.imagem = null;
      }
    }

    const imagem = file.filename;
    const user = await this.eventoService.updateImagem(id, imagem);
    return user
  }


}
