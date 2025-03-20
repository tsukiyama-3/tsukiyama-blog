<template>
  <div class="flex min-h-screen flex-col text-gray-800">
    <header>
      <PageHeader />
    </header>
    <main class="w-full grow">
      <slot />
    </main>
    <PageFooter />
  </div>
</template>
