# Исправление проблемы gRPC на Windows

## Проблема
```
Execution failed for task ':generateProto'.
> protoc: stdout: . stderr: --grpc_out: protoc-gen-grpc: The system cannot find the path specified.
```

## Решения

### Решение 1: Установить protoc-gen-grpc глобально
```powershell
# Запустить PowerShell от имени администратора
choco install protoc-gen-grpc
```

### Решение 2: Скачать плагин вручную
1. Скачать protoc-gen-grpc-java с GitHub
2. Поместить в папку с protoc
3. Добавить в PATH

### Решение 3: Использовать Docker
```bash
docker run --rm -v $(pwd):/workspace -w /workspace gradle:7.6 gradle build
```

### Решение 4: Временно отключить gRPC
В build.gradle добавить:
```gradle
tasks.withType(com.google.protobuf.gradle.GenerateProtoTask) {
    enabled = false
}
```

### Решение 5: Использовать WSL2
```bash
wsl gradle build
```

## Текущее состояние
- gRPC генерация временно отключена
- Проект собирается без gRPC
- Нужно включить gRPC после установки плагина 