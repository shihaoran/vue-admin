<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="项目名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProjects">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="projects" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="项目名称" min-width="150" sortable>
			</el-table-column>
			<el-table-column prop="chargePeople" label="负责人" width="100" sortable>
			</el-table-column>
			<el-table-column prop="endTime" label="截止日期" width="120" sortable>
			</el-table-column>
			<el-table-column prop="status" label="项目状态" width="120" :formatter="formatStatus" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新建项目" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="项目名称" prop="name">
					<el-input v-model="addFormName" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="负责人">
                    <el-select v-model="addFormChargePeople" filterable placeholder="请选择负责人">
                        <el-option
                                v-for="item in employees"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="截止时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addFormEndTime"></el-date-picker>
                </el-form-item>
				<el-form-item label="销售子阶段">
                    <el-select v-model="addFormSaleSteps" multiple filterable allow-create placeholder="可输入新建">
                        <el-option
                                v-for="item in saleOptions"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="实施子阶段">
                    <el-select v-model="addFormDoSteps" multiple filterable allow-create placeholder="可输入新建">
                        <el-option
                                v-for="item in doOptions"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getProjectListPage, getEmployeeList, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				projects: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

                employees: [],

                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                value: "",

                saleOptions: [{
                    value: '项目信息收集阶段',
                    label: '项目信息收集阶段'
                }, {
                    value: '客户筛选阶段',
                    label: '客户筛选阶段'
                }, {
                    value: '项目筛选阶段',
                    label: '项目筛选阶段'
                }, {
                    value: '收款情况阶段',
                    label: '收款情况阶段'
                }, {
                    value: '招投标阶段',
                    label: '招投标阶段'
                }, {
                    value: '采购合同确定阶段',
                    label: '采购合同确定阶段'
                }],

                doOptions: [{
                    value: '项目指标阶段',
                    label: '项目指标阶段'
                }, {
                    value: '设计阶段',
                    label: '设计阶段'
                }, {
                    value: '生产加工采购阶段',
                    label: '生产加工采购阶段'
                }, {
                    value: '总装测试阶段',
                    label: '总装测试阶段'
                }, {
                    value: '发货阶段',
                    label: '发货阶段'
                }, {
                    value: '用户现场安装调试阶段',
                    label: '用户现场安装调试阶段'
                }, {
                    value: '验收阶段',
                    label: '验收阶段'
                }],

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {},

				addFormName: "",
                addFormEndTime: "",
                addFormChargePeople: "",
				addFormSaleSteps: [],
                addFormDoSteps: [],


			}
		},
		methods: {
			//项目状态转换
			formatStatus: function (row, column) {
				return row.status == 0 ? '销售阶段' :
                    row.status == 1 ? '实施阶段':row.status == 2 ? '项目完成' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getProjects();
			},
			//获取项目列表
			getProjects() {
				let para = {
					page: this.page,
					projectName: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getProjectListPage(para).then((res) => {
					this.total = res.data.total;
					this.projects = res.data.projects;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleInfo: function (index, row) {
                this.$router.push({ path: '/project', query: { projectId: row.projectId }});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
            getEmployee: function () {
                this.loading = true;
                getEmployeeList().then((res) => {
                    this.employees = res.data.employees;
                    this.loading = false;
                    console.log(this.employees);
                });
            },
		},
		mounted() {
			this.getProjects();
			this.getEmployee();
		}
	}

</script>

<style scoped>

</style>