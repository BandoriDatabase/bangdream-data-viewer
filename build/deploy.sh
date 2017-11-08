#!/bin/bash
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/dist $DEPLOY_USER@$DEPLOY_HOST_GLOBAL:$DEPLOY_PATH
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/dist $DEPLOY_USER@$DEPLOY_HOST_HK:$DEPLOY_PATH
