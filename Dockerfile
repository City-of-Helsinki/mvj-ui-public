ARG BUILDER_REGISTRY=registry.access.redhat.com

# ===========================================================
FROM ${BUILDER_REGISTRY}/ubi9/nodejs-18-minimal AS appbase
# ===========================================================

# Assume the root user for initial installations and setup
USER root

COPY tools /tools
COPY scripts /scripts
ENV PATH="/tools:${PATH}"
ENV PATH="/scripts:${PATH}"

# Add the yarn repository to yum/dnf repository list
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo

# Set up the tools and non-root user
RUN chmod +x /scripts/base_setup.sh && \
    chmod +x /scripts/setup_bash.sh && \
    chmod +x /scripts/setup_dnf_packages.sh && \
    chmod +x /scripts/setup_user.sh && \
    chmod +x /scripts/setup_app_folder.sh && \
    chmod +x /tools/dnf-install.sh && \
    chmod +x /tools/dnf-cleanup.sh && \
    /scripts/base_setup.sh

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL=warn

# Set node environment, either development or production
# Use development to install devDependencies
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

# Specify yarn version
ENV YARN_VERSION=1.22.19
RUN yarn policies set-version $YARN_VERSION

# Copy the package and lock files
USER appuser
COPY package.json yarn.lock ./

# Install npm dependencies
ENV PATH=/app/node_modules/.bin:$PATH

USER root
RUN chown -R appuser:appuser /app /opt/app-root

USER appuser
RUN yarn config set network-timeout 300000 && \
    yarn && \
    yarn cache clean --force

# =============================
FROM appbase AS development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Copy our source code last, as it changes the most
USER root
COPY --chown=appuser:appuser . .

# ===================================
FROM appbase AS staticbuilder
# ===================================

# Set NODE_ENV to production in the staticbuilder container
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

USER root
COPY . /app
RUN yarn build

# =================================
FROM ${BUILDER_REGISTRY}/ubi9/nginx-124 AS production
# =================================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
COPY /etc/nginx.conf /etc/nginx/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
