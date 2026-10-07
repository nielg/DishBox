# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install


# Copy application source code
COPY . .

# Build the Astro application
RUN npm run build

# Production Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Install dependencies (including devDependencies like node-pg-migrate)
COPY package*.json ./
RUN npm install



# Copy built app and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations

# Optional: Ensure uploads directory exists if your app relies on local storage
RUN mkdir -p ./.uploads

# Expose the server port
EXPOSE 4321

# Start the application
CMD ["node", "./dist/server/entry.mjs"]

