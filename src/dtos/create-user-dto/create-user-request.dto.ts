import { z } from "zod";
import { AbstractDTO } from "../abstract.dto";

const createUserSchema = z.object({
    name: z.string(),
    age: z.number(),
    password: z.string()
});

export class CreateUserRequestDTO extends AbstractDTO<typeof createUserSchema> {
    protected rules() {
        return createUserSchema
    }
}