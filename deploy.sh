#!/bin/bash
ssh-keyscan -t rsa $DEPLOY_HOST_GLOBAL >> ~/.ssh/known_hosts
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/dist $DEPLOY_USER@$DEPLOY_HOST_GLOBAL:$DEPLOY_PATH
