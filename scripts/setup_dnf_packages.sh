#!/bin/bash

microdnf -y upgrade

# Install convenience packages
/tools/dnf-install.sh \
 git \
 curl
/tools/dnf-cleanup.sh
