# QuoteXbert: Retention Features (PICK ONE, SHIP FAST)

## 🎯 THE PROBLEM

Users get estimate → leave → never come back.

**Solution:** Give them a reason to return.

Pick ONE feature. Ship it this week. Don't overcomplicate.

---

## 🔥 OPTION 1: PRICE TRACKING (RECOMMENDED)

**What it does:**
Shows users how prices change over time for their project.

**Why it works:**
- Creates FOMO ("Prices went up 8% this month!")
- Gives them a reason to check back
- Positions you as pricing authority

### Implementation (2-3 hours)

1. **Save every estimate**
   - Store: project_type, price_low, price_high, postal_code, created_at
   - Anonymous (no auth required)

2. **Show price trends**
   - On estimate results page:
     ```
     ┌─────────────────────────────────────┐
     │ 📊 Price Trend Alert                │
     │                                      │
     │ Drywall repair in M4C:              │
     │ This month: $350-$650                │
     │ Last month: $320-$580 (+9%)         │
     │                                      │
     │ 💡 Prices are rising. Act soon.     │
     └─────────────────────────────────────┘
     ```

3. **Email follow-up (optional)**
   - "Prices for [project type] just increased by X%"
   - "Your saved estimate may be outdated — check new pricing"

### Copy for Homepage

Add this to your estimate results:

```tsx
<div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mt-6">
  <div className="flex items-start gap-4">
    <div className="text-4xl">📊</div>
    <div>
      <h3 className="font-bold text-lg text-amber-900 mb-2">
        Prices Are Changing
      </h3>
      <p className="text-amber-800 mb-3">
        Drywall repair costs in your area went up <strong>9% this month</strong>. 
        If you're serious, act soon.
      </p>
      <button className="text-sm text-amber-700 underline hover:text-amber-900">
        See price history →
      </button>
    </div>
  </div>
</div>
```

---

## 🏠 OPTION 2: SAVED HOMES (MULTI-PROPERTY OWNERS)

**What it does:**
Let users save multiple properties and track projects for each.

**Why it works:**
- Landlords have 3-5+ properties
- They're constantly pricing repairs
- Sticky retention (all their data is in your app)

### Implementation (3-4 hours)

1. **Add "Save Property" button**
   - After estimate: "Save this estimate to [Property Name]"
   - Store: address, nickname, estimates[]

2. **Property Dashboard**
   - Show all saved properties
   - Show all estimates per property
   - Show total spent/estimated per property

### Copy for Homepage

Add after estimate results:

```tsx
<div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
  <div className="flex items-start gap-4">
    <div className="text-4xl">🏠</div>
    <div>
      <h3 className="font-bold text-lg text-blue-900 mb-2">
        Multiple Properties?
      </h3>
      <p className="text-blue-800 mb-3">
        Save this estimate to a property. Track all your renovation costs in one place.
      </p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Save to Property
      </button>
    </div>
  </div>
</div>
```

---

## 🚨 OPTION 3: OVERPRICING DETECTOR (HIGHEST IMPACT)

**What it does:**
Let users paste/upload contractor quotes. You tell them if they're getting ripped off.

**Why it works:**
- Clear value ("You're being overcharged by $2,400")
- Viral ("Share this with anyone getting quotes")
- Makes you the authority

### Implementation (4-5 hours)

1. **Add "Compare Your Quote" page**
   - Let users paste contractor quote text OR upload quote PDF
   - Parse it (manual or AI)
   - Compare to your estimate

2. **Show Verdict**
   ```
   ┌─────────────────────────────────────┐
   │ ⚠️ OVERPRICING ALERT                │
   │                                      │
   │ Your Quote: $8,500                  │
   │ Fair Range: $5,800-$7,200           │
   │                                      │
   │ You're being overcharged by $1,300  │
   │                                      │
   │ [Download Report] [Get Better Bids] │
   └─────────────────────────────────────┘
   ```

3. **Make it shareable**
   - "Is your quote fair? Check here: [URL]"
   - Goes viral on Facebook groups

### Copy for Homepage

Add this as PRIMARY CTA:

```tsx
<section className="py-16 bg-gradient-to-r from-red-600 to-orange-600">
  <div className="max-w-4xl mx-auto px-4 text-center text-white">
    <h2 className="text-5xl font-black mb-4">
      Already Have a Quote?
    </h2>
    <p className="text-2xl mb-8">
      Paste it here. We'll tell you if you're getting ripped off.
    </p>
    <button className="bg-white text-red-600 px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
      Check My Quote →
    </button>
  </div>
</section>
```

---

## 📧 EMAIL LOOP (ADDS 2X RETENTION)

Once you have ANY of the above, add simple emails:

### Email 1: Price Update (Weekly)
**Subject:** "Renovation prices in Toronto just increased"

**Body:**
```
Hi,

Bad news: Drywall repair prices went up 9% this month in the GTA.

If you saved an estimate with QuoteXbert, it might be outdated.

Check updated pricing: [URL]

QuoteXbert
Toronto's Renovation Price Authority
```

### Email 2: Seasonal Reminder (Monthly)
**Subject:** "Spring is the worst time to hire contractors"

**Body:**
```
Prices spike 15-20% in April-June (everyone wants work done).

If you can wait until September-November, you'll save big.

But if you need work done now, check current pricing:

[URL]

QuoteXbert
```

### Email 3: Saved Estimate Reminder (After 7 days)
**Subject:** "Did you hire someone for your [project type]?"

**Body:**
```
You got an estimate from QuoteXbert last week.

Curious — did you end up hiring someone?

If not, here's your saved estimate: [URL]

If yes, we'd love to hear how it went (1-min survey): [URL]

Thanks,
QuoteXbert Team
```

---

## 🎯 WHICH ONE TO BUILD?

**If you want fast growth:**  
→ Overpricing Detector (most viral)

**If you want sticky retention:**  
→ Saved Homes (landlords will live in your app)

**If you want authority positioning:**  
→ Price Tracking (makes you the data source)

**My recommendation:**  
Start with **Overpricing Detector**. It's the easiest to market and goes viral naturally.

---

## ✅ SHIP CHECKLIST

- [ ] Pick ONE feature
- [ ] Build it in 1-2 days max
- [ ] Add CTA to homepage
- [ ] Add to estimate results page
- [ ] Write 3 email templates
- [ ] Set up email automation (Mailchimp, SendGrid, etc.)
- [ ] Track return users in analytics

**Don't overthink. Ship fast. Iterate.**

---

## 📊 SUCCESS METRICS

After 2 weeks:
- **Target:** 15% of users return within 7 days
- **Target:** 5% use retention feature
- **Target:** 50+ email opens (if you capture emails)

If you hit these, retention is working. Double down.

---

Let's make QuoteXbert sticky. 🚀
