# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source
COPY src/frontend ./src/frontend
COPY tsconfig.json .

# Build the frontend
WORKDIR /app/src/frontend
RUN pnpm build

# Stage 2: Build the smart contracts
FROM node:18-alpine AS contract-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies including dev dependencies
RUN pnpm install --frozen-lockfile

# Copy contract-related files
COPY hardhat.config.ts ./
COPY contracts ./contracts
COPY scripts ./scripts

# Compile the contracts with Hardhat
RUN npx hardhat compile

# Stage 3: Build the backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY tsconfig.json ./
COPY src ./src
COPY --from=contract-builder /app/artifacts ./artifacts

# Build TypeScript code
RUN pnpm tsc

# Stage 4: Production image
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts
COPY --from=backend-builder /app/dist ./dist
COPY --from=frontend-builder /app/dist/public ./dist/public
COPY --from=contract-builder /app/artifacts ./artifacts

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app will run on
EXPOSE 3000

# Switch to non-root user
USER nodejs

# Start the application
CMD ["node", "dist/server.js"]