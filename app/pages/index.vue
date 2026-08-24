<script setup lang="ts">
import { usePlotsConfig, usePoshConfig } from '~/composables/useTicketConfig'

const poshConfig = usePoshConfig()
const plotsConfig = usePlotsConfig()
</script>

<template>
  <div class="min-h-screen bg-black px-6 py-10 text-white">
    <h1 class="text-center text-3xl font-bold">PartyPooper</h1>

    <div class="mx-auto mt-8 flex max-w-md flex-col gap-4">
      <NuxtLink to="/posh" class="rounded-2xl bg-neutral-900 px-6 py-8 text-center text-xl font-semibold">
        Posh
      </NuxtLink>
      <TicketConfigForm v-model="poshConfig" />
    </div>

    <div class="mx-auto mt-8 flex max-w-md flex-col gap-4">
      <NuxtLink to="/plots" class="rounded-2xl bg-neutral-900 px-6 py-8 text-center text-xl font-semibold">
        Plots
      </NuxtLink>
      <TicketConfigForm v-model="plotsConfig" />
    </div>
  </div>
</template>
