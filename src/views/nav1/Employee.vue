<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getEmployee">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="employees" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column prop="birth" label="生日" width="120" sortable>
				</el-table-column>
				<el-table-column prop="address" label="地址" min-width="180" sortable>
				</el-table-column>
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getEmployeeList } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				employees: [
				]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == true ? '男' : row.sex == false ? '女' : '未知';
			},
			//获取用户列表
			getEmployee: function () {
				let para = {
                    employeeName: this.filters.name
				};
				this.loading = true;
                getEmployeeList(para).then((res) => {
					this.employees = res.data.employees;
					this.loading = false;
					console.log(this.employees);
				});

			}
		},
		mounted() {
			this.getEmployee();
		}
	};

</script>

<style scoped>

</style>