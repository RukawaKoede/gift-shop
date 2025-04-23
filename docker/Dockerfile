# ================= 阶段1：安装依赖 =================
FROM node:latest AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install


# ================= 阶段2：开发环境 =================
FROM node:latest AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
ENV HOST=0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ================= 阶段3：生产构建 =================
FROM node:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ================= 阶段4：生产运行 =================
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
