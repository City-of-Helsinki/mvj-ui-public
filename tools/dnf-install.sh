#!/bin/bash

microdnf install -y --setopt=install_weak_deps=0 --nodocs --setopt=cachedir=/tmp/yum-cache "$@"
