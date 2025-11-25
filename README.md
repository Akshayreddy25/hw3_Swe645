# SWE 645 – Home Assignment 3  
**Full-Stack Survey Application on Kubernetes with Jenkins CI/CD**

## 1. Overview

This project extends the HW2 survey application into a fully containerized, cloud-native deployment running on an **RKE2 Kubernetes cluster** with automated builds via **Jenkins**.

**Tech stack**

- **Frontend:** React + Vite (Survey UI)
- **Backend:** FastAPI (REST API)
- **Database:** MySQL 8 + phpMyAdmin
- **Orchestration:** Kubernetes (RKE2) – namespace `akr`
- **Containerization:** Docker
- **CI/CD:** Jenkins pipeline building & deploying to Kubernetes
- **Cloud:** AWS EC2 (RKE2 server + NodePorts exposed)

---

## 2. Live Links

> IP may change if the EC2 instance is recreated.

1. **Website Frontend (Survey UI)**  
   http://34.203.174.148:30100/surveys  

2. **Website Backend (Health Endpoint)**  
   http://34.203.174.148:31101/api/health  

3. **Rancher (Cluster Management)**  
   https://34.203.174.148/dashboard/c/c-m-skqsm59w/explorer#cluster-events  

4. **Jenkins (CI/CD Pipeline)**  
   http://34.203.174.148:8081/job/akr-hw3-backend-pipeline/  

5. **phpMyAdmin (MySQL Web UI)**  
   http://34.203.174.148:30102/  

6. **GitHub Repository**  
   https://github.com/Akshayreddy25/hw3_Swe645  

---

## 3. Prerequisites

### Local development

- Docker & Docker Compose
- Git
- (Optional) Python 3.11 and Node.js 20 if running without Docker

### Cluster deployment

- AWS EC2 instance with **RKE2** installed and running
- `kubectl` available on the node (RKE2 installs it under `/var/lib/rancher/rke2/bin`)
- Docker engine on the Jenkins server (same EC2 in this setup)
- Docker Hub account (username: `5715677660`) and credentials stored in Jenkins as `dockerhub-creds`

---

## 4. Running Locally with Docker Compose (Dev)

> Only if you use the local docker-compose dev setup.

1. **Clone the repository**

