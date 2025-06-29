import { Controller, Post, Body } from "@nestjs/common"

import { UserService } from "./user.service"

import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("create")
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Post("find-all")
    findAll() {
        return this.userService.findAll()
    }

    @Post("find")
    findOne(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.findOne(updateUserDto.uuid)
    }

    @Post("update")
    update(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(updateUserDto.uuid, updateUserDto)
    }

    @Post("delete")
    delete(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.delete(updateUserDto.uuid)
    }

    // Initial User
    @Post("initial")
    initial() {
        return this.userService.initialUser()
    }

    // Register User
    @Post("register")
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }
}
