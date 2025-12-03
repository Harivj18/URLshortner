# --- Build stage ---
FROM node:18 AS build

ARG VITE_API_URL
ARG VITE_APP_BASE_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Vite will read ENV at build time
RUN npm run build


# --- Nginx serve stage ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# copy nginx config if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
