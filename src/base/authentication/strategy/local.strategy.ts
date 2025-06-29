import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"

// Services
import { UserService } from "src/base/user/user.service"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(LocalStrategy.name, { timestamp: true })

    // Constructor
    constructor(private readonly userService: UserService) {
        super()
        this.logger.log("LocalStrategy initialized")
    }

    // This method is called by Passport.js to validate the user credentials
    // It receives the username and password from the request body
    // If the user is found and the password matches, it returns the user object
    // If the user is not found or the password does not match, it throws a NotFoundException
    async validate(username: string, password: string) {
        this.logger.log(`Validating user with username: ${username}`)
        // const user = await this.authenticationService.validateUser(username, password)
        const user = await this.userService.validateUser(username, password)

        if (user) {
            this.logger.log(`User validated successfully: ${user.username}`)
            // Return the user object if validation is successful
            return user
        } else {
            this.logger.warn(`User validation failed for username: ${username}`)
            throw new NotFoundException(`Data (username):'${username}' Not Found`)
        }
    }
}
