export default {
  data: Array,
  columns: [Array, Function],
  stripe: Boolean,
  hover: { type: Boolean, default: true },
  nowrap: { type: Boolean, default: true },
  height: String,
  maxHeight: String,
  autoWidth: Boolean,
  hasCheckbox: Boolean,
  checkable: Function, //返回{checked:boolean,disabled:boolean}//选中状态，能否点选，高亮也适用
  checkKey: { type: String, default: "Id" }, //用于checkbox或者radio的选择
  keys: { type: Array, default: () => [] }, //用于checkboxKey的双向绑定
  hasRadio: Boolean,
  modelValue: [String, Number], //支持v-model
  hasAction: [Boolean, Array, String], //true/false,['add','delete'],'add'/'delete'
  //序列、行号
  hasIndex: Boolean,
  indexContent: { type: String, default: "#" },
  pageSize: [String, Number],
  pageIndex: [String, Number],
  //列宽调整
  resize: { type: Boolean, default: true },
  //高亮
  canHighlight: Boolean,
  highlightKey: { type: String, default: "Id" }, //高亮时，所依据的那个字段名，跟checkKey一样，支持多字段组合，多字段时以逗号分隔
  highlight: [String, Number], //高亮时，根据highlightKey得出的值，支持v-model:highlight
  //左右固定列
  leftFixed: [Number, String],
  rightFixed: [Number, String]
}
