import { z, ZodError, type ZodType } from 'zod';

import { ValidationError, AppError } from '../errors';
import { ZodErrorMap } from './custom-error-map';

export abstract class AbstractDTO<Schema extends ZodType> {
    protected data: z.infer<Schema>;
    protected zodErrorMap: ZodErrorMap;

    public constructor(
        data: Record<string, unknown>, 
        protected path: Array<Exclude<keyof z.infer<Schema>, symbol>> = []
    ){
        this.zodErrorMap = new ZodErrorMap();
        this.validate(data);
    }

    protected abstract rules(): Schema;

    public getAll(): z.infer<Schema> {
        return this.data;
    }

    public get<Key extends keyof z.infer<Schema>>(key: Key) {
        return this.data[key]
    }

    private validate(data: Record<string, unknown>) {
        try {
          this.data = this.rules().parse(data, {
            errorMap: this.zodErrorMap.execute.bind(this.zodErrorMap),
            path: this.path
          });
        } catch (error) {
            if(error instanceof ZodError) {
                throw new ValidationError(error)
            }

            throw new AppError('Internal Server Error', 500)
        }
    }
}