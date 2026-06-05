<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

function clear(): void {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <label class="search-box">
    <span>Recherche</span>
    <div>
      <input
        v-focus
        type="search"
        :value="modelValue"
        :placeholder="placeholder ?? 'Chercher un jeu'"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button v-if="modelValue" type="button" class="icon-button compact" aria-label="Effacer la recherche" @click="clear">×</button>
    </div>
  </label>
</template>
