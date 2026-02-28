import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export interface CardConfig {
  isVisible: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isHidden: boolean;
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
  title?: string;
}

export interface GridSettings {
  columns: number;
  gap: number;
}

export const useLayoutStore = defineStore('layout', () => {
  const cardConfigs = reactive<Record<string, CardConfig>>({});
  const gridSettings = ref<GridSettings>({
    columns: 2,
    gap: 16,
  });
  const windowWidth = ref<number>(0);
  const windowHeight = ref<number>(0);

  // Initialize card configs
  const initializeCardConfigs = (providerIds: string[]) => {
    providerIds.forEach(id => {
      if (!cardConfigs[id]) {
        cardConfigs[id] = {
          isVisible: true,
          isMinimized: false,
          isMaximized: false,
          isHidden: false,
          size: {
            width: 600,
            height: 600,
          },
          zIndex: 1,
        };
      }
    });
  };

  // Get card config
  const getCardConfig = (providerId: string): CardConfig => {
    return cardConfigs[providerId] || {
      isVisible: true,
      isMinimized: false,
      isMaximized: false,
      isHidden: false,
      size: { width: 600, height: 600 },
      zIndex: 1,
    };
  };

  // Toggle minimized
  const toggleCardMinimized = (providerId: string) => {
    if (cardConfigs[providerId]) {
      cardConfigs[providerId].isMinimized = !cardConfigs[providerId].isMinimized;
    }
  };

  // Toggle maximized
  const toggleCardMaximized = (providerId: string) => {
    if (cardConfigs[providerId]) {
      const isMaximized = cardConfigs[providerId].isMaximized;
      
      // Hide all other cards when maximizing
      if (!isMaximized) {
        Object.keys(cardConfigs).forEach(id => {
          if (id !== providerId) {
            cardConfigs[id].isHidden = true;
          }
        });
        cardConfigs[providerId].isMaximized = true;
        cardConfigs[providerId].zIndex = 1000;
      } else {
        // Show all cards when un-maximizing
        Object.keys(cardConfigs).forEach(id => {
          cardConfigs[id].isHidden = false;
        });
        cardConfigs[providerId].isMaximized = false;
        cardConfigs[providerId].zIndex = 1;
      }
    }
  };

  // Update card size
  const updateCardSize = (providerId: string, size: { width: number; height: number }) => {
    if (cardConfigs[providerId]) {
      cardConfigs[providerId].size = size;
    }
  };

  // Update card title
  const updateCardTitle = (providerId: string, title: string) => {
    if (cardConfigs[providerId]) {
      cardConfigs[providerId].title = title;
    }
  };

  // Update window size
  const updateWindowSize = (width: number, height: number) => {
    windowWidth.value = width;
    windowHeight.value = height;
    
    // Auto-adjust columns based on window width
    if (width < 900) {
      gridSettings.value.columns = 1;
    } else if (width < 1400) {
      gridSettings.value.columns = 2;
    } else {
      gridSettings.value.columns = 3;
    }
  };

  // Recalculate layout
  const recalculateLayout = () => {
    // Layout recalculation logic if needed
  };

  // Load layout config
  const loadLayoutConfig = () => {
    const saved = localStorage.getItem('layout-config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        Object.assign(gridSettings.value, config.gridSettings);
        Object.assign(cardConfigs, config.cardConfigs);
      } catch (e) {
        console.error('Failed to load layout config:', e);
      }
    }
  };

  // Save layout config
  const saveLayoutConfig = () => {
    const config = {
      gridSettings: gridSettings.value,
      cardConfigs,
    };
    localStorage.setItem('layout-config', JSON.stringify(config));
  };

  return {
    cardConfigs,
    gridSettings,
    windowWidth,
    windowHeight,
    initializeCardConfigs,
    getCardConfig,
    toggleCardMinimized,
    toggleCardMaximized,
    updateCardSize,
    updateCardTitle,
    updateWindowSize,
    recalculateLayout,
    loadLayoutConfig,
    saveLayoutConfig,
  };
});
