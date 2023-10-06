import { z } from "zod";
import { AbstractDTO } from "../abstract.dto";


const createUserResponseSchema = z.object({
    name: z.string(),
    age: z.number(),
});

export class CreateUserResponseDTO extends AbstractDTO<typeof createUserResponseSchema> {
    protected rules() {
        return createUserResponseSchema
    }
}