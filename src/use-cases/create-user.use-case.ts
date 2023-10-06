import { type CreateUserRequestDTO, CreateUserResponseDTO } from './../dtos';

export class CreateUserUseCase {
    execute(data: CreateUserRequestDTO) {
        // console.log(data.get('age'));

        // hash da senha

        const userCreated = {
            name: 'tsu.node',
            age: 25,
            password: 'dkndsjkndskjdsnkjdjnds'
        }

        return new CreateUserResponseDTO(userCreated)
    }
}