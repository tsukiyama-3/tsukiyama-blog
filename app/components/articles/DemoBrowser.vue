<template>
  <div class="border-gray-300 border rounded-md overflow-hidden dark:border-neutral-700">
    <div class="bg-gray-300 py-3 dark:bg-neutral-700">
      <p class="bg-white px-4 text-gray-600 py-2 w-8/12 rounded-full mx-auto leading-none dark:text-highlighted dark:bg-neutral-800">
        https://localhost:3000
      </p>
    </div>
    <div class="pt-8 px-4 pb-4 dark:bg-neutral-800 dark:text-highlighted">
      <slot />
    </div>
  </div>
</template>
