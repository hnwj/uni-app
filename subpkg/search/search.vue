<template>
	<view class="search-box">
		<uni-search-bar @confirm="search" cancelButton="none" @input="input" :radius="100"></uni-search-bar>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length!==0">
			<view class="sugg-item" v-for="(item, index) in searchResults" :key="index"
				@click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 定时器时间
				timer: null,
				// 搜索关键词
				kw: '',
				// 搜索结果列表
				searchResults: [],
				historyList: ['a', 'app', 'apple']
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			input(e) {
				// 对此进行防抖处理
				// 开始之前，现将时间置为空
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e
					// 调用接口，进行搜索
					this.getSearchList()
					console.log(this.kw);
				}, 500)

			},
			// 按照关键词进行搜索
			async getSearchList() {
				// 先判断用户是否输入
				if (this.kw.trim().length === 0) {
					return this.searchResults = []
				}
				// 用户输入，调用
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				console.log('this.searchResults', this.searchResults);
				// 调用方法，存入关键词
				this.saveHistory()
			},
			// 跳转到商品详情页
			gotoDetail(id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
				})
			},
			// 关键词存入历史记录中
			saveHistory() {
				// 使用集合，解决关键词重复问题
				this.historyList.unshift(this.kw)
				this.historyList = [...new Set(this.historyList)]
				// 将搜索关键词存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 清空历史记录
			clearHistory() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
			// 跳转到商品列表页
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + item
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-name {
				// 文字不许换行
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
