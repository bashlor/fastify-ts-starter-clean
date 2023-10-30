import {FastifyReply, FastifyRequest} from "fastify";


export function methodNotAllowedHandler(request:FastifyRequest, reply:FastifyReply)  {
    reply.status(405).send({
        code: 405,
        instance: request.url,
        message: 'method not allowed',
    })
}
