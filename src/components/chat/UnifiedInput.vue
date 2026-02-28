<template>
  <div class="unified-input-container">
    <div class="input-wrapper">
      <div class="input-section">
        <el-input
          v-model="inputText"
          type="textarea"
          placeholder="📝 输入你的问题，将发送给所有已选择的 AI..."
          :rows="3"
          resize="none"
          @keydown.ctrl.enter="sendMessage"
          @keydown.meta.enter="sendMessage"
        />
      </div>

      <div class="actions-row">
        <div class="status-info">
          <span v-if="selectedProviders.length > 0" class="provider-count">
            已选择 {{ selectedProviders.length }} 个 AI
          </span>
          <span v-else class="provider-count warning">
            请先选择至少一个 AI
          </span>
        </div>

        <div class="button-group">
          <el-button
            type="primary"
            icon="Send"
            :disabled="!inputText.trim() || selectedProviders.length === 0"
            @click="sendMessage"
          >
            发送 (Ctrl+Enter)
          </el-button>
          <el-button @click="clearInput">清空</el-button>
        </div>
      </div>
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
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.input-section {
  flex: 1;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  min-height: 120px;
}

.actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 16px;
  background: #fafbfc;
  border-top: 1px solid #f0f0f0;
}

.status-info {
  flex: 1;
  min-width: 0;
}

.provider-count {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}

.provider-count.warning {
  color: #f56c6c;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

:deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  padding: 0 !important;
  border: none !important;
  resize: none !important;
  background: transparent !important;
}

:deep(.el-textarea__inner::placeholder) {
  color: #a8abb2;
}

:deep(.el-textarea__inner:focus) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.el-textarea) {
  all: unset;
}
</style>
