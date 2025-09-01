FROM node:18

# Устанавливаем protoc и другие необходимые пакеты
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Устанавливаем node-pre-gyp для сборки нативных модулей
RUN npm install -g node-pre-gyp

# Устанавливаем protoc плагины глобально
RUN npm install -g protoc-gen-js protoc-gen-grpc

# Копируем proto файл
COPY booking.proto ./

# Создаем папку для сгенерированных файлов
RUN mkdir -p generated

# Генерируем gRPC код
RUN npm run generate

# Копируем исходный код
COPY . .

EXPOSE 4001

CMD ["node", "index.js"]
