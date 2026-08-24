<script setup lang="ts">
import { usePoshConfig } from '~/composables/useTicketConfig'

const config = usePoshConfig()
const price = computed(() => `$${Number(config.value.price || 0).toFixed(2)}`)
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div class="relative flex items-center justify-center px-4 py-4">
      <button class="absolute left-4 text-2xl" aria-label="Back">&lsaquo;</button>
      <h1 class="text-lg font-semibold">Order #33883562</h1>
    </div>

    <div class="mx-4 rounded-2xl bg-white p-6 text-center text-black">
      <h2 class="text-xl font-bold uppercase">{{ config.eventTitle }}</h2>
      <p class="mt-1 text-sm text-neutral-500">Aug 26th at 6PM</p>

      <div class="mt-6 flex justify-center">
        <TicketQr value="https://partypooper.app/t/posh-33883562" :size="220">
          <template #logo>
            <div class="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-black bg-white text-sm font-bold">
              (P)
            </div>
          </template>
        </TicketQr>
      </div>

      <p class="mt-4 text-sm font-medium">#33883562</p>
    </div>

    <div class="mx-4 mt-6 rounded-2xl bg-neutral-900 p-4">
      <h3 class="text-xl font-bold">Breakdown</h3>
      <div class="mt-3 flex items-center justify-between text-sm">
        <span>{{ config.ticketTitle }}</span>
        <span class="text-neutral-400">x1</span>
        <span>{{ price }}</span>
      </div>
      <div class="my-3 border-t border-neutral-700" />
      <div class="flex items-center justify-between font-bold">
        <span>Total</span>
        <span>{{ price }}</span>
      </div>
    </div>

    <div class="mx-4 mt-4 divide-y divide-neutral-800 rounded-2xl bg-neutral-900">
      <div class="flex items-center justify-between px-4 py-4">
        <span>View event</span>
        <span>&rsaquo;</span>
      </div>
      <div class="flex items-center justify-between px-4 py-4">
        <span>View order confirmation</span>
        <span>&rsaquo;</span>
      </div>
    </div>

    <div class="mx-4 mb-8 mt-4 divide-y divide-neutral-800 rounded-2xl bg-neutral-900">
      <div class="px-4 py-4">Add to calendar</div>
      <div class="px-4 py-4">Add to Apple Wallet</div>
    </div>
  </div>
</template>
