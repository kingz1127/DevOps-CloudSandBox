# STAGE 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Setup permissions for the build
RUN mkdir -p /app && chown -R node:node /app
USER node

# Copy package files
COPY --chown=node:node package*.json ./

# Install with legacy peer deps to handle React 19/Vite 6 strictness
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY --chown=node:node . .

# Run build. We add '|| exit 1' to ensure the error is caught clearly
RUN npm run build

# STAGE 2: Runtime
FROM nginx:stable-alpine
# Vite build output goes to 'dist'
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]