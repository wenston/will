import { computed, defineComponent, h, provide, renderSlot, ref } from 'vue'
export default defineComponent({
    name: 'Scale',
    props: {
        options: {
            type: Object,
            default: () => { }
        },
        uid: {
            type: String,
            default: ''
        }

    },
    emits: ['resize'],
    setup(props, ctx) {
        const handleMouseDown = (e: any) => {
            const component = props.options
            const type = e.target.dataset.type.split('-')[0];
            const move = (me: any) => {
                let t = { ...component };
                // 东西方向能修改宽度
                if (type.indexOf("e") > -1)
                    if (t.width.indexOf('%') > -1) {
                        t.width = `"calc(${t.width} + ${me.movementX}px)"`
                    } else {
                        t.width = Number(t.width.replace("px", "")) + me.movementX + "px";
                    }

                // 南北方向能修改高度
                if (type.indexOf("s") > -1)
                    t.height = Number(t.height.replace("px", "")) + me.movementY + "px";
                // 西北方向需要修改 left top 宽高修改相反
                if (type.indexOf("w") > -1) {
                    if (t.width.indexOf('%') > -1) {
                        t.width = `"calc(${t.width} - ${me.movementX}px)"`
                    } else {
                        t.width = Number(t.width.replace("px", "")) - me.movementX + "px";
                    }
                    t.height = Number(t.height.replace("px", "")) + me.movementY + "px";
                    // t.width = Number(t.width.replace("px", "")) - me.movementX + "px";
                }
                if (type.indexOf("n") > -1) {
                    // t.width = Number(t.width.replace("px", "")) + me.movementX + "px";
                    if (t.width.indexOf('%') > -1) {
                        t.width = `"calc(${t.width} + ${me.movementX}px)"`
                    } else {
                        t.width = Number(t.width.replace("px", "")) + me.movementX + "px";
                    }
                    t.height = Number(t.height.replace("px", "")) - me.movementY + "px";
                }
                //   this.$set(this.componentData[this.selected], "style", t);
                ctx.emit('resize', { ...t, uid: props.uid })
                console.log(t);
            };


            const up = () => {
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        }
        const is = ref(false)

        const doc = computed(() => {
            if (props.options && props.options.width) {
                const component = props.options

                // width = component.width.replace("%", "");

                if (component.width.indexOf('%') > -1) {
                    var width = component.width.replace("%", "");
                    is.value = true
                } else {
                    var width = component.width.replace("px", "");
                    is.value = false
                }
                const height = component.height.replace("px", "");
                return [
                    [0, 0, "nw-resize"],
                    [0, height, "sw-resize"],
                    [width, 0, "ne-resize"],
                    [width, height, "se-resize"],
                    [width / 2, 0, "n-resize"],
                    [width / 2, height, "s-resize"],
                    [0, height / 2, "w-resize"],
                    [width, height / 2, "e-resize"],
                ];


            } else {
                return []
            }
        })
        const dots = computed(() => {
            if (doc.value) {
                return doc.value.map(item => {
                    let obj = {
                        left: item[0] + (is.value ? '%' : 'px'),
                        top: item[1] + 'px',
                        width: 6 + 'px',
                        height: 6 + 'px',

                    }
                    let dataType = item[2]
                    return (<div
                        class={["dots", dataType]}
                        style={
                            obj
                        }
                        onMousedown={handleMouseDown}
                        data-type={dataType}
                    ></div >
                    )

                })
            } else {
                return []
            }
        })
        const contentClick = (e: any) => {
            console.log(e);

        }
        return () => (<div class='scale' onClick={contentClick}>
            <div> {ctx.slots.default?.()}</div>
            {dots.value}
        </div>)
    }
})