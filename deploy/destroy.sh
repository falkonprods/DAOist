#!/bin/bash
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. "$DIR/common.sh"

# Destroy existing lambda based on configuration and environment
function destroyLambda()
{
  yarn run destroy:${1}:${2}
  status=$?
  if [ $status -ne 0 ]; then
    echo $result
    exit $status
  fi

  return
}

#Destroy routine
function destroy()
{
  hasEnvironment
  echo "Starting destroy for environment: ${NODE_ENV}"
  hasLambda $1
  echo "Changing into the right directory: ${LAMBDA}"
  cd ${LAMBDA}
  hasClaudiaConfigurationFile $1
  status=$?
  if [ $status -eq 0 ]; then
    downloadClaudiaConfigurationFile $1
    destroyLambda $1 ${NODE_ENV}
    removeClaudiaConfigurationFile $1
  else
    echo "$1 lambda was never created/does not exist"
  fi
}

destroy $1
