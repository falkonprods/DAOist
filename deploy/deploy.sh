#!/bin/bash
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. "$DIR/common.sh"

# Update existing lambda based on configuration and environment
function createLambda()
{
  yarn run create:${1}:${2}
  status=$?
  if [ $status -ne 0 ]; then
    echo $result
    exit $status
  fi

  return
}

# Update existing lambda based on configuration and environment
function updateLambda()
{
  yarn run update:${1}:${2}
  status=$?
  if [ $status -ne 0 ]; then
    echo $result
    exit $status
  fi

  return
}

# Checks if this is a new deployment and if we should initiatie create or update
function createOrUpdateLambda()
{
  hasClaudiaConfigurationFile $1
  status=$?
  if [ $status -eq 0 ]; then
    downloadClaudiaConfigurationFile $1
    updateLambda $1 ${NODE_ENV}
    moveClaudiaConfigurationFile $1
  fi

  if [ $status -ne 0 ]; then
    createLambda $1 ${NODE_ENV}
    moveClaudiaConfigurationFile $1
  fi
}

#Deploy routine
function deploy()
{
  hasEnvironment
  echo "Starting deployment for environment: ${NODE_ENV}"
  hasLambda $1
  echo "Changing into the right directory: ${LAMBDA}"
  cd ${LAMBDA}
  createOrUpdateLambda $1
}

deploy $1
