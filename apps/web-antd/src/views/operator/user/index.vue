<script setup lang="ts">
  import type { VbenFormProps } from '@vben/common-ui';
  import type { VxeGridProps } from '#/adapter/vxe-table';
  import type { User } from '#/api/system/user/model';

  import { ref, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n'; // Import useI18n for reactive translations
  import { useAccess } from '@vben/access';
  import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
  import { preferences } from '@vben/preferences';
  import { getVxePopupContainer } from '@vben/utils';

  import {
    Avatar,
    Dropdown,
    Menu,
    MenuItem,
    Modal,
    Popconfirm,
    Space,
  } from 'ant-design-vue';

  import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
  import {
    userExport,
    userList,
    userRemove,
    userStatusChange,
  } from '#/api/system/user';
  import { TableSwitch } from '#/components/table';
  import { commonDownloadExcel } from '#/utils/file/download';

  import { querySchema } from './data';
  import userDrawer from './user-drawer.vue';
  import userImportModal from './user-import-modal.vue';
  import userInfoModal from './user-info-modal.vue';
  import userResetPwdModal from './user-reset-pwd-modal.vue';

  const { t } = useI18n(); // Reactive translation function

  /**
   * 导入
   */
  const [UserImportModal, userImportModalApi] = useVbenModal({
    connectedComponent: userImportModal,
  });

  function handleImport() {
    userImportModalApi.open();
  }

  // 左边部门用
  const selectDeptId = ref<string[]>([]);

  const formOptions: VbenFormProps = {
    schema: querySchema(),
    commonConfig: {
      labelWidth: 80,
      componentProps: {
        allowClear: true,
      },
    },
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    handleReset: async () => {
      selectDeptId.value = [];

      const { formApi, reload } = tableApi;
      await formApi.resetForm();
      const formValues = formApi.form.values;
      formApi.setLatestSubmissionValues(formValues);
      await reload(formValues);
    },
    // 日期选择格式化
    fieldMappingTime: [
      [
        'createTime',
        ['params[beginTime]', 'params[endTime]'],
        ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      ],
    ],
  };

  // Define columns as a computed property to react to locale changes
  const columns = computed(() => [
    { type: 'checkbox', width: 60 },
    {
      field: 'userName',
      title: t('user.column.userName'),
    },
    {
      field: 'userBalance',
      title: t('user.column.userBalance'),
    },
    {
      field: 'avatar',
      title: t('user.column.avatar'),
      slots: { default: 'avatar' },
      width: 80,
    },
    {
      field: 'createTime',
      title: t('user.column.createTime'),
    },
    {
      field: 'loginDate',
      title: t('user.column.loginDate'),
    },
    {
      field: 'status',
      title: t('user.column.status'),
      slots: { default: 'status' },
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: t('user.column.action'),
      width: 180,
    },
  ]);

  const gridOptions: VxeGridProps = {
    checkboxConfig: {
      highlight: true,
      reserve: true,
      trigger: 'default',
      checkMethod: ({ row }) => row?.userId !== 1,
    },
    columns: columns.value,
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues = {}) => {
          if (selectDeptId.value.length === 1) {
            formValues.deptId = selectDeptId.value[0];
          } else {
            Reflect.deleteProperty(formValues, 'deptId');
          }

          return await userList({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'userId',
      height: 48,
    },
    id: 'system-user-index',
  };
  const [BasicTable, tableApi] = useVbenVxeGrid({
    formOptions,
    gridOptions,
  });

  const [UserDrawer, userDrawerApi] = useVbenDrawer({
    connectedComponent: userDrawer,
  });

  function handleAdd() {
    userDrawerApi.setData({});
    userDrawerApi.open();
  }

  function handleEdit(row: User) {
    userDrawerApi.setData({ id: row.userId });
    userDrawerApi.open();
  }

  async function handleDelete(row: User) {
    await userRemove([row.userId]);
    await tableApi.query();
  }

  function handleMultiDelete() {
    const rows = tableApi.grid.getCheckboxRecords();
    const ids = rows.map((row: User) => row.userId);
    Modal.confirm({
      title: t('pages.common.hint'),
      okType: 'danger',
      content: t('pages.common.confirmMultiDelete', { count: ids.length }),
      onOk: async () => {
        await userRemove(ids);
        await tableApi.query();
      },
    });
  }

  function handleDownloadExcel() {
    commonDownloadExcel(userExport, t('user.listTitle'), tableApi.formApi.form.values, {
      fieldMappingTime: formOptions.fieldMappingTime,
    });
  }

  const [UserInfoModal, userInfoModalApi] = useVbenModal({
    connectedComponent: userInfoModal,
  });
  function handleUserInfo(row: User) {
    userInfoModalApi.setData({ userId: row.userId });
    userInfoModalApi.open();
  }

  const [UserResetPwdModal, userResetPwdModalApi] = useVbenModal({
    connectedComponent: userResetPwdModal,
  });

  function handleResetPwd(record: User) {
    userResetPwdModalApi.setData({ record });
    userResetPwdModalApi.open();
  }

  const { hasAccessByCodes } = useAccess();

  // Watch for locale changes and update
  watch(() => preferences.app.locale, async (newLocale) => {
    console.log(`Reloading grid with locale: ${newLocale}`);
    await tableApi.reload(); // Reload grid to ensure data consistency
  }, { immediate: true });
  </script>

  <template>
    <Page :auto-content-height="true">
      <div class="flex h-full gap-[8px]">
        <BasicTable class="flex-1 overflow-hidden" :table-title="t('user.listTitle')">
          <template #toolbar-tools>
            <Space>
              <a-button
                v-access:code="['system:user:export']"
                @click="handleDownloadExcel"
              >
                {{ t('pages.common.export') }}
              </a-button>
              <a-button
                v-access:code="['system:user:import']"
                @click="handleImport"
              >
                {{ t('pages.common.import') }}
              </a-button>
              <a-button
                :disabled="!vxeCheckboxChecked(tableApi)"
                danger
                type="primary"
                v-access:code="['system:user:remove']"
                @click="handleMultiDelete"
              >
                {{ t('pages.common.delete') }}
              </a-button>
              <a-button
                type="primary"
                v-access:code="['system:user:add']"
                @click="handleAdd"
              >
                {{ t('pages.common.add') }}
              </a-button>
            </Space>
          </template>
          <template #avatar="{ row }">
            <Avatar :src="row.avatar || preferences.app.defaultAvatar" />
          </template>
          <template #status="{ row }">
            <TableSwitch
              v-model="row.status"
              :api="() => userStatusChange(row)"
              :disabled="row.userId === 1 || !hasAccessByCodes(['system:user:edit'])"
              :reload="() => tableApi.query()"
            />
          </template>
          <template #action="{ row }">
            <template v-if="row.userId !== 1">
              <Space>
                <ghost-button
                  v-access:code="['system:user:edit']"
                  @click.stop="handleEdit(row)"
                >
                  {{ t('pages.common.edit') }}
                </ghost-button>
                <Popconfirm
                  :get-popup-container="getVxePopupContainer"
                  placement="left"
                  :title="t('pages.common.confirmDelete')"
                  @confirm="handleDelete(row)"
                >
                  <ghost-button
                    danger
                    v-access:code="['system:user:remove']"
                    @click.stop=""
                  >
                    {{ t('pages.common.delete') }}
                  </ghost-button>
                </Popconfirm>
              </Space>
              <Dropdown
                :get-popup-container="getVxePopupContainer"
                placement="bottomRight"
              >
                <template #overlay>
                  <Menu>
                    <MenuItem key="1" @click="handleUserInfo(row)">
                      {{ t('user.info') }}
                    </MenuItem>
                    <span v-access:code="['system:user:resetPwd']">
                      <MenuItem key="2" @click="handleResetPwd(row)">
                        {{ t('user.resetPassword') }}
                      </MenuItem>
                    </span>
                  </Menu>
                </template>
                <a-button size="small" type="link">
                  {{ t('pages.common.more') }}
                </a-button>
              </Dropdown>
            </template>
          </template>
        </BasicTable>
      </div>
      <UserImportModal @reload="tableApi.query()" />
      <UserDrawer @reload="tableApi.query()" />
      <UserInfoModal />
      <UserResetPwdModal />
    </Page>
  </template>
