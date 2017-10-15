#!/bin/bash
rsync -r --quiet $TRAVIS_BUILD_DIR/dist root@bangdream.ga:/var/www/html/
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/dist root@bangdream.ga:/var/www/html/