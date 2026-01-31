# Supabase Deployment Guide

To get the email verification working, you need to deploy the Supabase Edge Function and configure the email service (Resend).

## Prerequisites

1.  **Resend API Key**:
    *   Go to [resend.com](https://resend.com) and create a free account.
    *   Create an API Key.
    *   Copy the key (starts with `re_`).

## Deployment Steps

Since I installed the Supabase CLI locally for you, run these commands in your terminal:

### 1. Login to Supabase
```bash
npx supabase login
```
*   This will open your browser. Click "Confirm" to log in.

### 2. Link Your Project
Run this command to link your local code to your specific Supabase project:

```bash
npx supabase link --project-ref tjvenykbssfojlrhdvvc
```
*   Enter your database password if prompted.

### 3. Set the API Key
Store your Resend API key securely in Supabase:

```bash
npx supabase secrets set RESEND_API_KEY=re_123456789...
```
*   Replace `re_123456789...` with your actual Resend API Key.

### 4. Deploy the Function
Upload the email code to Supabase:

```bash
npx supabase functions deploy send-verification-email
```

## Troubleshooting

If you see verification emails failing, check the function logs:
```bash
npx supabase functions logs --function-id send-verification-email
```
