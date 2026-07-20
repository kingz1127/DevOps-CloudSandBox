

# STAGE 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Set CI to false to prevent warnings from failing the build
ENV CI=false

# Copy package files first for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the project
RUN npm run build

# STAGE 2: Runtime
FROM nginx:stable-alpine
# Vite build output goes to 'dist'
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your custom nginx config for React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]