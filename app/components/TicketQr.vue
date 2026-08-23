<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

const props = withDefaults(defineProps<{
  value: string
  size?: number
}>(), {
  size: 220,
})
</script>

<template>
  <div class="relative inline-block" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
    <QrcodeVue :value="props.value" :size="props.size" level="M" render-as="svg" />
    <div v-if="$slots.logo" class="absolute inset-0 flex items-center justify-center">
      <slot name="logo" />
    </div>
  </div>
</template>
