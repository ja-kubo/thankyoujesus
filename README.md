# ✝️ Thank You Jesus — Spiritual Companion App

AI-powered spiritual companion inspired by the Bible. Chat with the wisdom of Jesus, read Bible, prayer journal — in **10 languages** for **5 faith traditions**.

---

## 🚀 Deploy in 3 Steps (15 min)

### Step 1 — Upload to GitHub
1. Go to https://github.com/signup → create free account
2. Go to https://github.com/new → create repo `thankyoujesus`
3. Upload all files from this folder

### Step 2 — Deploy to Vercel (free hosting)
1. Go to https://vercel.com → Sign up with GitHub
2. Click New Project → Import `thankyoujesus` repo
3. Click Deploy (Vercel builds automatically)

### Step 3 — Add API Keys in Vercel
Go to: Vercel → Project → Settings → Environment Variables

| Variable | Where to get |
|----------|-------------|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| `STRIPE_PRICE_MONTHLY` | Stripe Dashboard → Products → price_xxx |
| `STRIPE_PRICE_YEARLY` | Stripe Dashboard → Products → price_xxx |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (https://your-app.vercel.app) |

After adding → click **Redeploy**.

---

## 💳 Stripe Setup (earn money)
1. Go to https://dashboard.stripe.com → create account
2. Products → Add Product: "Thank You Jesus Premium"
3. Add 2 prices: $4.99/month and $39.99/year (recurring)
4. Copy the price_xxx IDs into Vercel env vars
5. Add your bank account to receive payouts

---

## 🧪 Run Locally
```
npm install
cp .env.example .env.local   # fill in your API keys
npm run dev                  # opens at localhost:5173
```

---

## 📱 Features
- Chat with Jesus (AI powered by Anthropic Claude)
- Bible with 8 topic categories + search
- Prayer room (save & track prayer intentions)
- Spiritual journal
- Saved/favorite verses
- 10 languages: EN ES PT IT PL DE FR RU RO SK
- 5 denominations: Catholic, Orthodox, Protestant, Ecumenical, Seeker
- Crisis support (auto-detects crisis messages, shows helplines)
- Freemium: 5 free messages/day → $4.99/month Premium

---

## 💰 Revenue Model
- Free: 5 messages/day
- Premium: $4.99/month or $39.99/year (Stripe)
- 3% conversion rate = $150/mo at 1k users, $1,500/mo at 10k users

## 📂 Structure
```
src/App.jsx         — Complete React app (all screens)
src/data.js         — All translations (10 languages) + Bible data
api/chat.js         — AI chat (Anthropic API serverless function)
api/create-checkout.js  — Stripe payment endpoint
vercel.json         — Deployment config
.env.example        — Environment variables template
```

*"Freely you have received; freely give." — Matthew 10:8*
