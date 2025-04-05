<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})

const codeCopied = ref<boolean>(false)

const copyCode = (): void => {
  navigator.clipboard
    .writeText(props.code)
    .then(() => {
      codeCopied.value = true
      setTimeout(function () {
        codeCopied.value = false
      }, 5000)
    })
    .catch(() => {
      console.error('Error: Unable to copy code.')
    })
}
</script>

<template>
  <div class="pre">
    <div class="pre-head">
      <div
        v-if="props.filename"
        class="filename"
      >
        <i>{{ filename }}</i>
      </div>
      <span
        v-if="codeCopied"
        class="copy-success"
      >
        <i>Copied</i>
      </span>
      <button
        class="copy-btn cursor-pointer"
        @click="copyCode"
      >
        Copy
      </button>
    </div>
    <pre
      class="pre-body text-sm md:text-base"
      :class="$props.class"
    ><slot /></pre>
  </div>
</template>

<style>
.pre {
  overflow-x: hidden;
  border-radius: 6px;
  background-color: var(--shiki-default-bg);
  border: 1px solid var(--shiki-default);
}

.pre-head {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: var(--color-gray-700);
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
}

.pre-head .filename,
.pre-head .copy-success,
.pre-head .copy-btn {
  font-family: Arial, sans-serif;
  font-size: 0.8rem;
  color: var(--color-gray-50);
  opacity: 0.5;
}

.pre-head .filename {
  margin-left: 0;
  margin-right: auto;
}

.pre-head .copy-success,
.pre-head .copy-btn {
  padding: 0.25em 0.75em;
  border: 1px solid transparent;
  border-radius: 4px;
}

.pre-head .copy-success {
  color: var(--color-blue-300);
  border-color: transparent;
}

.pre-head .copy-btn {
  background-color: inherit;
  border-color: var(--shiki-default);
}

.pre-head .copy-btn:hover,
.pre-head .copy-btn:active {
  color: var(--color-blue-300);
  border-color: var(--color-blue-300);
}

.pre-body {
  margin: 0;
  background-color: var(--color-gray-800);
  padding: 0.75rem 0 0.75rem 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow-x: auto;
}

.pre-body code {
  display: inline-block;
  width: 100%;
}

.pre-body .line {
  padding: 0 0.75rem;
  line-height: 1.6;
}

.pre-body .line span {
  background-color: transparent !important;
}

.pre-body .line.highlight,
.pre-body .line.highlighted {
  background-color: color-mix(in srgb, var(--shiki-default-bg) 70%, #888888);
}

.pre-body .line::before {
  content: attr(line);
  color: var(--color-gray-50);
  padding-right: 1.25rem;
  display: inline-block;
  opacity: 0.8;
}

.pre-body .line.diff.remove {
  background-color: color-mix(in srgb, var(--shiki-default-bg) 65%, #f43f5e);
}

.pre-body .line.diff.add {
  background-color: color-mix(in srgb, var(--shiki-default-bg) 75%, #10b981);
}

pre code .line {
  display: block;
}
</style>
