# Mobile Deployment Guide

## Run locally

```bash
cd mobile
npm install
npx expo start
```

Scan the QR in the **Expo Go** app on your phone.

---

## Push an update (do this whenever you make changes)

```bash
cd mobile
npx eas-cli update --branch preview --message "describe what changed"
```

Then go to [expo.dev](https://expo.dev) → `promptPOC-mobile` → **Over-the-air updates** → click the update → scan the QR in Expo Go.

The QR stays the same — anyone who scanned it before gets the new version automatically.

---

## First-time setup (already done — for reference only)

1. Install EAS CLI: `npm install -g eas-cli`
2. Log in: `npx eas-cli login` (account: michellevava26)
3. Link project: `npx eas-cli init` inside `mobile/` — adds `projectId` to `app.json`
4. Push first update: `npx eas-cli update --branch preview --message "initial"`

Expo project: `@michellevava26/promptPOC-mobile`
