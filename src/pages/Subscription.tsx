import React from 'react'
import { Check, Crown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BackButton from '@/components/ui/BackButton'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 Resume',
      'Basic Templates',
      'PDF Download',
      'Basic ATS Check',
      'Community Support',
    ],
    limitations: [
      'Limited customization',
      'Watermarked downloads',
      'Basic interview prep',
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    description: 'Best for job seekers',
    features: [
      'Unlimited Resumes',
      'Premium Templates',
      'Advanced ATS Optimization',
      'AI-Powered Suggestions',
      'Cover Letter Generator',
      'Interview Prep with AI Feedback',
      'Priority Support',
      'No Watermarks',
    ],
    limitations: [],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: 'month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team Management',
      'Bulk Resume Creation',
      'Custom Branding',
      'Advanced Analytics',
      'API Access',
      'Dedicated Support',
      'Custom Integrations',
    ],
    limitations: [],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    popular: false,
  },
]

export default function Subscription() {
  const handleUpgrade = (planName: string) => {
    if (planName === 'Enterprise') {
      // Handle contact sales
      console.log('Contact sales for Enterprise plan')
    } else if (planName === 'Pro') {
      // Handle Stripe checkout
      console.log('Redirect to Stripe checkout for Pro plan')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered resume building and interview preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Crown className="h-4 w-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">Limitations:</p>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  variant={plan.buttonVariant}
                  className="w-full mt-6"
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.name === 'Free'}
                >
                  {plan.name === 'Pro' && <Zap className="h-4 w-4 mr-2" />}
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, MasterCard, American Express) and PayPal through our secure Stripe payment processor.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial for Pro features?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer a 7-day free trial for all Pro features. No credit card required to start your trial.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the AI feedback work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI analyzes your resume content, interview answers, and provides personalized suggestions based on industry best practices and ATS optimization techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}