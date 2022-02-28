import { computed, defineComponent } from 'vue'
import Close from '../close/index'
import Icon from '../icon/index'
import Loading from '../loading/index'
import Tooltip from '../tooltip/index'

export default defineComponent({
  name: 'Trigger',
  components: { Close, Icon, Loading, Tooltip },
  props: {
    loading: Boolean,
    active: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    block: Boolean,
    placeholder: [String, Object, Array],
    text: { type: [String, Number, Object, Array] },
    hasTip: { type: Boolean, default: true }
  },
  emits: ['clear'],
  setup(_, { emit, slots }) {
    const triggerOptions = computed(() => {
      return {
        class: [
          'w-trigger',
          {
            'w-trigger-block': _.block,
            'w-trigger-disabled': _.disabled,
            'w-trigger-active': _.active
          }
        ]
      }
    })

    function renderClose() {
      return (
        !_.disabled &&
        _.clearable &&
        (_.text || slots.default) && (
          <Close
            name="w-icon-close-fill"
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              emit('clear')
            }}
          />
        )
      )
    }

    return () => {
      let cont = (
        <div class={['w-trigger-text', 'w-ellipsis']}>
          {(_.text || slots.default?.()) ?? (
            <span class="w-text-placeholder w-no-select">{_.placeholder}</span>
          )}
        </div>
      )
      let main = (
        <div {...triggerOptions.value}>
          {cont}
          <div class="w-trigger-icon">
            {renderClose()}
            {_.loading ? (
              <Loading text="" show={_.loading} />
            ) : (
              <Icon name="w-icon-arrow-down" rotate={_.active} />
            )}
          </div>
        </div>
      )

      return main
    }
  }
})
