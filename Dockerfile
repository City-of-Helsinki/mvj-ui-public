# =============================
FROM registry.access.redhat.com/ubi9/nodejs-24 AS appbase
# =============================

WORKDIR /app
# Copy package and lock files
COPY package.json yarn.lock .yarnrc.yml ./

RUN npm install -g corepack
# Set yarn version and fix /app ownership so default user can write
USER root
RUN chown -R default:root /app
RUN corepack enable

USER default
# Yarn version is read from "packageManager" in package.json
RUN corepack install
RUN yarn --version

# Install exact versions of dependencies and clean cache
RUN yarn install --immutable && yarn cache clean

# ===================================
FROM appbase AS staticbuilder
# ===================================

# Set NODE_ENV to production in the staticbuilder container
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
# Print Node.js version
RUN node --version

COPY . /app
RUN yarn build

# ===================================
FROM registry.access.redhat.com/ubi9/nginx-126 AS production
# ===================================

USER root

# Remove default NGINX files
RUN rm -rf /usr/share/nginx/html/*

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
COPY /etc/nginx.conf /etc/nginx/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
