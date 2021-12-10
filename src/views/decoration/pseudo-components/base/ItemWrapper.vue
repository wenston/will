
<script lang="tsx">
import type { Ref } from 'vue'
import {
  ref,
  inject,
  useCssModule,
  createVNode,
  computed,
  defineComponent
} from 'vue'
import {
  ComponentDescriptionKey,
  SetCurrentComponentKey,
  DeleteComponentKey
} from 'decoration-symbols'
import Icon from 'will-ui/components/icon/index'
import Close from 'will-ui/components/close/index'
import Notice from 'will-ui/components/notice/index'
import Tooltip from 'will-ui/components/tooltip/index'
import Btn from 'will-ui/components/btn/index'

// interface Wrapper {
//   uid?: number | string;
// }

export default defineComponent({
  inheritAttrs: false,
  props: {
    //每个组件都有一个唯一标识
    uid: { type: String, required: true }
  },
  setup(props, ctx) {
    const css = useCssModule('css')
    const setCurrentComponent = inject(
      SetCurrentComponentKey,
      (uid: string) => {
        throw new Error('setCurrentComponent 失败')
      }
    )
    const currentComponent = inject(ComponentDescriptionKey, ref(null))
    const deleteComponent = inject(DeleteComponentKey, () => {
      throw new Error('没有给uid，删除失败')
    })
    const wrapperOptions = computed(() => {
      const klass = [
        css.wrapper,
        { [css.active]: props.uid === currentComponent.value?.uid }
      ]
      const { class: outClass, ...others } = ctx.attrs
      return {
        class: [klass, outClass],
        onClick: () => {
          setCurrentComponent(props.uid)
        },
        ...others
      }
    })

    function beforeDelete() {
      deleteComponent(props.uid)
      Notice.open({
        placement: 'bottom',
        content: (close: () => void) => {
          return createVNode('p', null, [
            createVNode('div', { style: { padding: '20px' } }, [
              '你将要删除这个组件了！'
            ]),
            createVNode(
              'p',
              { style: { padding: '20px', maxWidth: '200px' } },
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