FROM node:22-alpine

WORKDIR /opt/app

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev python3

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

ENV NODE_ENV=production
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
