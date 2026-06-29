FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

WORKDIR /app/noted

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/noted/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]