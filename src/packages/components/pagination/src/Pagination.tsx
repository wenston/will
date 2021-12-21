import type { PropType } from 'vue'
import { defineComponent, ref, computed, watch } from 'vue'
// import Num from '../../number'
import { Choose } from '../../choose/index'
import Tooltip from '../../tooltip/index'
import Btn from '../../btn'
export default defineComponent({
  name: 'Pagination',
  components: { Choose, Btn, Tooltip },
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageIndex: { type: Number, default: 1 },
    pageSize: { type: Number, default: 20 },
    sizes: {
      type: Array as PropType<number[]>,
      default: () => [20, 50, 80, 100, 200]
    },
    align: { type: String, default: 'right' }, //left,center,right
    layout: {
      type: String,
      default: 'total,prev,pager,next,sizes,jumper'
    },
    hideWhenNoData: { type: Boolean, default: true }
  },
  emits: [
    'update:pageIndex',
    'update:pageSize',
    'changePageIndex',
    'changePageSize'
  ],
  setup(props, { emit, attrs, slots }) {
    const dot = ref('...')
    const outsize = ref(10)
    const max = ref(5)
    const max2 = ref(7)
    const pi = ref(props.pageIndex)
    const ps = ref(props.pageSize)
    const p_number = ref()
    const lout = computed(() => props.layout.toLocaleLowerCase().split(','))
    const totalPages = computed(() => Math.ceil(props.total / ps.value))
    const pagers = computed(() => {
      //无论总页数多少，第一页和最后一页总是要展示
      const t = totalPages.value,
        oz = outsize.value,
        v_max = max.value,
        v_max2 = max2.value,
        p = pi.value, //当前页码
        v_dot = dot.value
      if (t > oz) {
        let arr = []
        if (t - p >= v_max && p > v_max) {
          for (let i = p - 2; i <= p + 2; i++) {
            arr.push(i)
          }
          arr.push(v_dot, t)
          arr.unshift(1, v_dot)
        } else {
          if (p <= v_max) {
            for (let i = 1; i <= v_max2; i++) {
              arr.push(i)
            }
            arr.push(v_dot, t)
          } else if (t - p < v_max) {
            for (let i = t; i > t - v_max2; i--) {
              arr.unshift(i)
            }
            arr.unshift(1, v_dot)
          }
        }
        return arr
      } else {
        //@ts-ignore
        return Array.apply(null, { length: t }).map((el, i) => i + 1)
      }
    })
    const chooseProps = computed(() => {
      const o: any = {
        modelValue: ps.value,
        clearable: false,
        mode: 'text',
        'onUpdate:modelValue': (size: number) => {
          ps.value = size
          pi.value = 1
          emit('update:pageSize', size)
          emit('changePageSize', size)
          changePage()
        }
      }
      return o
    })
    const numProps = computed(() => ({
      placement: 'top',
      validate: {
        when: 'input',
        reg: /\d+/
      },
      showTip: false,
      modelValue: p_number.value,
      'onUpdate:modelValue': (p: any) => {
        p_number.value = p
      },
      onChange: (e: any) => {
        // const target = e.target
        let v = parseInt(p_number.value)
        if (isNaN(v)) {
          p_number.value = ''
        } else {
          p_number.value = v
        }
      },
      onKeyup: (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter') {
          toJump()
        }
      },
      // 'onChange':(p:any)=>{
      //     console.log(p)
      // },
      style: { width: '54px' }
    }))

    watch(
      () => [props.pageIndex, props.pageSize],
      ([i, s]) => {
        pi.value = i
        ps.value = s
      }
    )
    watch(pi, (v) => {
      emit('update:pageIndex', v)
    })
    watch(ps, (v) => {
      emit('update:pageSize', v)
    })

    function toJump() {
      const p = p_number.value - 0
      if (isNaN(p)) {
        return
      }
      if (p < 1 || p > totalPages.value) {
        return
      }
      if (p !== pi.value) {
        pi.value = p
        changePage()
      }
    }

    function toNext() {
      if (pi.value < totalPages.value) {
        pi.value += 1
        changePage()
      }
    }

    function toPrev() {
      if (pi.value > 1) {
        pi.value -= 1
        changePage()
      }
    }

    function changePage() {
      emit('changePageIndex', pi.value)
    }

    function showItem(item: string) {
      return lout.value.indexOf(item) > -1
    }

    function setOrder(item: string) {
      return lout.value.indexOf(item)
    }

    return () => {
      const chooseSlots = {
        default: () => {
          return props.sizes.map((s: number) => {
            const label = `${s}条/页`
            const itemSlots = {
              default: () => {
                return label
              }
            }
            const itemProps = {
              key: label,
              label,
              value: s
            }
            return <Choose.item {...itemProps} v-slots={itemSlots} />
          })
        }
      }
      let goProps: any = {
        onClick: toJump,
        mode: 'text'
      }
      let goSlots = {
        default: () => 'Go'
      }
      let btn = <Btn {...goProps} v-slots={goSlots}></Btn>

      const all_pages = (pagers.value as any).map((p: any, i: number) => {
        const isDisabled = p === dot.value
        const ps = {
          class: {
            'w-pagination--disabled': isDisabled,
            'w-pagination--active': p === pi.value
          },
          onClick: () => {
            if (!isDisabled && pi.value !== p) {
              pi.value = p
              changePage()
            }
          }
        }
        return <span {...ps}>{p}</span>
      })

      if (props.total == 0 && props.hideWhenNoData) {
        return null
      }

      return (
        <ol class={['w-pagination', `w-pagination__${props.align}`]}>
          {showItem('total') && (
            <li class="w-pagination-total" style={{ order: setOrder('total') }}>
              共 {props.total} 条
            </li>
          )}
          <li class="w-pagination-pager" style={{ order: setOrder('pager') }}>
            {showItem('prev') && (
              <Tooltip
                v-slots={{
                  trigger: () => (
                    <span
                      class={[
                        'w-pagination-prev',
                        { ['w-pagination--disabled']: pi.value === 1 }
                      ]}
                      onClick={toPrev}></span>
                  ),
                  default: () => '上一页'
                }}></Tooltip>
            )}
            {showItem('pager') && all_pages}
            {showItem('next') && (
              <Tooltip
                v-slots={{
                  trigger: () => (
                    <span
                      class={[
                        'w-pagination-next',
                        {
                          ['w-pagination--disabled']:
                            pi.value === totalPages.value
                        }
                      ]}
                      onClick={toNext}></span>
                  ),
                  default: () => '下一页'
                }}
              />
            )}
          </li>
          {showItem('sizes') && (
            <li class="w-pagination-sizes" style={{ order: setOrder('sizes') }}>
              <Choose {...chooseProps.value} v-slots={chooseSlots} />
            </li>
          )}
          {showItem('jumper') && [
            <li style={{ order: setOrder('jumper') }}>
              <span>前往 </span>
              <span {...numProps.value} />
              <span> 页</span>
            </li>,
            <li class="w-pagination-go" style={{ order: setOrder('jumper') }}>
              {btn}
            </li>
          ]}
        </ol>
      )
    }
  }
})
