# Environment Variables

The following environment variables are required for the application:

| Variable              | Type    | Description                                   |
|-----------------------|---------|-----------------------------------------------|
| PORT                  | number  | Application port                              |
| REDIS_URL             | string  | The Redis URL                                 |
| REDIRECT_URL_OPEN     | string  | Your service url + path (bypass rate-limit)   |
| REDIRECT_URL_SECURE   | string  | Your service url + path (enforced rate-limit) |
| WEEK_STARTS_ON_SUNDAY | boolean | Whether to count sunday as start of new week  |

## Setup Instructions

1. Create a new `.env` file in the root directory
2. Copy the variables above and set their values according to your environment
3. The `.env` file should not be committed to version control

### Example

See [`.env.source.example`](.env.source.example) file for reference
