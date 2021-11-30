import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCreadentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCreadentialsDto;
        const salt = await bcrypt.genSalt(); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = this.create({ username, password: hashedPassword });

        try {
            await this.save(newUser);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Exsiting Username')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}