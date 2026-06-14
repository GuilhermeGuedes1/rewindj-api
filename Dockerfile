FROM node:alpine

WORKDIR /app

RUN npm install -g yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]