# Этап сборки
FROM docker-hub.nexus.infr.gsprom.local/node:22 AS builder

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Проверяем, что файлы скопировались
RUN ls -la

# Настраиваем npm
RUN npm config set registry https://nexus.infr.gsprom.local/repository/npm/   && \
    npm config set strict-ssl false && \
    npm config set ca ""

# Устанавливаем зависимости и проверяем их
RUN npm install --legacy-peer-deps && \
    echo "=== NODE_MODULES CONTENT ===" && \
    ls -la node_modules/ | head -20

# Устанавливаем переменные окружения
ENV NODE_ENV='production'

# Копируем остальные файлы
COPY . .

# Проверяем структуру проекта
RUN echo "=== PROJECT STRUCTURE ===" && \
    ls -la && \
    echo "=== SRC FOLDER ===" && \
    ls -la src/ 2>/dev/null || echo "No src folder" && \
    echo "=== PACKAGE.JSON SCRIPTS ===" && \
    grep -A 10 "\"scripts\"" package.json

# Пробуем запустить сборку с подробным логированием
RUN echo "=== STARTING BUILD ===" && \
    npm run build

# Этап запуска
FROM docker-hub.nexus.infr.gsprom.local/nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]