<template>
  <div class="flex min-h-screen flex-col">
    <header>
      <h1>Header</h1>
    </header>
    <main class="w-full grow">
      <slot />
    </main>
    <footer>
      Footer
    </footer>
  </div>
</template>
