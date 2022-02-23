import { computed, defineComponent } from 'vue'
import Close from '../close/index'
import Arrow from '../arrow/index'
import Loading from '../loading/index'

export default defineComponent({
  name: 'Trigger',
  components: { Close, Arrow, Loading },
  props: {
    loading: Boolean,
    active: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    block: Boolean,
    placeholder: [String, Object, Array],
    text: { type: [String, Number, Object, Array] }
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
        _.text && (
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
      return (
        slots.default?.() || (
          <div {...triggerOptions.value}>
            <div class="w-trigger-text">
              {(_.text || slots.text?.()) ?? (
                <span class="w-text-placeholder w-no-select">
                  {_.placeholder}
                </span>
              )}
            </div>
            <div class="w-trigger-icon">
              {renderClose()}
              {_.loading ? (
                <Loading text="" show={_.loading} />
              ) : (
                <Arrow rotate={_.active} />
              )}
            </div>
          </div>
        )
      )
    }
  }
})
