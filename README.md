# WorkPol (Expo SDK 54)

## Run
```
nvm use 20.19.4
npm install
npx expo start --tunnel
```
Scan the QR code with Expo Go (SDK 54).

## Structure
- app/(tabs)/  Home, Jobs (filters), AI Match, Swipe, Profile
- app/job/[id].js  Job detail + apply
- app/post.js, dashboard.js, alerts.js, pricing.js, auth.js
- src/data/jobs.js  JOBS, REGIONS, INDUSTRIES, PLANS (edit listings here)
- src/context/AppContext.js  theme, saved/applied, alerts, posted jobs, demo auth (AsyncStorage)
- src/theme/colors.js  design tokens from the web app
