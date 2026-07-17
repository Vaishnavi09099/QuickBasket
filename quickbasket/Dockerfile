FROM node

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

ARG NEXT_PUBLIC_SOCKET_SERVER
ENV NEXT_PUBLIC_SOCKET_SERVER=$NEXT_PUBLIC_SOCKET_SERVER



RUN npm run build

CMD ["npm","start"]