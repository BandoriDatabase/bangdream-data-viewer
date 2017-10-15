#!/bin/bash
rsync -r --quiet $TRAVIS_BUILD_DIR/dist root@bangdream.ga:path/to/files
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/dist root@bangdream.ga:path/to/files