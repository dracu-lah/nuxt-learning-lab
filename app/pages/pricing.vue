<!--
  /pricing — Pricing + FAQ in a single tabbed page.

  The user can switch between "Plans" and "FAQ" without a route change,
  but the active tab is mirrored to `?tab=faq` so the URL is shareable
  and the browser back button works the way you'd expect.
-->
<template>
  <div class="space-y-8">
    <div class="text-center space-y-3">
      <h1 class="text-4xl font-bold tracking-tight">{{ $t('pricing.title') }}</h1>
      <p class="text-(--ui-text-muted) max-w-xl mx-auto">{{ $t('pricing.subtitle') }}</p>
    </div>

    <UTabs v-model="tab" :items="tabs" class="w-full">
      <!-- Plans -->
      <template #plans>
        <div class="grid md:grid-cols-3 gap-4 pt-6">
          <UCard
            v-for="plan in plans"
            :key="plan.id"
            :class="['relative', plan.popular && 'ring-2 ring-(--ui-primary)']"
          >
            <template #header>
              <img
                :src="plan.image"
                :alt="plan.name"
                class="aspect-[3/2] w-full object-cover -m-4 mb-2 max-w-none"
              />
              <UBadge
                v-if="plan.popular"
                class="absolute top-3 end-3"
                color="primary"
                variant="solid"
              >
                {{ $t('pricing.popular') }}
              </UBadge>
            </template>

            <h3 class="text-2xl font-bold">{{ plan.name }}</h3>
            <p class="text-sm text-(--ui-text-muted)">{{ plan.desc }}</p>
            <p class="text-4xl font-mono font-bold pt-3">
              {{ plan.price }}<span class="text-base text-(--ui-text-muted)">{{ $t('pricing.perMonth') }}</span>
            </p>

            <ul class="space-y-2 pt-4 text-sm">
              <li
                v-for="feat in plan.features"
                :key="feat"
                class="flex items-center gap-2"
              >
                <UIcon name="i-lucide-check" class="text-(--ui-primary)" />
                <span>{{ feat }}</span>
              </li>
            </ul>

            <template #footer>
              <UButton
                block
                :variant="plan.popular ? 'solid' : 'outline'"
                :icon="plan.popular ? 'i-lucide-rocket' : 'i-lucide-arrow-right'"
              >
                {{ $t('pricing.cta') }}
              </UButton>
            </template>
          </UCard>
        </div>
      </template>

      <!-- FAQ -->
      <template #faq>
        <div class="max-w-2xl mx-auto pt-6">
          <UAccordion :items="faqItems" />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Pricing · Nuxt Learning Lab' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// Tab state lives in the URL so it's shareable.
const tab = computed({
  get: () => (route.query.tab as string) || 'plans',
  set: (v: string) => router.replace({ query: { ...route.query, tab: v } })
})

const tabs = computed(() => [
  { label: t('pricing.tab.plans'), slot: 'plans', icon: 'i-lucide-credit-card' },
  { label: t('pricing.tab.faq'),   slot: 'faq',   icon: 'i-lucide-help-circle' }
])

// Unsplash photo IDs — stable, no API key needed.
const plans = computed(() => [
  {
    id: 'free',
    name: t('pricing.free.name'),
    desc: t('pricing.free.desc'),
    price: '$0',
    popular: false,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    features: [
      t('pricing.feat.community'),
      t('pricing.feat.upTo3'),
      t('pricing.feat.basicSupport')
    ]
  },
  {
    id: 'pro',
    name: t('pricing.pro.name'),
    desc: t('pricing.pro.desc'),
    price: '$19',
    popular: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    features: [
      t('pricing.feat.everythingFree'),
      t('pricing.feat.unlimited'),
      t('pricing.feat.prioritySupport'),
      t('pricing.feat.analytics')
    ]
  },
  {
    id: 'business',
    name: t('pricing.business.name'),
    desc: t('pricing.business.desc'),
    price: '$49',
    popular: false,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
    features: [
      t('pricing.feat.everythingPro'),
      t('pricing.feat.sso'),
      t('pricing.feat.audit'),
      t('pricing.feat.sla')
    ]
  }
])

const faqItems = computed(() => [
  { label: t('faq.q1.q'), icon: 'i-lucide-zap',         content: t('faq.q1.a') },
  { label: t('faq.q2.q'), icon: 'i-lucide-credit-card', content: t('faq.q2.a') },
  { label: t('faq.q3.q'), icon: 'i-lucide-shield',      content: t('faq.q3.a') },
  { label: t('faq.q4.q'), icon: 'i-lucide-globe',       content: t('faq.q4.a') },
  { label: t('faq.q5.q'), icon: 'i-lucide-life-buoy',   content: t('faq.q5.a') }
])
</script>
