# clean-up-after-multer

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=myrotvorets_clean-up-after-multer&metric=alert_status)](https://sonarcloud.io/dashboard?id=myrotvorets_clean-up-after-multer)
![Build and Test CI](https://github.com/myrotvorets/clean-up-after-multer/workflows/Build%20and%20Test%20CI/badge.svg)
[![codebeat badge](https://codebeat.co/badges/6b4170d0-a573-40bf-b9bb-2e2d6701247a)](https://codebeat.co/projects/github-com-myrotvorets-clean-up-after-multer-master)

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
