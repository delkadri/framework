<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number
  max?: number
  label?: string
}>(), {
  max: 5,
  label: 'Note personnelle',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function setRating(value: number): void {
  emit('update:modelValue', props.modelValue === value ? 0 : value)
}
</script>

<template>
  <fieldset class="rating-input">
    <legend>{{ label }}</legend>
    <button
      v-for="value in max"
      :key="value"
      type="button"
      :class="{ active: value <= modelValue }"
      :aria-label="`${value} sur ${max}`"
      @click="setRating(value)"
    >
      ★
    </button>
  </fieldset>
</template>
