import { ref, type Ref } from 'vue'

export interface ValidateField {
  validate: () => Promise<void>
}

export function useValidateField() {
  return ref() as Ref<ValidateField>
}
