# Automated Ticketing System

A web API for create parking, check-in to park, check-out to leave and show parking status for example available lot for
car by size (small, medium and large)

# Environments

```text
AUTO_TICKET_SYSTEM_DB_HOST
AUTO_TICKET_SYSTEM_DB_USER
AUTO_TICKET_SYSTEM_DB_PASS
AUTO_TICKET_SYSTEM_DB_PORT
AUTO_TICKET_SYSTEM_DB_NAME
```

# Scripts

```shell
# Build docker image
docker build -t system/auto-ticket:0.1 .

# Start stack 
# Require step before
docker-composer up

# Unit test
yarn test

# Coverage test
yarn test:cov
```
# Assumption

lorem

# Getting Started

lorem
