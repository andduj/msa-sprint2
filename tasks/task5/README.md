Task 5 — Istio Traffic Management

Цель: добавить Service Mesh (Istio) для `booking-service` и настроить маршрутизацию трафика: canary (90/10), fallback, retries/circuit breaking, feature flag через заголовок `X-Feature-Enabled`.

Шаги:
- Установить Istio: `istioctl install --set profile=demo -y`
- Включить инъекцию: `kubectl label namespace default istio-injection=enabled --overwrite`
- Деплоить 2 версии: v1 и v2 (через отдельные values файлы)
- Применить Istio-манифесты: `destination-rule.yaml`, `virtual-service.yaml`, `envoy-filter.yaml`

Проверка:
- `./check-istio.sh`
- `./check-canary.sh` (должны наблюдаться ответы от обеих версий, примерно 90/10)
- `./check-feature-flag.sh` (заголовок должен маршрутизировать на v2)
- `./check-fallback.sh` (при ошибке v1 должен быть fallback на v2)

