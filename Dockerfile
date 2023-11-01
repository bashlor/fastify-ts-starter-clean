FROM node:20-alpine AS base

FROM base AS installer

WORKDIR /app

COPY ./package.json /app/package.json

# Install pnpm
RUN apk add --no-cache libc6-compat
RUN npm install --global pnpm \
    && SHELL=bash pnpm setup \
    && source /root/.bashrc


FROM installer as target

RUN pnpm install

COPY ./module /app/module

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./tsconfig.json /app/tsconfig.json
COPY ./.eslintrc.cjs /app/.eslintrc.cjs

## Option 1 - Do not bundle

RUN pnpm run build

RUN pnpm prune --prod || true # Will try to apply ts-patch but it will fail and it is not needed anymore. So we ignore the error "ts-patch: not found"

### Option 2 - Bundle

#RUN pnpm run bundle


FROM installer as devrunner

#Only for development purpose


FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache tini
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fastify -u 1001

USER fastify

EXPOSE 3000

ENV PORT 3000

### Option 1 - Do not bundle
COPY --from=target --chown=fastify:nodejs /app/node_modules ./node_modules
COPY --from=target --chown=fastify:nodejs /app/build ./build
COPY --from=target --chown=fastify:nodejs /app/package.json ./
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build/src/app.js"]

### Option 2 - Bundle
# If you use a single file
#COPY --from=target --chown=fastify:nodejs /app/bundle/app.mjs ./app/app.mjs
#ENTRYPOINT ["node", "app/app.mjs"]




