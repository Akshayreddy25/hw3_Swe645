pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = '5715677660'

        BACKEND_IMAGE   = "${DOCKERHUB_USER}/akr-backend:hw3"
        FRONTEND_IMAGE  = "${DOCKERHUB_USER}/akr-frontend:hw3"
        KUBECONFIG_PATH = '/var/jenkins_home/rke2-jenkins.yaml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                echo "Building backend image: ${BACKEND_IMAGE}"
                docker build --platform=linux/amd64 -t ${BACKEND_IMAGE} ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                echo "Building frontend image: ${FRONTEND_IMAGE}"
                docker build --platform=linux/amd64 -t ${FRONTEND_IMAGE} ./frontend
                '''
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push ${BACKEND_IMAGE}
                    docker push ${FRONTEND_IMAGE}
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo Using kubeconfig at ${KUBECONFIG_PATH}
                    export KUBECONFIG=${KUBECONFIG_PATH}

                    kubectl apply -f k8s/namespace.yaml
                    kubectl -n akr apply -f k8s/mysql.yaml
                    kubectl -n akr apply -f k8s/mysql-admin.yaml
                    kubectl -n akr apply -f k8s/akr-backend.yaml
                    kubectl -n akr apply -f k8s/akr-frontend.yaml

                    kubectl -n akr rollout restart deployment akr-frontend
                    kubectl -n akr rollout status deployment akr-frontend
                '''
            }
        }
    }
}
