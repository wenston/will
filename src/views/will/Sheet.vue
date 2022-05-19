<template>
  <h1>Sheet 表格</h1>
  <div style="padding: 15px 0">
    <div style="margin-bottom: 10px">
      <Checkbox v-model="isAuto" :value="[false, true]">
        &#8194;宽度自动
      </Checkbox>
      <Checkbox v-model="hasIndex" :value="[false, true]">
        &#8194;带序号
      </Checkbox>
      <Checkbox v-model="hasAction" :value="[false, true]">
        &#8194;有添加和删除行
      </Checkbox>
      <Checkbox v-model="stripe" :value="[false, true]">隔行变色</Checkbox>
      <span style="padding-left: 30px; padding-right: 30px">
        <Radio value="checkbox" v-model="ck">多选</Radio>
        <Radio value="radio" v-model="ck">单选</Radio>
      </span>
      <!-- <Btn @click="isAuto=!isAuto"
        :type="isAuto?'primary':'default'">宽度自动</Btn>
      <Btn @click="hasIndex=!hasIndex"
        :type="hasIndex?'primary':'default'">带序号</Btn> -->
    </div>

    <!-- :can-highlight="h"
      highlightKey="BillCode"
      v-model:highlight="hValue" -->
    <Sheet
      :data="D.slice(0, 10)"
      :columns="columns"
      :autoWidth="isAuto"
      :stripe="stripe"
      :hasIndex="hasIndex"
      :hasCheckbox="ck === 'checkbox'"
      checkKey="Id"
      v-model:keys="keys"
      v-model="currentKey"
      :checkable="checkable"
      :hasRadio="ck === 'radio'"
      :hasAction="hasAction"
      leftFixed="2"
      @after-checked="afterChecked"
      @add="toAdd"
      @delete="toDelete"
      @sort="toSort"
      height="calc(100vh - 120px)">
      <template #status="{ row }">
        <template v-if="row.Status === 11">状态11</template>
        <template v-else-if="row.Status === 3">已完成</template>
        <template v-else>12退货</template>
      </template>
    </Sheet>
    <div style="margin-top: 12px" v-if="false">
      <div style="margin-bottom: 10px">
        <Checkbox v-model="h" :value="[false, true]">高亮展示某一行</Checkbox>
      </div>
      <Sheet
        :data="rows"
        :columns="columns()"
        :canHighlight="h"
        highlightKey="BillCode"
        v-model:highlight="hValue"
        hasAction
        height="calc(35vh - 50px)">
        <template #action="{ row, index }">
          <Layer placement="top" toBody>
            <template #trigger>
              <div>
                <Icon name="k-icon-close" />
              </div>
            </template>
            <template #default="{ hide }">
              <div :class="css.indeed">
                确认要删除
                <span style="color: red">订单：{{ row.BillCode }}</span>
                吗?
              </div>
              <div style="float: right; margin-top: 12px">
                <span
                  style="color: var(--k-color-5); cursor: pointer"
                  @click="hide">
                  取消
                </span>
                <span
                  style="
                    color: var(--k-color-primary);
                    cursor: pointer;
                    margin-left: 10px;
                  ">
                  确定
                </span>
              </div>
            </template>
          </Layer>
        </template>
        <template #status="{ row }">
          <template v-if="row.Status === 11">状态11</template>
          <template v-else-if="row.Status === 3">已完成</template>
          <template v-else>12退货</template>
        </template>
      </Sheet>
    </div>
  </div>
</template>
<script lang="tsx">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  useCssModule
} from 'vue'
import Sheet from 'will-ui/components/sheet'
import Data from '../../mock-data/billData'
import Btn from 'will-ui/components/btn'
import Checkbox from 'will-ui/components/checkbox'
import Radio from 'will-ui/components/radio'
import Confirm from 'will-ui/components/confirm'
import Icon from 'will-ui/components/icon'
import Layer from 'will-ui/components/layer'
import Tooltip from 'will-ui/components/tooltip'
import Notice from 'will-ui/components/notice'

