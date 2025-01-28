FROM node:20-alpine AS build-step

WORKDIR /app
RUN npm i -g pnpm
COPY . .
RUN pnpm i

ARG BUILD_MODE
RUN pnpm build-${BUILD_MODE}



FROM nginx AS deployment-step

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/dist /var/www/html
COPY ./nginx/nginx.conf /etc/nginx/conf

COPY ./nginx/start-nginx /usr/local/bin

ARG BACKEND_URL
ENV BACKEND_URL ${BACKEND_URL}

ARG SERVER_NAME
ENV SERVER_NAME ${SERVER_NAME}

EXPOSE 80
CMD ["start-nginx"]