#!/bin/bash

if [[ ! -z "$@" ]]; then
    microdnf remove -y "$@"
fi

microdnf clean all
