# --- GIAI ĐOẠN 1: Build Frontend React ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- GIAI ĐOẠN 2: Production Server ---
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Cài đặt công cụ cần thiết cho SQLite
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev

# Sao chép code backend và bản build dist từ giai đoạn 1
COPY . .
COPY --from=frontend-builder /app/dist ./dist

# Tạo thư mục dữ liệu và quyền truy cập
RUN mkdir -p data uploads/videos logs

EXPOSE 5000

# Khởi chạy server production
CMD ["node", "server.js"]
