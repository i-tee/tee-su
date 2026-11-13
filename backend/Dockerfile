FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# tsc с типами AdminJS съедает >1 ГБ кучи; дефолтный лимит Node (~половина RAM)
# на сервере с 2 ГБ не хватает. Недостающее добирается из swap.
RUN NODE_OPTIONS=--max-old-space-size=1536 npm run build
# Pre-generate AdminJS components bundle during build.
# mkdir uploads because LocalProvider checks the directory exists at init time.
RUN node scripts/pre-bundle.js

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# Copy pre-built AdminJS bundle so the server doesn't need to re-generate it
COPY --from=builder /app/adminjs ./adminjs
RUN mkdir -p uploads
EXPOSE 4000
CMD ["node", "dist/main"]
