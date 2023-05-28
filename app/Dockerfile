FROM node:14-alpine

COPY . /app
WORKDIR /app

RUN npm ci --only=production
ARG DEV
RUN if [ "$DEV" = "true" ]; then npm install; fi
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
