# App Runner IAM note

For the backend, use an App Runner instance role with permission to invoke the Bedrock model selected in `BEDROCK_MODEL_ID`.

Keep credentials out of `.env` in production. Prefer the App Runner instance role / AWS SDK default credential chain.
