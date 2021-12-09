
<script lang="tsx">
import type {Ref} from 'vue'
import {
  ref,
  inject,
  useCssModule,
  createVNode,
  computed,
  defineComponent
} from 'vue'
import Icon from 'will-ui/components/icon/index'
import Close from '../../../../packages/components/close/index'
import Notice from '../../../../packages/components/notice/index'
import Tooltip from '../../../../packages/components/tooltip/index'
import Btn from '../../../../packages/components/btn/index'
interface Wrapper {
  uid?: number | string;
  isActive?: boolean;
}

export default defineComponent({
  inheritAttrs: false,
  props: { isActive: Boolean, uid: {type:String,required: true}},
  emits: ['toDelete'],
  setup(props, ctx) {
    const css = useCssModule('css')
    const setCurrentComponent = inject('setCurrentComponent') as (
      uid: string
    ) => void
    const currentComponent = inject<Ref<Record<any,any>>>('currentComponent')
    const wrapperOptions = computed(() => {
      const klass = [css.wrapper, { [css.active]: props.uid===currentComponent?.value?.uid }]
      const { class: outClass, ...others } = ctx.attrs
      return {
        class: [klass, outClass],
        onClick: ()=> {
          setCurrentComponent(props.uid)
        },
        ...others
      }
    })

    function beforeDelete() {
      ctx.emit('toDelete')
      Notice.open({
        placement: 'bottom',
        content: (close: () => void) => {
          return createVNode('p', null, [
            createVNode('div', { style: { padding: '20px' } }, [
              '你将要删除这个组件了！'
            ]),
            createVNode(
              'p',
              null,
              '未来需要用一个confirm组件来替代此组件，用以获取用户是确认还是取消'
            ),
            createVNode(
              Btn,
              { mode: 'line', type: 'primary', onClick: close },
              {
                default: () => '好的，我知道了'
              }
            )
          ])
        }
      })
    }

    return () => {
      const mySlots = {
        trigger: () => {
          return <div {...wrapperOptions.value}>{ctx.slots.default?.()}</div>
        },
        default: () => (
          <span onClick={beforeDelete} class="w-cursor-pointer w-no-select">
            删除
          </span>
        )
      }
      return <Tooltip placement="right" v-slots={mySlots} />
    }
  }
})
</script>
<style lang="postcss" module="css">
.wrapper {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    top: 0;
    left: 0;
    z-index: 2;
  }
  &.active {
    &::after {
      border: 2px solid var(--w-color-primary);
    }
  }

  &:hover {
    &:not(.active) {
      &::after {
        border: 2px dashed var(--w-color-primary);
      }
    }
  }
}
</style>