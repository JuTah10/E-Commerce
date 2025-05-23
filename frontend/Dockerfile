
FROM node:20.13.1-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

ARG VITE_BACKEND_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY


ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

COPY . .

RUN npm run build


FROM nginx:alpine

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


