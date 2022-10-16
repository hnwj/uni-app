<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<myGoods :goods="goods"></myGoods>
			</view>
		</view>
	</view>
</template>

<script>
	import myGoods from '@/components/my-goods/my-goods.vue'
	export default {
		components: {
			myGoods
		},
		data() {
			return {
				//定义一个参数对象
				queryObj: {
					query: '', // 关键词
					cid: '', // 商品分类id
					pagenum: 1, // 页码
					pagesize: 10 // 每页显示数
				},
				total: 0, //总数据量
				goodsList: [], // 商品列表的数据
				isloading: false, // 是否正在请求（用于节流）
			};
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
		},
		// 触底加载更多
		onReachBottom() {
			// 判断数据是否加载完毕
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
				return uni.$showMsg('数据加载完毕！')
			}
			// 判断是否正在请求数据，请求中，直接return
			if (this.isloading) return
			this.queryObj.pagenum++;
			// 重新获取数据
			this.getGoodsList()
		},
		// 下拉刷新，将数据置为最初始状态
		onPullDownRefresh() {
			this.queryObj.pagenum = 1
			this.total = 0
			this.goodsList = []
			this.isloading = false
			// 2. 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		},
		methods: {
			async getGoodsList(cb) {
				// 请求前，打开节流阀
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 请求完毕后，关闭节流阀
				this.isloading = false
				// 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb()
				if (res.meta.status !== 200) return uni.$showMsg()
				// 对数据进行拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				console.log('this.goodsList', this.goodsList);
			},
			// 点击跳转到商品详情页面
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
