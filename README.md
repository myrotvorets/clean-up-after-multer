# clean-up-after-multer

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=myrotvorets_clean-up-after-multer&metric=alert_status)](https://sonarcloud.io/dashboard?id=myrotvorets_clean-up-after-multer)
[![Build and Test](https://github.com/myrotvorets/clean-up-after-multer/actions/workflows/build.yml/badge.svg)](https://github.com/myrotvorets/clean-up-after-multer/actions/workflows/build.yml)

Express.js middleware to clean up uploaded files after multer

# Usage

```typescript
import express from 'express';
import { cleanUploadedFilesMiddleware } from '@myrotvorets/clean-up-after-multer'


const app = express();
app.use(/* your middlewares here */);
app.use(cleanUploadedFilesMiddleware());
```

Make sure to call `next()` from your middlewares.

`cleanUploadedFilesMiddleware()` accepts an argument of type `(path: string) => Promise<unknown>` to specify the custom `unlink()` function (in case you want to log unlink failures etc).
