name: Deploy to Private Server

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Sync files to Server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: '-rlgoDzvc -i --delete'
          SOURCE: ./
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          REMOTE_PORT: ${{ secrets.SERVER_PORT || 22 }}
          TARGET: /opt/techreview-blog
          EXCLUDE: /.git/, /node_modules/, /.npm-cache/, /.qoder/, /.vscode/, /terminals/, /.cursor/

      - name: Execute deployment script
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SERVER_PORT || 22 }}
          script: |
            cd /opt/techreview-blog
            # 确保脚本有执行权限
            chmod +x deploy.sh
            # 只执行这一个脚本，传入密码和用户名
            # 第一个参数是 DB_PASSWORD，第二个是 DB_USERNAME
            sudo ./deploy.sh "${{ secrets.DB_PASSWORD }}" "${{ secrets.DB_USERNAME }}"
