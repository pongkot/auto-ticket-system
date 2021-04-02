FROM node:alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm build

FROM node:alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
RUN npm install --production
EXPOSE 3000
CMD npm run start:prod
