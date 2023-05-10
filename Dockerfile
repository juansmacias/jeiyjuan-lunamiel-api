FROM node:16.14-alpine

WORKDIR /usr

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

RUN ls -a
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:16.14-alpine

WORKDIR /usr

COPY package.json ./

RUN npm install --only=production
COPY --from=0 /usr/dist .
COPY --from=0 /usr/node_modules .
COPY prisma .
RUN npm run prisma:generate
RUN npm install pm2 -g

EXPOSE 3030

CMD ["pm2-runtime","index.js"]