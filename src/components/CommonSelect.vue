<!--
 * @description  : 通用下拉列表分页组件
 * @Author       : snoop-dog
 * @Date         : 2021-04-09 11:41:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2022-02-16 10:15:28
 * @FilePath     : common-select.vue
-->

<template>
	<el-container 
		class="select-container" 
		:style="{
			width: containerWidth ? containerWidth : '100%', 
			height: containerHeight ? containerHeight : '100%'
		}"
	>
		<el-select
			ref="commonSelect"
			v-model="selectValue"
			:disabled="disabled"
			:loading="loading"
			:clearable="clearable"
			:multiple="multiple"
			:collapse-tags="collapseTags"
			:popper-class="popperClass"
			:filterable="filterable"
			:placeholder="placeholder"
			:remote="remote"
			:filter-method="filterOption"
			v-load-more="loadOption"
			:automatic-dropdown="automaticDropdown"
			:no-data-text="noDataText"
			@change="changeSelectItem"
			@blur="closeOptionList"
			@focus="focusSelect"
			:style="{
				width: containerWidth ? containerWidth : '100%', 
				height: containerHeight ? containerHeight : '100%'
			}"
		>
			<el-option 
				v-for="item in optionList" 
				v-show="!item.hide"
				v-html="item[defaultProps.labelHtml]"
				:key="item[defaultProps.value]"
				:value="item[defaultProps.value]"
				:label="item[defaultProps.label]"
				:disabled="item[defaultProps.disabled]"
			>
			</el-option>
			<el-row class="scroll-loading" v-if="scrollLoading">
				<i class="el-icon-loading"></i>
				加载中，请稍后
			</el-row>
    	<el-row class="no-more" v-if="noMore">已经到底啦</el-row>
		</el-select>
	</el-container>
</template>
<script>
// apis
import {
	// loadUserListApi, // 获取所有用户列表
  loadUserListByPageApi, // 分页获取用户列表
} from "@/apis";
import {
    mapGetters
  } from 'vuex'
