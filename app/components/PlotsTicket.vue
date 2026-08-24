<script setup lang="ts">
import { usePlotsConfig } from '~/composables/useTicketConfig'

const config = usePlotsConfig()
</script>

<template>
  <div class="relative min-h-dvh overflow-hidden bg-black text-white">
    <div
      class="absolute inset-0 scale-110 bg-cover bg-top blur-2xl brightness-50"
      style="background-image: url('/plots-backdrop.jpg')"
    />
    <div class="absolute inset-0 bg-black/30" />

    <div class="relative flex min-h-dvh flex-col">
      <div class="px-4 py-4">
        <NuxtLink to="/" class="text-3xl leading-none" aria-label="Close">&times;</NuxtLink>
      </div>

      <div class="mt-28 flex flex-col items-center px-10">
        <div class="w-full max-w-xs rounded-[2rem] bg-white p-8">
          <TicketQr value="https://partypooper.app/t/plots-demo" :size="240" />
        </div>
        <p class="mt-6 w-full max-w-xs truncate text-center text-lg font-bold">
          {{ config.eventTitle }}
        </p>
        <p class="mt-1 text-center text-neutral-300">{{ config.ticketTitle }}</p>
      </div>
    </div>
  </div>
</template>