export default defineComponent({
  components: {
    Sheet,
    Btn,
    Checkbox,
    Radio,
    Icon,
    Layer,
    Tooltip
  },
  setup() {
    const css = useCssModule('css')
    const a = ref(0)
    const D = ref<any[]>(Data)
    const isAuto = ref(true)
    const hasIndex = ref(true)
    const stripe = ref(true)
    const hasAction = ref(true)
    const h = ref(true)
    const ck = ref('radio')
    const keys = ref<any[]>([])
    const rows = ref<any[]>([])
    const currentKey = ref('')
    const hValue = ref('CGDD2104290001')

    watch(
      keys,
      (v: any) => {
        // console.log(v)
      },
      { deep: true }
    )
    function columns() {
      return [
        {
          name: '单号',
          field: 'BillCode',
          style: { width: '12em' },
          //是否锁定该列的宽度，只在autoWidth为true时有用，虽然锁定，但仍然可以通过拖拽调整宽度！
          lockWidth: true
        },
        // {
        //   name: '状态',
        //   field: 'Status',
        //   style: { width: 70 },
        //   slot: 'status',
        //   lockWidth: true
        // },
        // {
        //   name: '供应商',
        //   field: 'SupplierName',
        //   style: { width: 250 }
        // },
        {
          name: '数量',
          field: 'ProCount',
          sum: true,
          style: { width: 59 },
          lockWidth: true,
          sorter: true
        },
        {
          name: '单价',
          field: 'ProPrice',
          style: { width: 80 },
          sorter: true
        },
        {
          name: '金额',
          field: 'SubTotal',
          style: { width: 70 },
          lockWidth: true,
          align: 'right',
          render: (row: any, index: number) => {
            return (
              <span style="color:var(--k-color-danger)">{row.SubTotal}</span>
            )
          },
          sum: false
        },
        {
          name: '收货单位',
          children: [
            {
              name: '收货仓库',
              field: 'StoreName',
              children: [
                {
                  name: 'A',
                  style: { width: 40 },
                  lockWidth: true
                },
                { name: 'B' }
              ]
            },
            {
              name: '门店',
              field: 'BranchName',
              style: { width: 213 }
            },
            {
              name: '部门',
              field: '',
              children: [
                {
                  name: '部门C',
                  style: { width: 76 }
                },
                {
                  name: '部门D',
                  style: { width: 60 }
                }
              ]
            }
          ]
        },

        // {
        //   name: "发票类型",
        // },
        // {
        //   name: "交易类型",
        // },
        // {
        //   name: "商品",
        // },
        // {
        //   name: "经手人",
        //   field: "Handler",
        // },
        // {
        //   name: '制单人',
        //   field: 'CreatedUserName'
        // },
        // {
        //   name: '制单时间',
        //   field: 'BillDate'
        // },
        {
          name: '备注',
          field: 'Description',
          render: (r: any) => {
            return r.Description || '默认的一个备注'
          }
        }
      ]
    }

    onMounted(() => {
      setTimeout(() => {
        // D.value = Data
      }, 200)
    })
    return {
      a,
      D,
      isAuto,
      hasIndex,
      hasAction,
      stripe,
      h,
      ck,
      keys,
      rows,
      currentKey,
      hValue,
      columns,
      checkable(row: any) {
        if (row.TotalPrice - 0 > 400) {
          return {
            disabled: true,
            checked: false
          }
        }
        return { disabled: false, checked: false }
      },
      afterChecked(arr: any[]) {
        rows.value = arr
      },
      toAdd(row: any, index: number) {
        console.log(index)
        D.value.splice(index + 1, 0, {
          BillCode: (Math.random() + '').slice(2)
        } as any)
      },
      toDelete(row: any, index: number) {
        console.log(row, index)
        Confirm.open({
          content(close: any) {
            return (
              <div>
                &#12288;
                <Icon
                  name="k-icon-warning"
                  size="20"
                  style="color:var(--k-color-warning)"
                />
                &#8194;确定要删除【{row.BillCode}
                】吗？
              </div>
            )
          },
          ok() {
            D.value.splice(index, 1)
          }
        })
      },
      toSort({ field, sorter }: any) {
        console.log(field, sorter)
        Notice.open({
          placement: 'top-end',
          content(close: any) {
            const btnProps: any = {
              onClick: close,
              href: 'javascript:;',
              style: {
                color: 'var(--k-color-primary)',
                'text-decoration': 'none'
              }
            }
            return (
              <div class={css.outer}>
                <div class={css.flex}>
                  当前排序列：{field}，排序类型：
                  {sorter}
                  <br />
                  说明：0是升序，1是降序，true为默认
                  <br />
                  然后对数据进行处理，或交给后台处理数据
                </div>
                <div style="margin-top:20px;float:right;">
                  <a {...btnProps}>我知道了</a>
                </div>
              </div>
            )
          }
        })
      }
    }
  }
})
</script>
<style module="css" lang="postcss">
.indeed {
  max-width: 150px;
  color: var(--k-color-3);
  font-size: 12px;
}
.outer {
  padding: 15px;
  /* background-color: var(--k-color-2); */
  border-radius: var(--k-radius);
  overflow: hidden;
}
.flex {
  color: var(--k-color-3);
  font-size: 14px;
  line-height: 1.5;
}
</style>
