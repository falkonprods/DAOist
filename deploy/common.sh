#!/bin/bash -x

LAMBDA="packages/${1}"
CLAUDIA_DEPLOYMENT_FILE="${NODE_ENV}.claudia.json"
S3_BUCKET_DEPLOYMENT_CONFIGURATION="vinzy-deployment-configuration"

# Checks if the environment exists and is allowed
function hasEnvironment() {
  if [ ! -n "$NODE_ENV" ]; then
    echo 'no environment specified'
    exit 1
  fi

  if [[ ${NODE_ENV} != 'development' ]] && [[ ${NODE_ENV} != 'production' ]]; then
    echo "${NODE_ENV} is not allowed, allowed environments are prodcution and development"
    exit 1
  fi

}

# Checks if the given lambda function exists in the packages folder.
function hasLambda()
{
  if [ ! -n "$1" ]; then
    echo 'deploy <lambda_function>'
    exit 1
  fi

  if [ ! -d "$LAMBDA" ]; then
    echo "${LAMBDA} does not exist"
    exit 1
  fi
}

#Check if the deployment file exists in the s3 bucket
function hasClaudiaConfigurationFile()
{
  result=$(aws s3 ls s3://${S3_BUCKET_DEPLOYMENT_CONFIGURATION}/$1.${CLAUDIA_DEPLOYMENT_FILE})
  status=$?
  if [ $status -ne 0 ]; then
    echo $result
    false
  else
    echo "Deployment lock file found on s3: ${S3_BUCKET_DEPLOYMENT_CONFIGURATION}/$1.${CLAUDIA_DEPLOYMENT_FILE}"
  fi
  return
}

#Move deployment file to s3 bucket
function moveClaudiaConfigurationFile()
{
  result=$(aws s3 mv ${CLAUDIA_DEPLOYMENT_FILE} s3://${S3_BUCKET_DEPLOYMENT_CONFIGURATION}/$1.$CLAUDIA_DEPLOYMENT_FILE)
  status=$?
  if [ $status -ne 0 ]; then
    echo $result
    false
  fi

  return
}

#Copy deployment file from s3 bucket to local
function downloadClaudiaConfigurationFile()
{
  result=$(aws s3 cp s3://${S3_BUCKET_DEPLOYMENT_CONFIGURATION}/$1.$CLAUDIA_DEPLOYMENT_FILE ${CLAUDIA_DEPLOYMENT_FILE})
  status=$?
  if [ $status -ne 0 ]; then
    echo $result
    exit $status
  fi

  echo $result

  return
}

#Remove deployment file from s3 bucket to local
function removeClaudiaConfigurationFile()
{
  result=$(aws s3 rm s3://${S3_BUCKET_DEPLOYMENT_CONFIGURATION}/$1.$CLAUDIA_DEPLOYMENT_FILE)
  status=$?
  if [ $status -ne 0 ]; then
    echo $result
    exit $status
  fi

  echo $result

  return
}
