# Should override BUILDER_REGISTRY in the pipeline build-config environment variable section.
# Red Hat registry is used as a reasonably reliable backup.
ARG BUILDER_REGISTRY=registry.access.redhat.com
FROM ${BUILDER_REGISTRY}/ubi9/nodejs-18-minimal AS appbase

COPY tools /tools
COPY scripts /scripts
ENV PATH="/tools:${PATH}"
ENV PATH="/scripts:${PATH}"

# Make bash the only shell
RUN ["chmod", "+x", "/scripts/base_setup.sh"]
RUN ["chmod", "+x", "/scripts/setup_bash.sh"]
RUN ["chmod", "+x", "/scripts/setup_dnf_packages.sh"]
RUN ["chmod", "+x", "/scripts/setup_user.sh"]
RUN ["chmod", "+x", "/scripts/setup_app_folder.sh"]
RUN ["chmod", "+x", "/tools/dnf-install.sh"]
RUN ["chmod", "+x", "/tools/dnf-cleanup.sh"]
RUN /scripts/base_setup.sh

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn

# set node environment, either development or production
# use development to install devDependencies
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

# Yarn
ENV YARN_VERSION 1.22.19
RUN yarn policies set-version $YARN_VERSION

# Use non-root user
USER appuser

# Copy package.json and package-lock.json/yarn.lock files
COPY package.json yarn.lock ./

# Install npm depepndencies
ENV PATH /app/node_modules/.bin:$PATH

USER root
RUN bash /tools/dnf-install.sh build-essential

USER appuser
RUN yarn config set network-timeout 300000
RUN yarn && yarn cache clean --force

USER root
RUN bash /tools/dnf-cleanup.sh build-essential

# =============================
FROM appbase as development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# copy in our source code last, as it changes the most
COPY --chown=appuser:appuser . .

# ===================================
FROM appbase as staticbuilder
# ===================================

# Set NODE_ENV to production in the staticbuilder container
# ARG NODE_ENV=production
# ENV NODE_ENV $NODE_ENV

# COPY . /app
# RUN yarn build

# FROM registry.access.redhat.com/ubi8/nginx-120 AS production
# USER root

# RUN chgrp -R 0 /usr/share/nginx/html && \
    # chmod -R g=u /usr/share/nginx/html

# Copy static build
# COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
# COPY /etc/nginx.conf  /etc/nginx/

# EXPOSE 8080

# CMD ["nginx", "-g", "daemon off;"]
