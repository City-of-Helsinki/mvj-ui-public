#!/bin/bash

microdnf -y upgrade

# Install convenience packages
/tools/dnf-install.sh \
 yarn
/tools/dnf-cleanup.sh
