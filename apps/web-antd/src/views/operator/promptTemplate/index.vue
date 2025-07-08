<script setup lang="ts">
  import type { VbenFormProps } from '@vben/common-ui';

  import type { VxeGridProps } from '#/adapter/vxe-table';
  import type { TemplateForm } from '#/api/system/promptTemplate/model';

  import { Page, useVbenModal } from '@vben/common-ui';
  import { $t } from '@vben/locales'; // Revert to $t for now
  import { getVxePopupContainer } from '@vben/utils';

  import { Modal, Popconfirm, Space } from 'ant-design-vue';

  import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
  import {
    templateExport,
    templateList,
    templateRemove,
  } from '#/api/system/promptTemplate';
  import { commonDownloadExcel } from '#/utils/file/download';

  import { columns, querySchema } from './data';
  import templateModal from './template-modal.vue'; // Ensure this import exists

  const formOptions: VbenFormProps = {
    commonConfig: {
      labelWidth: 110,
      componentProps: {
        allowClear: true,
      },
    },
    schema: querySchema(),
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gridOptions: VxeGridProps = {
    checkboxConfig: {
      highlight: true,
      reserve: true,
    },
    columns,
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues = {}) => {
          return await templateList({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    id: 'system-template-index',
  };
  const [BasicTable, tableApi] = useVbenVxeGrid({
    formOptions,
    gridOptions,
  });

  const [TemplateModal, modalApi] = useVbenModal({
    connectedComponent: templateModal,
  });

  function handleAdd() {
    modalApi.setData({});
    modalApi.open();
  }

  async function handleEdit(row: Required<TemplateForm>) {
    modalApi.setData({ id: row.id });
    modalApi.open();
  }

  async function handleDelete(row: Required<TemplateForm>) {
    await templateRemove(row.id);
    await tableApi.query();
  }

  function handleMultiDelete() {
    const rows = tableApi.grid.getCheckboxRecords();
    const ids = rows.map((row: Required<TemplateForm>) => row.id);
    Modal.confirm({
      title: $t('pages.common.hint'),
      okType: 'danger',
      content: $t('pages.common.confirmMultiDelete', { count: ids.length }),
      onOk: async () => {
        await templateRemove(ids);
        await tableApi.query();
      },
    });
  }

  function handleDownloadExcel() {
    commonDownloadExcel(
      templateExport,
      $t('page.prompt.list'),
      tableApi.formApi.form.values,
      {
        fieldMappingTime: formOptions.fieldMappingTime,
      },
    );
  }

  // Temporarily remove the watch causing the reload error
  // We'll fix the reload logic separately
  </script>

  <template>
    <Page :auto-content-height="true">
      <BasicTable :table-title="$t('page.prompt.list')">
        <template #toolbar-tools>
          <Space>
            <a-button
              v-access:code="['system:template:export']"
              @click="handleDownloadExcel"
            >
              {{ $t('pages.common.export') }}
            </a-button>
            <a-button
              :disabled="!vxeCheckboxChecked(tableApi)"
              danger
              type="primary"
              v-access:code="['system:template:remove']"
              @click="handleMultiDelete"
            >
              {{ $t('pages.common.delete') }}
            </a-button>
            <a-button
              type="primary"
              v-access:code="['system:template:add']"
              @click="handleAdd"
            >
              {{ $t('pages.common.add') }}
            </a-button>
          </Space>
        </template>
        <template #action="{ row }">
          <Space>
            <ghost-button
              v-access:code="['system:template:edit']"
              @click.stop="handleEdit(row)"
            >
              {{ $t('pages.common.edit') }}
            </ghost-button>
            <Popconfirm
              :get-popup-container="getVxePopupContainer"
              placement="left"
              title="确认删除？"
              @confirm="handleDelete(row)"
            >
              <ghost-button
                danger
                v-access:code="['system:template:remove']"
                @click.stop=""
              >
                {{ $t('pages.common.delete') }}
              </ghost-button>
            </Popconfirm>
          </Space>
        </template>
      </BasicTable>
      <TemplateModal @reload="tableApi.query()" />
    </Page>
  </template>
