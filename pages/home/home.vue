<template>
	<view>
		<view class="search-box">
			<mySearch @click="gotoSearch"></mySearch>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" circular :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,index) in navList" :key="item.name" @click="navClickHandler(item)">
				<image :src="item.image_src" mode="" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,index) in floorList" :key="item.name">
				<image :src="item.floor_title.image_src" mode="" class="floor-title"></image>
				<view class="floor-box">
					<!-- 左侧大盒子 -->
					<navigator class="floor-box-left" :url="item.product_list[0].url">
						<image :style="{width:item.product_list[0].image_width+'rpx'}"
							:src="item.product_list[0].image_src" mode="widthFix"></image>
					</navigator>
					<!-- 右侧大盒子 -->
					<view class="floor-box-right">
						<navigator class="floor-box-img" v-for="(item2,index2) in item.product_list" :key="item2.name"
							v-if="index2!==0" :url="item2.url">
							<image :style="{width:item2.image_width+'rpx'}" :src="item2.image_src" mode="widthFix">
							</image>
						</navigator>
					</view>
				</view>
			</view>
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
				// 轮播图数据
				swiperList: [],
				// 分类导航数据
				navList: [],
				// 楼层数据
				floorList: [],
			};
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			// 获取轮播图数据
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.swiperList = res.message
				console.log('this.swiperList', this.swiperList);
			},
			// 获取nav导航数据
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
				console.log('this.navList', this.navList);
			},
			// 跳转到cate
			navClickHandler(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 获取楼层数据
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg()
				// 对数据进行处理
				res.message.forEach((item) => {
					item.product_list.forEach((prod) => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split(
							'?')[1]
					})
				})
				this.floorList = res.message
				console.log('this.floorList', this.floorList);
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
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.floor-box {
		display: flex;
		padding-left: 10rpx;

		.floor-box-right {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}

	// 实现上滑，搜索框置顶
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
