<script setup lang="ts">
import type { TicketConfig } from '~/composables/useTicketConfig'

const config = defineModel<TicketConfig>({ required: true })

function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    config.value.imageDataUrl = reader.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="space-y-4 rounded-xl bg-neutral-900 p-4 text-white">
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-image">Image</label>
      <input id="config-image" type="file" accept="image/*" class="block w-full text-sm" @change="onImageChange" />
    </div>
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-price">Price</label>
      <input id="config-price" v-model.number="config.price" type="number" min="0" step="0.01" class="w-full rounded-md bg-neutral-800 px-3 py-2" />
    </div>
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-event-title">Event title</label>
      <input id="config-event-title" v-model="config.eventTitle" type="text" class="w-full rounded-md bg-neutral-800 px-3 py-2" />
    </div>
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-ticket-title">Ticket title</label>
      <input id="config-ticket-title" v-model="config.ticketTitle" type="text" class="w-full rounded-md bg-neutral-800 px-3 py-2" />
    </div>
  </div>
</template>
