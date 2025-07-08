import type { FormSchemaGetter } from '#/adapter/form';
  import type { VxeGridProps } from '#/adapter/vxe-table';

  import { DictEnum } from '@vben/constants';
  import { $t } from '@vben/locales'; // Revert to $t
  import { renderDict } from '#/utils/render';

  export const querySchema: FormSchemaGetter = () => [
    {
      component: 'Input',
      fieldName: 'templateName',
      label: $t('page.prompt.templateName'),
    },
    {
      component: 'Input',
      fieldName: 'templateContent',
      label: $t('page.prompt.templateContent'),
    },
    {
      component: 'Input',
      fieldName: 'category',
      label: $t('page.prompt.category'),
    },
  ];

  export const columns: VxeGridProps['columns'] = [
    { type: 'checkbox', width: 60 },
    {
      title: $t('page.prompt.primaryKey'),
      field: 'id',
    },
    {
      title: $t('page.prompt.templateName'),
      field: 'templateName',
    },
    {
      title: $t('page.prompt.templateContent'),
      field: 'templateContent',
    },
    {
      title: $t('page.prompt.category'),
      field: 'category',
      width: 120,
      slots: {
        default: ({ row }) => {
          return renderDict(row.category, DictEnum.PROMPT_TEMPLATE_TYPE);
        },
      },
    },
    {
      title: $t('page.prompt.remark'),
      field: 'remark',
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('page.prompt.action'),
      width: 180,
    },
  ];
