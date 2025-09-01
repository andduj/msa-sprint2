Task 5 — Istio Traffic Management

1. Архитектура и цели
- Две версии одного сервиса `booking-service`: v1 (по умолчанию) и v2 (с включаемой фичей).
- Единый `Service` (`ClusterIP:80→8080`) и два `Deployment` c лейблами: `app=booking-service`, `version=v1|v2`.
- Istio управляет маршрутизацией: canary 90/10, header‑routing по `X-Feature-Enabled: true`, retries и circuit breaking.

2. Что сделано
- Helm‑чарт адаптирован под версии (лейблы, общий `serviceName`, флаг `createService`):
  - `helm/booking-service/templates/deployment.yaml`
  - `helm/booking-service/templates/service.yaml`
- Values:
  - `values.yaml` (база), `values-v1.yaml` (v1), `values-v2.yaml` (v2: `enableFeatureX:true`, `createService:false`).
- Istio манифесты:
  - `istio/gateway.yaml` — публичный вход через IngressGateway
  - `istio/destination-rule.yaml` — subsets v1/v2, connection pool, outlier detection (circuit breaking)
  - `istio/virtual-service.yaml` — header match для feature‑flag, canary 90/10, retries

3. Развёртывание
1) Подготовка Istio (demo профиль) и sidecar‑инъекция:
   - `istioctl install --set profile=demo -y`
   - `kubectl label namespace default istio-injection=enabled --overwrite`
2) Сборка/доставка образа и релизы v1/v2:
   - `minikube image load booking-service:step1`
   - v1 (создаёт Service):
     `helm upgrade --install booking-v1 ./helm/booking-service -f ./helm/booking-service/values-v1.yaml --set serviceName=booking-service --set version=v1 --set createService=true`
   - v2 (без Service):
     `helm upgrade --install booking-v2 ./helm/booking-service -f ./helm/booking-service/values-v2.yaml --set serviceName=booking-service --set version=v2 --set createService=false`
3) Применение Istio:
   - `kubectl apply -f istio/gateway.yaml`
   - `kubectl apply -f istio/destination-rule.yaml`
   - `kubectl apply -f istio/virtual-service.yaml`
4) Доступ снаружи (локально):
   - `kubectl -n istio-system port-forward svc/istio-ingressgateway 9090:80`

4. Проверки
- Сайдкары установлены: `kubectl get pods -l app=booking-service -o wide` (READY 2/2)
- Feature flag: `./check-feature-flag.sh` → pong (маршрут по заголовку)
- Canary: `./check-canary.sh` → серия pong; распределение подтверждено логами Envoy

5. Метрики и артефакты (results/)
- YAML ресурсов:
  - `gateway_yaml.txt`, `virtualservice_yaml.txt`, `destinationrule_yaml.txt`
- Kubernetes:
  - `pods.txt`, `service_yaml.txt`
- Canary распределение:
  - `canary_counts.txt` (пример: v1=10, v2=10 при коротком запуске; при длительном — стремится к 90/10)

6. Circuit breaking и retries
- Включены через `destination-rule.yaml` (outlierDetection) и `virtual-service.yaml` (retries). Для демонстрации fallback можно временно удалить pod v1 и наблюдать успешные ответы (будет обслуживать v2).

7. Примечания
- Общий `Service` и разные `version` обеспечивают корректную работу Istio subsets.
- Для стабильной оценки 90/10 следует генерировать 500–1000 запросов без заголовка (см. `check-canary.sh`).

