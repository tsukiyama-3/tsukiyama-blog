<template>
  <div class="flex min-h-screen flex-col text-gray-800">
    <PageHeader />
    <UMain class="w-full grow max-w-[1200px] mx-auto p-4">
      <slot />
    </UMain>
    <PageFooter />
  </div>
</template>
