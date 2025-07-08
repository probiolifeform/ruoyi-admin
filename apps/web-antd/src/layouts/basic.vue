<script lang="ts" setup>
    import { computed, onMounted, watch, ref } from 'vue';
    import { useRouter } from 'vue-router';

    import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
    import { VBEN_GITHUB_URL } from '@vben/constants';
    import { useWatermark } from '@vben/hooks';
    import { GitHubOutlined, UserOutlined } from '@vben/icons';
    import {
      BasicLayout,
      LockScreen,
      Notification,
      UserDropdown,
    } from '@vben/layouts';
    import { preferences } from '@vben/preferences';
    import { useAccessStore, useUserStore } from '@vben/stores';
    import { openWindow } from '@vben/utils';

    import { message } from 'ant-design-vue';

    import { TenantToggle } from '#/components/tenant-toggle';
    import { $t } from '#/locales';
    import { resetRoutes } from '#/router';
    import { useAuthStore, useNotifyStore } from '#/store';
    import { useTenantStore } from '#/store/tenant';
    import LoginForm from '#/views/_core/authentication/login.vue';

    const userStore = useUserStore();
    const authStore = useAuthStore();
    const accessStore = useAccessStore();
    const router = useRouter();
    const { destroyWatermark, updateWatermark } = useWatermark();

    const tenantStore = useTenantStore();
    const menus = computed(() => {
      const defaultMenus = [
        {
          handler: () => {
            router.push('/profile');
          },
          icon: UserOutlined,
          text: $t('ui.widgets.profile'),
        },
        {
          handler: () => {
            openWindow(VBEN_GITHUB_URL, {
              target: '_blank',
            });
          },
          icon: GitHubOutlined,
          text: $t('layout.officialWebsite'),
        },
      ];
      if (tenantStore.checked) {
        defaultMenus.splice(1, 1);
      }
      return defaultMenus;
    });

    const avatar = computed(() => {
      return userStore.userInfo?.avatar || preferences.app.defaultAvatar;
    });

    async function handleLogout() {
      await authStore.logout(false);
      resetRoutes();
    }

    const notifyStore = useNotifyStore();
    onMounted(() => notifyStore.startListeningMessage());

    function handleViewAll() {
      message.warning($t('layout.notAvailable'));
    }
    watch(
      () => preferences.app.watermark,
      async (enable) => {
        if (enable) {
          await updateWatermark({
            content: `${userStore.userInfo?.username}`,
          });
        } else {
          destroyWatermark();
        }
      },
      {
        immediate: true,
      },
    );

    // Force re-render on locale change (triggered by reload)
    const localeKey = ref(0);
    const urlParams = new URLSearchParams(window.location.search);
    const initialLang = urlParams.get('lang') || preferences.app.locale || 'zh-CN';
    watch(() => initialLang, () => {
      localeKey.value += 1; // Increment to force re-render
    }, { immediate: true });
    </script>

    <template>
      <BasicLayout :key="localeKey" @clear-preferences-and-logout="handleLogout">
        <template #header-right-1>
          <TenantToggle />
        </template>
        <template #user-dropdown>
          <UserDropdown
            :avatar
            :menus
            :text="userStore.userInfo?.realName"
            :description="$t('layout.emailPlaceholder')"
            :tag-text="$t('layout.proTag')"
            @logout="handleLogout"
          />
        </template>
        <template #notification>
          <Notification
            :dot="notifyStore.showDot"
            :notifications="notifyStore.notifications"
            :clear-text="$t('layout.notification.clear')"
            :make-all-text="$t('layout.notification.makeAllRead')"
            :read-text="$t('layout.notification.markRead')"
            :view-all-text="$t('layout.notification.viewAll')"
            @clear="notifyStore.clearAllMessage"
            @make-all="notifyStore.setAllRead"
            @read="notifyStore.setRead"
            @view-all="handleViewAll"
          />
        </template>
        <template #extra>
          <AuthenticationLoginExpiredModal
            v-model:open="accessStore.loginExpired"
            :avatar
          >
            <LoginForm />
          </AuthenticationLoginExpiredModal>
        </template>
        <template #lock-screen>
          <LockScreen :avatar @to-login="handleLogout" />
        </template>
      </BasicLayout>
    </template>
