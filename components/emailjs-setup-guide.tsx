"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailJSSetupGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            EmailJS Setup Guide - Free Email Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              Create EmailJS Account
            </h3>
            <p className="text-sm text-muted-foreground">
              Sign up for a free account at EmailJS (supports Gmail, Yahoo, Outlook, etc.)
            </p>
            <Button
              variant="outline"
              onClick={() => window.open("https://www.emailjs.com/", "_blank")}
              className="w-fit"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to EmailJS.com
            </Button>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              Add Email Service
            </h3>
            <p className="text-sm text-muted-foreground">Connect your email provider (Gmail, Yahoo, Outlook, etc.)</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Popular Services:</p>
              <ul className="text-sm space-y-1">
                <li>
                  • <strong>Gmail:</strong> Use your Gmail account (most popular)
                </li>
                <li>
                  • <strong>Yahoo:</strong> Connect Yahoo Mail
                </li>
                <li>
                  • <strong>Outlook:</strong> Microsoft Outlook/Hotmail
                </li>
                <li>
                  • <strong>Custom SMTP:</strong> Any email provider
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              Create Email Template
            </h3>
            <p className="text-sm text-muted-foreground">Design your email template with these variables</p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <p className="font-semibold mb-2">Template Content:</p>
              <div className="space-y-1">
                <p>Subject: New Contact from Portfolio - {`{{from_name}}`}</p>
                <p>
                  From: {`{{from_name}}`} ({`{{from_email}}`})
                </p>
                <p>Message: {`{{message}}`}</p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              Get Your Credentials
            </h3>
            <p className="text-sm text-muted-foreground">Copy these values from your EmailJS dashboard</p>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Service ID</label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm flex-1">service_xxxxxxx</code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("EMAILJS_SERVICE_ID")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Template ID</label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm flex-1">template_xxxxxxx</code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("EMAILJS_TEMPLATE_ID")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Public Key</label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm flex-1">user_xxxxxxxxxxxxxxx</code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("EMAILJS_PUBLIC_KEY")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline">5</Badge>
              Add Environment Variables
            </h3>
            <p className="text-sm text-muted-foreground">Add these to your Vercel project settings</p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span>EMAILJS_SERVICE_ID</span>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard("EMAILJS_SERVICE_ID")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>TEMPLATE_ID</span>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard("TEMPLATE_ID")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>EMAILJS_PUBLIC_KEY</span>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard("EMAILJS_PUBLIC_KEY")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Why EmailJS?</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>
                ✅ <strong>Free tier:</strong> 200 emails/month
              </li>
              <li>
                ✅ <strong>No custom domain required:</strong> Use Gmail, Yahoo, etc.
              </li>
              <li>
                ✅ <strong>Easy setup:</strong> No server-side code needed
              </li>
              <li>
                ✅ <strong>Reliable:</strong> Handles email delivery automatically
              </li>
              <li>
                ✅ <strong>Secure:</strong> No API keys exposed to client
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
