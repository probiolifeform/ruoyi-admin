import type { FormSchemaGetter } from '#/adapter/form';
  import type { VxeGridProps } from '#/adapter/vxe-table';

  import { DictEnum } from '@vben/constants';
  import { getPopupContainer } from '@vben/utils';
  import { $t } from '@vben/locales'; // Revert to $t
  import { z } from '#/adapter/form';
  import { getDictOptions } from '#/utils/dict';

  export const querySchema: FormSchemaGetter = () => [
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('user.query.userName'),
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('user.query.nickName'),
    },
    {
      component: 'Select',
      componentProps: {
        getPopupContainer,
        options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
      },
      fieldName: 'status',
      label: $t('user.query.status'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: $t('user.query.createTime'),
    },
  ];

  export const columns: VxeGridProps['columns'] = [
    { type: 'checkbox', width: 60 },
    {
      field: 'userName',
      title: $t('user.column.userName'),
    },
    {
      field: 'userBalance',
      title: $t('user.column.userBalance'),
    },
    {
      field: 'avatar',
      title: $t('user.column.avatar'),
      slots: { default: 'avatar' },
      width: 80,
    },
    {
      field: 'createTime',
      title: $t('user.column.createTime'),
    },
    {
      field: 'loginDate',
      title: $t('user.column.loginDate'),
    },
    {
      field: 'status',
      title: $t('user.column.status'),
      slots: { default: 'status' },
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('user.column.action'),
      width: 180,
    },
  ];

  export const drawerSchema: FormSchemaGetter = () => [
    {
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
      fieldName: 'userId',
      label: $t('user.drawer.userId'),
    },
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('user.drawer.userName'),
      rules: 'required',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('user.drawer.password'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('user.drawer.nickName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('user.drawer.phone'),
      defaultValue: undefined,
      rules: z
        .string()
        .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码')
        .optional(),
    },
    {
      component: 'Input',
      fieldName: 'email',
      defaultValue: undefined,
      label: $t('user.drawer.email'),
      rules: z.string().email('请输入正确的邮箱').optional(),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getDictOptions(DictEnum.SYS_USER_SEX),
        optionType: 'button',
      },
      defaultValue: '0',
      fieldName: 'sex',
      formItemClass: 'col-span-2 lg:col-span-1',
      label: $t('user.drawer.sex'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
        optionType: 'button',
      },
      defaultValue: '0',
      fieldName: 'status',
      formItemClass: 'col-span-2 lg:col-span-1',
      label: $t('user.drawer.status'),
    },
    {
      component: 'Select',
      componentProps: {
        getPopupContainer,
        mode: 'multiple',
        optionFilterProp: 'label',
        optionLabelProp: 'label',
        placeholder: '请先选择部门',
      },
      fieldName: 'postIds',
      help: '选择部门后, 将自动加载该部门下所有的岗位',
      label: $t('user.drawer.postIds'),
    },
    {
      component: 'Select',
      componentProps: {
        getPopupContainer,
        mode: 'multiple',
        optionFilterProp: 'label',
        optionLabelProp: 'label',
      },
      fieldName: 'roleIds',
      label: $t('user.drawer.roleIds'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      formItemClass: 'items-baseline',
      label: $t('user.drawer.remark'),
    },
  ];
