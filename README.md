# 👕 Apparel — AI-Powered Fashion Stylist App

A full-stack mobile app that gives users personalized outfit recommendations using an agentic Claude AI backend.

## Stack
- **Mobile**: React Native + Expo
- **Auth**: AWS Cognito
- **API**: AWS API Gateway + Lambda (Node.js)
- **Database**: DynamoDB
- **Storage**: AWS S3
- **AI**: Claude API (Anthropic) — agentic tool-use pattern
- **Trends**: PyTrends (Google Trends)

## Project Structure

```
fashion-app/
├── mobile/          # React Native (Expo) app
│   └── src/
│       ├── screens/        # App screens
│       ├── components/     # Reusable UI components
│       ├── navigation/     # React Navigation setup
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API calls to backend
│       └── utils/          # Helpers
│
├── backend/
│   ├── lambdas/
│   │   ├── survey/         # POST /survey — save quiz answers
│   │   ├── recommend/      # POST /recommend — agentic Claude stylist
│   │   ├── trends/         # GET /trends — scheduled trend fetcher
│   │   └── wardrobe/       # POST /wardrobe/upload — S3 presigned URL
│   ├── shared/             # Shared DB helpers, Claude client
│   └── infra/              # AWS CDK or SAM config
│
└── docs/                   # Architecture diagrams, notes
```

## Build Order
1. **Auth** — Cognito + login screen
2. **Survey** — quiz UI + save to DynamoDB
3. **Recommendations** — agentic Lambda → Claude API ← *core feature*
4. **Trends** — scheduled Lambda (EventBridge)
5. **Wardrobe Upload** — S3 presigned URLs

## Getting Started

```bash
# Install mobile dependencies
cd mobile && npm install

# Run on simulator
npx expo start

# Deploy a Lambda (from backend/)
cd backend/lambdas/recommend
npm install && npm run deploy
```

## Cost Estimate (early stage)
| Service | Cost |
|---|---|
| AWS Lambda + API Gateway + DynamoDB | ~Free (free tier) |
| S3 | ~$0.023/GB |
| Claude API | ~$0.003/recommendation |
| **Total (first ~500 users)** | **< $5/month** |
