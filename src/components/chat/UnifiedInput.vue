<template>
  <div class="unified-input-container">
    <div class="input-wrapper">
      <el-input
        v-model="inputText"
        type="textarea"
        placeholder="输入你的问题，将发送给所有已选择的 AI..."
        :rows="3"
        resize="none"
        @keydown.ctrl.enter="sendMessage"
        @keydown.meta.enter="sendMessage"
      />
    </div>

    <div class="button-group">
      <el-button
        type="primary"
        icon="Send"
        :disabled="!inputText.trim() || selectedProviders.length === 0"
        @click="sendMessage"
      >
        发送给全部 ({{ selectedProviders.length }})
      </el-button>
      <el-button @click="clearInput">清空</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: string;
  selectedProviders: string[];
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'send', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inputText = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const sendMessage = () => {
  if (inputText.value.trim() && props.selectedProviders.length > 0) {
    emit('send', inputText.value);
    inputText.value = '';
  }
};

const clearInput = () => {
  inputText.value = '';
};
</script>

<style scoped lang="css">
.unified-input-container {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px;
  gap: 8px;
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  flex: 1;
}

.button-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

:deep(.el-textarea__inner) {
  font-size: 14px;
}
</style>
