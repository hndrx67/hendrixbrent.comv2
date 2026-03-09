# interactive-ba

Minimal Next.js scaffold for an interactive Blue Archive tierlist with MongoDB auth.

Quick start:

```powershell
cd interactive-ba
npm install
# set env vars in .env.local for local dev:
# MONGODB_URI=your_mongo_uri
# JWT_SECRET=some_long_random_secret
npm run dev
```

Env vars (set on Vercel for production):
- `MONGODB_URI`
- `JWT_SECRET`

Files of interest:
- `lib/db.js` - Mongoose connection helper
- `models/User.js`, `models/TierEntry.js` - DB models
- `pages/api/auth/*` - register/login/logout
- `pages/api/tierlist/*` - tierlist CRUD
- `pages/dashboard.js` - protected admin UI
- `pages/index.js` - public viewer
