<script setup lang="ts">
import { usePlotsConfig } from '~/composables/useTicketConfig'

const config = usePlotsConfig()
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div class="relative flex items-center justify-center px-4 py-4">
      <button class="absolute left-4 text-2xl" aria-label="Back">&lsaquo;</button>
      <h1 class="text-lg font-semibold text-neutral-300">My Tickets</h1>
    </div>

    <div class="flex items-center gap-3 px-4">
      <div class="flex w-14 flex-col overflow-hidden rounded-lg border border-blue-500 text-center text-xs">
        <div class="py-1 text-blue-400">Aug</div>
        <div class="bg-blue-600 py-1 font-semibold">23</div>
      </div>
      <img v-if="config.imageDataUrl" :src="config.imageDataUrl" :alt="config.eventTitle" class="h-14 w-14 rounded-md object-cover" />
      <div v-else class="h-14 w-14 rounded-md bg-neutral-800" />
      <p class="flex-1 text-sm text-neutral-400">{{ config.eventTitle }}</p>
    </div>

    <p class="mt-8 px-4 text-lg font-bold">{{ config.eventTitle }}</p>

    <div class="relative mx-4 mb-8 mt-4">
      <div class="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-black" />
      <div class="rounded-2xl bg-white p-8 text-center text-black">
        <p class="text-base font-semibold">{{ config.ticketTitle }}</p>
        <div class="mt-6 flex justify-center">
          <TicketQr value="https://partypooper.app/t/plots-demo" :size="220" />
        </div>
      </div>
      <div class="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-black" />
    </div>
  </div>
</template>
