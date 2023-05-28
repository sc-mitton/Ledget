FROM node:14-alpine

COPY . /app
WORKDIR /app

ARG DEV
RUN npm ci --only=production
RUN if [ "$DEV" = "true" ]; then npm install; fi
RUN npm run build

EXPOSE 3000
