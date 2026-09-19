# AWS deployment order

1. Deploy `frontend` with Amplify Hosting.
2. Deploy `backend` with App Runner as a Node.js service.
3. Give the App Runner instance an IAM role that can invoke the chosen Bedrock model.
4. Set `NEXT_PUBLIC_API_BASE_URL` in Amplify to the App Runner URL.
5. Set backend environment variables in App Runner and verify `/health`.
6. Record the final deployed URL and a signed-out-accessible 3-minute YouTube demo.
