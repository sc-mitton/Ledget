FROM node:14-alpine

COPY . /portal
ARG DEV

WORKDIR /portal
RUN npm ci --only=production
RUN if [ "$DEV" = "true" ]; then npm install; fi
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
