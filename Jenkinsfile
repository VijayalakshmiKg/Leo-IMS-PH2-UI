pipeline {
    agent any
    tools {
        nodejs '16.15.1' // This should match the label configured in Jenkins
    } 
 
 
stages { 
            stage('Clear npm Cache') {
            steps {  
                // Clear npm cache
                bat 'npm cache clean --force'
            }
        }
          stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
stage('Install Dependencies') {
            steps {
                // Install npm dependencies with --legacy-peer-deps to handle dependency conflicts
                bat 'npm install --legacy-peer-deps '
            }
        }
        stage('Build') { 
            steps {
                // Build the project
                bat 'npm run build'
            }
        }

        stage('Deploy') {
            steps { 
                script {
                    withCredentials([usernamePassword(credentialsId: 'dev', passwordVariable: 'CREDENTIAL_PASSWORD', usernameVariable: 'CREDENTIAL_USERNAME')]) {
                    powershell '''
                    
                    $credentials = New-Object System.Management.Automation.PSCredential($env:CREDENTIAL_USERNAME, (ConvertTo-SecureString $env:CREDENTIAL_PASSWORD -AsPlainText -Force))

                    
                    New-PSDrive -Name X -PSProvider FileSystem -Root  "\\\\172.178.21.83\\inetpub\\wwwroot\\Blutrax_WebApp\\UI" -Persist -Credential $credentials

                    
                    Copy-Item -Path '.\\dist\\ClientApp\\*' -Destination 'X:\' -Force

                    
                    Remove-PSDrive -Name X
                    '''
                }
                }
            }
        }


}

    

    post {
        success {
            echo 'Build, test, and publish successful!' 
        }
    }
}