```bash
git clone https://github.com/Akshayreddy25/hw3_Swe645.git
cd hw3_Swe645

## 2. Bring up the stack

docker compose up --build

Access (example local ports; may differ from cloud)

Frontend: http://localhost:5173/

Backend: http://localhost:8000/docs

phpMyAdmin: e.g. http://localhost:8080/

MySQL: localhost:3306

Stop

docker compose down

## 5. Manual Docker Build & Push (Optional, without Jenkins)

From the repo root (hw3_Swe645):

# Login to Docker Hub
docker login -u 5715677660

# Build backend image
docker build -t 5715677660/akr-backend:hw3 ./backend
docker push 5715677660/akr-backend:hw3

# Build frontend image
docker build -t 5715677660/akr-frontend:hw3 ./frontend
docker push 5715677660/akr-frontend:hw3

## 6. RKE2 Kubernetes Setup (High Level)

On the EC2/RKE2 node:

Ensure RKE2 is installed and running (service name may be rke2-server):

sudo systemctl status rke2-server


Add RKE2 binaries to PATH (so kubectl works):

export PATH=/var/lib/rancher/rke2/bin:$PATH


Use the Jenkins kubeconfig (copied from Rancher) when working from the node:

export KUBECONFIG=/var/lib/rancher/rke2/jenkins-rke2.yaml


Verify cluster and namespace:

kubectl get nodes
kubectl get ns


You should see a node like:

NAME              STATUS   ROLES                              AGE   VERSION
ip-172-31-26-95   Ready    control-plane,etcd,master,worker   ...


And namespace akr should exist.

## 7. Kubernetes Deployment (Manual)

From the repo root (on the node or Jenkins container with kubeconfig mounted):

# Ensure correct kubeconfig
export KUBECONFIG=/var/lib/rancher/rke2/jenkins-rke2.yaml

# Create namespace (idempotent)
kubectl apply -f k8s/namespace.yaml

# Deploy MySQL
kubectl -n akr apply -f k8s/mysql.yaml

# Deploy phpMyAdmin
kubectl -n akr apply -f k8s/mysql-admin.yaml

# Deploy backend
kubectl -n akr apply -f k8s/akr-backend.yaml

# Deploy frontend
kubectl -n akr apply -f k8s/akr-frontend.yaml


Check resources:

kubectl -n akr get pods
kubectl -n akr get svc


Expected services:

NAME              TYPE        PORT(S)
akr-backend       NodePort    8000:31101/TCP
akr-frontend      NodePort    5173:30100/TCP
akr-mysql         ClusterIP   3306/TCP
akr-mysql-admin   NodePort    80:30102/TCP


Restart deployments if needed:

kubectl -n akr rollout restart deployment akr-backend
kubectl -n akr rollout restart deployment akr-frontend
kubectl -n akr rollout status deployment akr-backend
kubectl -n akr rollout status deployment akr-frontend

## 8. Jenkins CI/CD Pipeline

The CI/CD logic is defined in Jenkinsfile and runs inside the jenkins-akr container on the EC2 instance.

8.1 Environment variables used in Jenkinsfile

DOCKERHUB_USER = '5715677660'

BACKEND_IMAGE = '5715677660/akr-backend:hw3'

FRONTEND_IMAGE = '5715677660/akr-frontend:hw3'

KUBECONFIG_PATH = '/var/jenkins_home/rke2-jenkins.yaml'

rke2-jenkins.yaml is the kubeconfig downloaded from Rancher and copied into Jenkins volume.

8.2 Pipeline stages

Checkout

Clones the GitHub repo: https://github.com/Akshayreddy25/hw3_Swe645.git

Build Backend Image

docker build --platform=linux/amd64 -t ${BACKEND_IMAGE} ./backend


Build Frontend Image

docker build --platform=linux/amd64 -t ${FRONTEND_IMAGE} ./frontend


Docker Login & Push

Uses Jenkins credentials dockerhub-creds:

echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
docker push ${BACKEND_IMAGE}
docker push ${FRONTEND_IMAGE}


Deploy to Kubernetes

export KUBECONFIG=${KUBECONFIG_PATH}

kubectl apply -f k8s/namespace.yaml
kubectl -n akr apply -f k8s/mysql.yaml
kubectl -n akr apply -f k8s/mysql-admin.yaml
kubectl -n akr apply -f k8s/akr-backend.yaml
kubectl -n akr apply -f k8s/akr-frontend.yaml

kubectl -n akr rollout restart deployment akr-frontend
kubectl -n akr rollout status deployment akr-frontend

8.3 How to trigger the pipeline

Open Jenkins:
http://34.203.174.148:8081/job/akr-hw3-backend-pipeline/

Click “Build Now”.

Wait until the build is SUCCESS and verify in the console log that:

Docker images were built and pushed.

kubectl apply and rollouts succeeded.

## 9. Using the Application

Open the frontend:

http://34.203.174.148:30100/surveys

Fill out and submit the survey form.

The backend (FastAPI) processes the request and writes data to MySQL database akr in the surveys table.

Check backend health:

http://34.203.174.148:31101/api/health

Verify data using phpMyAdmin:

http://34.203.174.148:30102/

Log in with MySQL credentials defined in k8s/mysql.yaml.

Select database akr → table surveys to confirm records are stored.

## 10. Troubleshooting
kubectl errors like “connection refused”

Make sure you exported correct kubeconfig:

export PATH=/var/lib/rancher/rke2/bin:$PATH
export KUBECONFIG=/var/lib/rancher/rke2/jenkins-rke2.yaml
kubectl get nodes


If still failing, verify RKE2 service is running:

sudo systemctl status rke2-server

phpMyAdmin or frontend page not loading

Check pod and service status:

kubectl -n akr get pods
kubectl -n akr get svc


All related pods should be in Running state.

Jenkins Docker login failure

Re-check Jenkins credential with ID dockerhub-creds:

Username must be 5715677660

Password/Token must be valid Docker Hub password or PAT.

Re-run pipeline after updating.

## 11. Contributions

1. Akshay

Designed and configured Kubernetes manifests for backend, frontend, MySQL, and phpMyAdmin.

Integrated RKE2 cluster with Rancher.

Set up and debugged Jenkins pipeline (kubeconfig, Docker build/push, kubectl deploy).

2. Revanth

Implemented the FastAPI backend endpoints and database models.

Configured SQLAlchemy & PyMySQL connection to MySQL.

Wrote backend Dockerfile and ensured compatibility with Kubernetes secrets/env variables.

3. Santhosh 

Developed and refined the React + Vite frontend survey UI.

Validated end-to-end flow (frontend → backend → MySQL → phpMyAdmin).

Prepared HW3 documentation and this README, and helped test URLs, NodePorts, and health checks.
