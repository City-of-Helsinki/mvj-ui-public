#!/bin/bash

# Install necessary packages to get started
microdnf -y upgrade
/tools/dnf-install.sh yarn
/tools/dnf-cleanup.sh
