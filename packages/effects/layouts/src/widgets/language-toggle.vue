<script setup lang="ts">
  import type { SupportedLanguagesType } from '@vben/locales';
  import { computed } from 'vue'; // Import computed from Vue

  import { SUPPORT_LANGUAGES } from '@vben/constants';
  import { Languages } from '@vben/icons';
  import { VbenDropdownRadioMenu, VbenIconButton } from '@vben-core/shadcn-ui';

  defineOptions({
    name: 'LanguageToggle',
  });

  // Compute the initial language from URL or default
  const currentLang = computed(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') as SupportedLanguagesType || 'zh-CN';
  });

  // Handle language switch with reload
  const switchLanguage = (lang: string) => {
    window.location.href = `${window.location.pathname}?lang=${lang}`;
  };
  </script>

  <template>
    <div>
      <VbenDropdownRadioMenu
        :menus="SUPPORT_LANGUAGES"
        :model-value="currentLang"
        @update:model-value="switchLanguage"
      >
        <VbenIconButton>
          <Languages class="text-foreground size-4" />
        </VbenIconButton>
      </VbenDropdownRadioMenu>
    </div>
  </template>
