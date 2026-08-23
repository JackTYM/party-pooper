<script setup lang="ts">
import { usePoshConfig } from '~/composables/useTicketConfig'

const config = usePoshConfig()
</script>

<template>
  <div class="bg-black">
    <div class="mx-auto max-w-md p-4">
      <TicketConfigForm v-model="config" />
    </div>
    <PoshTicket />
  </div>
</template>