let _self
export default {
  name: "common-select",
  props: {
		value: {
			type: [String, Number, Array]
		},
		componentName: {
			// 通用下拉组件名称，作用：数据隔离
			type: String,
			default: 'select'
		},
		componentValue: {
			type: [Array, String]
		},
		containerWidth: {
			// 组件容器宽度
			type: String,
			default: '100%'
		},
		containerHeight: {
			// 组件容器高度
			type: String,
			default: '100%'
		},
		selectData: {
			// select下拉框数据
			type: Array,
			default: () => []
		},
		defaultProps: {
			// 默认数据展示属性
			type: Object,
			default: () => {
				return {
					value: 'id',
					label: 'name',
					labelHtml: 'labelHtml',
					disabled: 'disabled'
				}
			}
		},
		disabled: {
			// 是否禁用,默认false
			type: Boolean,
			default: false
		},
		clearable: {
			// 是否可清除select下拉列表值
			type: Boolean,
			default: true
		},
    multiple: {
      // select下拉框是否可多选，默认多选
      type: Boolean,
      default: true,
    },
		collapseTags: {
			// 多选时是否将选中值按文字的形式展示，默认不折叠
			type: Boolean,
			default: false
		},
		multipleLimit: {
			// 多选时用户最多可以选择的项目数，为 0 则不限制
			type: Number,
			default: 0
		},
		placeholder: {
			// 占位符
			type: String,
			default: '请选择'
		},
		filterable: {
			// 是否可搜索
			type: Boolean,
			default: false
		},
		remote: {
			// 是否为远程搜索
			type: Boolean,
			type: false
		},
		remoteMethods: {
			// 远程搜索方法
			type: Function,
			default: () => function () {}
		},
		noMatchText: {
			// 搜索条件无匹配时显示的文字
			type: String,
			default: '暂无数据'
		},
		loading: {
			// 是否正在从远程获取数据
			type: Boolean,
			default: false
		},
		loadingText: {
			// 远程加载时显示的文字
			type: String,
			default: '加载中，请稍后'
		},
		noDataText: {
			// 选项为空时显示的文字
			type: String,
			default: '暂无搜索结果'
		},
		popperClass: {
			// Select 下拉框的类名
			type: String,
			default: ''
		},
		automaticDropdown: {
			// 对于不可搜索的 Select，
			// 是否在输入框获得焦点后自动弹出选项菜单
			type: Boolean,
			default: false
		},
		optionSlotHtml: {
			// option自定义模板
			type: String,
			default: ''
		},
		apiPageObj: {
			// 请求单页下拉列表对象
			type: Object,
			require: true,
			default: () => {
				return {
					reqUrl: '', // 请求url
					headers: {}, // 请求头
					params: {}, // 请求参数
					api: '' // 请求api
				}
			}
		},
		allSelectData: {
			// 下拉列表全数据
			type: Array,
			require: true,
			default: () => []
		}
  },
	data () {
		return {
			// selectValue: [], // select value
			scrollLoading: false, // option scroll loading
			optionList: [], // 下拉框列表数据
			filterText: '', // 搜索框过滤文字
			pageIndex: 1, // 当前页码
			totalPage: 1, // 总页数
			completeReq: false, // 请求是否完成
			allSelectList: [], // 所有用户列表
		}
	},
	computed: {
		...mapGetters(['loginInfo', 'userInfo']),
		noMore () {
			// 是否还有更多数据加载
			return this.pageIndex >= this.totalPage && this.completeReq
		},
		headers() {
			// 请求头
			let loginInfo = this.loginInfo
			let fixedHeaders = {}
			if (loginInfo && loginInfo.userLoadResultList) {
				let userLoad = loginInfo.userLoadResultList[0]
				fixedHeaders.orgCode = userLoad.organizationId
				fixedHeaders.orgName = encodeURIComponent(userLoad.organizationName)
				fixedHeaders.phoneNumber = userLoad.tel
			}
			return fixedHeaders
		},
		selectValue: {
			// 下拉框值
			get () {
				return this.value
			},
			set (val) {
				if (this.multiple) {
					this.$emit('input', [...val])
				} else {
					this.$emit('input', val)
				}
			}
		}
	},
	directives: {
		'load-more': {
			bind (el, binding) {
        // 获取element-ui定义好的scroll盒子  Select 选择器的下拉盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          // 判断滚动到底部
          const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (CONDITION) {
          	// binding.value 是指令的绑定值，该值可能是字符串，数字、函数
          	// binding.value() 表示执行 v-loadmore 绑定的函数
            _self.completeReq && binding.value()
          }
        })
      }
		}
	},
	beforeCreate () {
		_self = this
	},
	mounted () {
		this.getUserList() // 获取所有用户列表
	},
	methods: {
		/**
		 * @description: 下拉加载
		 * @param {*} none
		 * @return {*} void
		 */
		loadOption () {
			if (this.noMore) return
			this.$emit('load-data', this.pageIndex + 1)
			// this.$emit('search-option', this.filterText)
		},
		/**
		 * @description: 获取所有用户列表
		 * @param {*} none
		 * @return {*} void
		 */
		getUserList () {
			this.allSelectList = this.allSelectData
			this.getUserListByPage() // 获取用户分页下拉列表
		},
		/**
		 * @description: 分页获取用户列表
		 * @param {*} none
		 * @return {*} void
		 */
		getUserListByPage () {
			this.scrollLoading = true
			this.completeReq = false
			
			this.apiPageObj.api(this.apiPageObj.params, this.apiPageObj.reqUrl, this.apiPageObj.headers).then(res => {
				this.scrollLoading = false
				this.completeReq = true
				const list = res.data?.data?.list || res.data.items
				this.pageIndex = res.data?.data?.currentPage || res.data.currentPage
				this.totalPage = res.data?.data?.totalPage || res.data.totalPage
				list.map((item) => {
					this.$set(item, this.defaultProps.labelHtml, item[this.defaultProps.label])
				})
				if (this.pageIndex === 1) {
					this.optionList = [...list]
				} else {
					let array = [...this.optionList, ...list]
					this.optionList = JSON.parse(JSON.stringify(array))
				}
				if (typeof(this.value) === 'object') {
					if (this.value.length) {
						const obj = { hide: true }
						const catchArray = this.value.filter(x => {
							return !this.optionList.reduce((prev, cur) => {
												prev.push(cur[this.defaultProps.value])
												return prev
											}, [])
											.includes(x)
						})
						catchArray.length && 
						catchArray.map(x => {
							const item = this.allSelectList.filter(k => k[this.defaultProps.value] === x)
							item.length && this.optionList.push({...obj, ...item[0]})
						})
					
					}
				} else {
					if (this.value) {
						if (!this.optionList.some(x => x[this.defaultProps.value] === this.value)) {
							const obj = { hide: true }
							const catchItem = this.allSelectList.filter(x => x[this.defaultProps.value] === this.value)
							catchItem.length && this.optionList.push(Object.assign(obj, catchItem[0]))
						}
					}
				}
				// 高亮筛选文字
				if (this.filterText) {
					if (this.multiple) {
						this.optionList.map(item => {
							if (this.value && !this.value.includes(item[this.defaultProps.value])) {
								item[this.defaultProps.labelHtml] = 
									item[this.defaultProps.labelHtml].replace(this.filterText, `<span style="color: #2676f6">${this.filterText}</span>`)
							}
						})
					} else {
						this.optionList.map(item => {
							if (this.value !== item[this.defaultProps.value]) {
								item[this.defaultProps.labelHtml] = 
									item[this.defaultProps.labelHtml].replace(this.filterText, `<span style="color: #2676f6">${this.filterText}</span>`)
							}
						})
					}
				}
			})
			.catch(err => {
				console.log(err)
				this.scrollLoading = false
				this.completeReq = true
				this.optionList = []
				this.pageIndex = 1
				this.totalPage = 1
			})
		},
		/**
		 * @description 编辑时回显
		 * @param {string | number} id 回显下拉列表id
		 * @returns void
		 */
		echoFn(id){  //回显
			// 回显时处理不是第一页数据
				if (typeof(id) === 'object') {
					if (id.length) {
						const obj = { hide: true }
						const catchArray = id.filter(x => {
							return !this.optionList.reduce((prev, cur) => {
												prev.push(cur[this.defaultProps.value])
												return prev
											}, [])
											.includes(x.tuUserId)
						})
						catchArray.length && 
						catchArray.map(x => {
							const item = this.allSelectList.filter(k => k[this.defaultProps.value] === x.tuUserId)
							item.length && this.optionList.push({...obj, ...item[0]})
						})
					}
				} else {
					if (id) {
						if (!this.optionList.some(x => x[this.defaultProps.value] === id)) {
							const obj = { hide: true }
							const catchItem = this.allSelectList.filter(x => x[this.defaultProps.value] === id)
							catchItem.length && this.optionList.push(Object.assign(obj, catchItem[0]))
						}
					}
				}
		},
		/**
		 * @description: 选中值发生变化时触发
		 * @param {Array} array 当前选中值数组
		 * @return {*} void
		 */
		changeSelectItem (array) {
			var dealArray
			if (typeof(array) === 'array') {
				dealArray = [...array]
			} else {
				dealArray = String(array).split(',')
			}
			this.optionList.map(x => {
				if(x[this.defaultProps.labelHtml]){
					dealArray.includes(x[this.defaultProps.value]) && 
				(
					x[this.defaultProps.labelHtml] = x[this.defaultProps.labelHtml].replace(`<span style="color: #2676f6">`, '').replace(`</span>`, '')
				)
				}
			})
			
      const names = this.allSelectData.length && this.allSelectData.reduce((prev, cur) => {
        if (dealArray.includes(cur[this.defaultProps.value])) {
          prev.push(cur[this.defaultProps.label])
          return prev
        } else {
          return prev
        }
      }, [])
      
			this.$emit('change-' + this.componentName, array, names)
			!this.multiple && (this.filterText = '')
		},
		/**
		 * @description: 输入框失去焦点清空筛选文字
		 * @param {*} none
		 * @return {*} void
		 */
		closeOptionList () {
			// this.filterText = ''
		},
		/**
		 * @description: 解决多选模式下blur事件不能触发
		 * @param {*} none
		 * @return {*} void
		 */
		focusSelect () {
			this.$refs.commonSelect.blur = () => {
				// this.filterText = ''
			}
		},
		/**
		 * @description: select搜索方法
		 * @param {String} filterText 输入框搜索值
		 * @return {*} void
		 */
		filterOption (filterText) {
			// console.log(filterText)
			this.filterText = filterText
			this.$emit('load-data', 1)
			this.$emit('search-option', this.filterText)
		}
	},
	watch: {
		filterText (newVal, oldVal) {
			// 监听输入框搜索文字
			// !newVal && (this.optionList = [...this.selectData])
			this.filterText = newVal
			this.pageIndex = 1
			this.$emit('search-option', this.filterText)
			// this.getUserListByPage()
		},
		apiPageObj: {
			handler(val) {
				console.log(val)
				this.getUserListByPage()
			},
			deep: true
		}
	}
};
</script>
<style lang="scss" scoped>
.el-input__inner::-webkit-input-placeholder { 
	/* WebKit browsers */ 
	color: #999 !important; 
	padding-left: 20px;
} 
.el-input__inner:-moz-placeholder { 
	/* Mozilla Firefox 4 to 18 */ 
	color: #999 !important; 
	padding-left: 20px;
} 
.el-input__inner::-moz-placeholder { 
	/* Mozilla Firefox 19+ */ 
	color: #999 !important; 
	padding-left: 20px;
} 
.el-input__inner:-ms-input-placeholder { 
	/* Internet Explorer 10+ */ 
	color: #999 !important; 
	padding-left: 20px;
}
.select-container {
	width: 100%;
	height: 100%;
	padding: 0 !important;
	.el-select {
		width: 100%;
		height: 100%;
		/deep/.el-input {
			.el-input__inner {
				// height: inherit !important;
			}
		}
	}
}
.el-select-dropdown {
	.el-select-dropdown__wrap {
		.el-select-dropdown__list {
			.el-select-dropdown__item {
				&.selected {
					&::after {
						color: #4290e7;
					}
				}
			}
			.scroll-loading,
			.no-more {
				text-align: center;
				padding: 5px 0;
				color: #999;
			}
			.no-more {
				position: relative;
				&::before {
					content: "";
					width: calc(30% - 35px);
					height: 1px;
					background: #999;
					position: absolute;
					top: 50%;
					left: 15%;
				}
				&::after {
					content: "";
					width: calc(30% - 35px);
					height: 1px;
					background: #999;
					position: absolute;
					top: 50%;
					right: 15%;
				}
			}
		}
	}
}
</style>