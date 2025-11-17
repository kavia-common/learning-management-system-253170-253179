#!/bin/bash
cd /home/kavia/workspace/code-generation/learning-management-system-253170-253179/lms_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

