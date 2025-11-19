import posthog from 'posthog-js'

export const analytics = {
    // Subscription events
    trackSubscriptionCreated: (subscriptionId: string, serviceName: string, amount: number, billingCycle: string) => {
        posthog.capture('subscription_created', {
            subscription_id: subscriptionId,
            service_name: serviceName,
            amount,
            billing_cycle: billingCycle,
        })
    },

    trackSubscriptionUpdated: (subscriptionId: string, serviceName: string) => {
        posthog.capture('subscription_updated', {
            subscription_id: subscriptionId,
            service_name: serviceName,
        })
    },

    trackSubscriptionDeleted: (subscriptionId: string, serviceName: string) => {
        posthog.capture('subscription_deleted', {
            subscription_id: subscriptionId,
            service_name: serviceName,
        })
    },

    // User journey events
    trackOnboardingStarted: () => {
        posthog.capture('onboarding_started')
    },

    trackOnboardingCompleted: (subscriptionsAdded: number) => {
        posthog.capture('onboarding_completed', {
            subscriptions_added: subscriptionsAdded,
        })
    },

    // Export events
    trackDataExported: (subscriptionCount: number) => {
        posthog.capture('data_exported', {
            subscription_count: subscriptionCount,
        })
    },

    // Dashboard views
    trackDashboardViewed: (totalSpend: number, activeSubscriptions: number) => {
        posthog.capture('dashboard_viewed', {
            total_monthly_spend: totalSpend,
            active_subscriptions: activeSubscriptions,
        })
    },
}
