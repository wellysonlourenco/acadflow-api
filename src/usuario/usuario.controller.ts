import { multerConfig } from '@/middleware/DiskStorage';
import { FileSizeValidationPipe } from '@/pipe/uploaded-file';
import { OrderParamSchema, orderValidationPipe, PageParamSchema, pageValidatioPipe, PerPageParamSchema, perPageValidationPipe, SearchParamSchema, searchValidationPipe } from '@/schema/page-param';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  usersService: any;
  constructor(private readonly usuarioService: UsuarioService) {}
  
  
  @Patch('avatar/:id')
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    async updateAvatar(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile(
            new FileSizeValidationPipe(),
        ) file: Express.Multer.File,
    ) {

        if (!file) {
            throw new HttpException('O arquivo nao é uma imagem', HttpStatus.BAD_REQUEST)
        }

        const usuario = await this.usuarioService.userById(id);

        console.log(usuario.avatar)
        if (usuario.avatar) {
            try {
                await fs.unlink(`./assets/uploads/avatar/${usuario.avatar}`)
            } catch (error) {
                usuario.avatar = null;
            }
        }

        const avatar = file.filename;
        const user = await this.usuarioService.uploadAvatar(id, avatar);
        return user
    }

    @Get()
    async getCategorias(
        @Query('page', pageValidatioPipe) page: PageParamSchema,
        @Query('perPage', perPageValidationPipe) perPage: PerPageParamSchema,
        @Query('search', searchValidationPipe) search: SearchParamSchema,
        @Query('order', orderValidationPipe) order: OrderParamSchema,
    ) {
        const take = perPage
        const skip = perPage * (page - 1);
        const searchString = search;
        // const dataStart = dateStart ? new Date(dateStart) : new Date('2000-01-01');
        // const dataEnd = dateEnd ? new Date(dateEnd) : new Date(Date.now());
        let orderBy = order;

        const usuarios = await this.usuarioService.getUsers(
            take,
            skip,
            searchString,
            orderBy
        );

        const countUsuarios = await this.usuarioService.userCount()

        page = page;
        perPage = take;
        const countPages = Math.ceil(countUsuarios / perPage);

        return { usuarios, page, perPage, countPages, countUsuarios }
    }


    @Get('count')
    async getUsersCount(
    ) {
        const count = await this.usuarioService.userCount();
        return count
    }


    @Get('me/:id')
    async getUserById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.usuarioService.getUserById(id);
    }


    @Patch(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body('body') body: UpdateUsuarioDto
    ) {
        const { email, nome, perfil } = body;
        const user = await this.usuarioService.updateUser(id, email, nome, perfil);
        return user
    }

    @Delete(':id')
    async deleteUser(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.usuarioService.deleteUser(id);
    }
}
