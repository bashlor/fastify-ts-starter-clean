import vine from '@vinejs/vine';
import {Infer} from "@vinejs/vine/build/src/types";


export const postTodoRequestBodyValidator = vine.compile(
  vine.object({
    name: vine.string(),
    status: vine.enum(['todo', 'done']),
  })
);

export type PostTodoRequestBody = Infer<typeof postTodoRequestBodyValidator>;
