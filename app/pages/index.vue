<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-white">
    <h1 class="text-3xl font-bold">PartyPooper</h1>
    <div class="flex w-full max-w-xs flex-col gap-4">
      <NuxtLink to="/posh" class="rounded-2xl bg-neutral-900 px-6 py-8 text-center text-xl font-semibold">
        Posh
      </NuxtLink>
      <NuxtLink to="/plots" class="rounded-2xl bg-neutral-900 px-6 py-8 text-center text-xl font-semibold">
        Plots
      </NuxtLink>
    </div>
  </div>
</template>
