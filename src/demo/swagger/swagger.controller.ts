import { Body, Controller, Delete, Get, Ip, Param, Post, Put, Query, Req, Request, Session } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDemoDto } from '../demo.dto';

@ApiTags('Demo Swagger')
@ApiHeader({name: 'Header', description: 'Custom Header',})
@ApiBearerAuth()
@ApiResponse({ status: 201, description: 'The record has been successfully created.'})
@ApiResponse({ status: 403, description: 'Forbidden.'})
@Controller('demo/swagger')
export class SwaggerController {
    
    @Get()
    async getSwagger(@Request() request: Request) {
        console.log('Request: ', request)
        return "Get Swagger"
    }

    @Get('/ip')
    async getSwaggerIp(@Ip() ip) {
        console.log('IP: ', ip)
        return "Get SwaggerIP"
    }


    @Get('/id/:id')
    @ApiParam({name: 'id'})
    async getSwaggerId(@Param('id') id:string) {
        console.log('Params: ', id)
        return "Get SwaggerID"
    }

    @Post()
    async postSwagger() {
        let newUser = new CreateDemoDto()
        newUser.email = 'Email'
        newUser.isEnabled = true
        newUser.password = '***'
        return newUser
    }

    @Put()
    async putSwagger(@Param('id') id:string) {
        console.log('Id', id)
        console.log()
        return "Put Swagger"
    }

    @Delete()
    async deleteSwagger() {
        return "Delete Swagger"
    }
}
