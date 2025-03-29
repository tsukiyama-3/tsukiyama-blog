<template>
  <div class="flex min-h-screen flex-col text-gray-800">
    <header>
      <PageHeader />
    </header>
    <main class="w-full grow max-w-[832px] mx-auto px-4">
      <slot />
    </main>
    <PageFooter />
  </div>
</template>
