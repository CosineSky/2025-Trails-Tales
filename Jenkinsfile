pipeline {
    agent any

    environment {
        SERVER_DIR = 'server'
        CLIENT_WEB_DIR = 'client-web'
        CLIENT_MOBILE_DIR = 'client_mobile'
    }

    stages {
        stage('Checkout') {
            steps {
                // 显式指定 SCM 配置，避免凭证解析出错
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'git@github.com:CosineSky/2025-Trails-Tales.git',
                        credentialsId: 'github-ssh-key'
                    ]]
                ])
            }
        }

        stage('Build Server') {
            when {
                changeset "**/$SERVER_DIR/**"
            }
            steps {
                dir(SERVER_DIR) {
                    sh 'npm install'
                }
            }
        }

        stage('Build Client Web') {
            when {
                changeset "**/$CLIENT_WEB_DIR/**"
            }
            steps {
                dir(CLIENT_WEB_DIR) {
                    sh 'npm install'
                    sh 'react-scripts build'
                }
            }
        }

        stage('Build Client Mobile') {
            when {
                changeset "**/$CLIENT_MOBILE_DIR/**"
            }
            steps {
                dir(CLIENT_MOBILE_DIR) {
                    sh 'npm install'
                    sh 'npx react-native run-android'
                }
            }
        }

        stage('Deploy Server') {
            when {
                branch 'master'
            }
            steps {
                sh 'scp -r server/* root@115.175.40.241:/trails-tales/server'
                sh 'ssh user@your-server "pm2 restart app"'
            }
        }

        stage('Deploy Client Web') {
            when {
                branch 'master'
            }
            steps {
                sh 'scp -r client-web/* root@115.175.40.241:/trails-tales/client-web'
            }
        }

        stage('Deploy Client Mobile') {
            when {
                branch 'master'
            }
            steps {
                sh 'scp -r client-mobile/* root@115.175.40.241:/trails-tales/client_mobile'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
