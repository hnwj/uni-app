<template>
	<view class="">
		<!-- 搜索框 -->
		<mySearch @click="gotoSearch"></mySearch>
		<view class="scroll-container">
			<scroll-view scroll-y="true" class="scroll-left" :style="{height:wh+'px'}">
				<block v-for="(item,index) in cateList" :key="item.cat_id">
					<view :class="['scroll-left-item',index===active?'active':'']" @click="handleActive(index)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<scroll-view class="scroll-right" scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item,index) in cateLevel2" :key="item.cat_id">
					<view class="cate-lv2-title">/ {{item.cat_name}} /</view>
					<!-- 渲染三级分类 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" @click="gotoGoodsList(item3)"
							v-for="(item3, index3) in item.children" :key="item3.cat_id">
							<image :src="item3.cat_icon.replace('dev','web')" mode=""></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import mySearch from '@/components/my-search/my-search.vue'
	export default {
		components: {
			mySearch
		},
		data() {
			return {
				// 窗口可用高度 = 屏幕高度 - navgationBar高 - tabbar高
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 切换商品
				active: 0,
				// 二级分类数据
				cateLevel2: [],
				// 重置
				scrollTop: 0
			};
		},
		onLoad() {
			// 获取系统高度
			const sysInfo = uni.getSystemInfoSync()
			console.log(sysInfo.windowHeight);
			// 这里减去50，是因为my-search组件的高度是50
			this.wh = sysInfo.windowHeight - 50
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message
				this.cateLevel2 = res.message[0].children
				console.log('this.cateList', this.cateList);
				console.log('this.cateLevel2', this.cateLevel2);
			},
			handleActive(index) {
				this.active = index
				// 切换商品展示
				this.cateLevel2 = this.cateList[index].children
				// 重置，跳到顶部
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			// 路由跳转到详情页
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?cid=' + item3.cat_id
				})
			},
			// 搜索跳转
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-container {
		display: flex;

		.scroll-left {
			width: 120px;

			.scroll-left-item {
				height: 60px;
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				&.active {
					background: #fff;
					position: relative;

					&::before {
						content: '';
						display: block;
						width: 3px;
						height: 30px;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						background-color: #C00000;
					}
				}
			}
		}
	}

	.scroll-right {
		flex: 1;

		.cate-lv2-title {
			text-align: center;
			padding: 15px 0;
			font-size: 12px;
			font-weight: bold;
		}

		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;

			.cate-lv3-item {
				width: 33.33%;
				margin-bottom: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>
