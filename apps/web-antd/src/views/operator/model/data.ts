import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { DictEnum } from '@vben/constants';
import { $t } from '@vben/locales';
import { renderDict } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'modelName',
    label: $t('page.model.modelName'),
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: $t('page.model.createTime'),
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: $t('page.model.category'),
    field: 'category',
    slots: {
      default: ({ row }) => {
        return renderDict(row.category, DictEnum.CHAT_MODEL_CATEGORY);
      },
    },
  },
  {
    title: $t('page.model.modelName'),
    field: 'modelName',
  },
  {
    title: $t('page.model.modelDescribe'),
    field: 'modelDescribe',
  },
  {
    title: $t('page.model.modelPrice'),
    field: 'modelPrice',
  },
  {
    title: $t('page.model.modelType'),
    field: 'modelType',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.modelType, DictEnum.SYS_MODEL_BILLING);
      },
    },
  },
  {
    title: $t('page.model.modelShow'),
    field: 'modelShow',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.modelShow, DictEnum.SYS_SHOW_HIDE);
      },
    },
  },
  {
    title: $t('page.model.apiHost'),
    field: 'apiHost',
  },
  {
    title: $t('page.model.apiKey'),
    field: 'apiKey',
    width: '300px',
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: $t('page.prompt.action'),
    width: 180,
  },
];
