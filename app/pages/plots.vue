<script setup lang="ts">
import { usePlotsConfig } from '~/composables/useTicketConfig'

const config = usePlotsConfig()
</script>

<template>
  <div class="bg-black">
    <div class="mx-auto max-w-md p-4">
      <TicketConfigForm v-model="config" />
    </div>
    <PlotsTicket />
  </div>
</template>
