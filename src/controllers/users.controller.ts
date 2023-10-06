import type { Request, Response } from "express";
import { CreateUserRequestDTO } from "../dtos";
import { CreateUserUseCase } from "../use-cases/create-user.use-case";
import { Logger, createCustomLogger } from "src/logger";

// name, age, password
export async function create(request: Request, response: Response) {
    const logger = createCustomLogger();

    // logger.debug(
    //     'Fazendo um teste', 
    //     [{name: 'tsu.node', description: 'Não esqueçam de deixar um like'}],
    //     [1,2,3],
    //     [4,5,6],
    // )
    logger.info('Sem nenhum params')
    // logger.notice('notice')
    // logger.warning('warning')
    // logger.crit('crit')
    // logger.alert('alert')
    // logger.emerg('emerg')

    const data = new CreateUserRequestDTO({
        ...request.body
    }, ['age'])

    const createdUserDTO = new CreateUserUseCase().execute(data)

    return response.json(createdUserDTO.getAll());
}

// id
export async function remove(request: Request, response: Response) {
    return response.send();
}

// DTO + ZOD