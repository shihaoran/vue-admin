<template>
	<div id="content">
		<div class="board-view" :style="{left:collapsed?'60px':'230px'}">
			<div class="board-stage-view">
				<el-steps space="30%" :active="active" finish-status="success" center align-center>
					<el-step title="销售阶段"></el-step>
					<el-step title="实施阶段"></el-step>
					<el-step title="项目完成"></el-step>
				</el-steps>
			</div>
			<div class="board-scrum-view" v-loading="loading">
				<ul class="board-scrum-stages horizontal-scroll ui-sortable sortable">
					<li v-for="(step, index1) in steps" class="scrum-stage">
						<header class="scrum-stage-header">
							<div class="stage-name">
								<span>{{step.stepName }}</span>
							</div>
						</header>
						<div class="scrum-stage-wrap">
							<section class="scrum-stage-content thin-scroll">
								<ul class="scrum-stage-tasks">
									<div class="task-card" v-for="(task, index2) in taskInId(step.stepId)">
										<mu-list-item   toggleNested>
											<mu-avatar v-if="task.taskActive" slot="leftAvatar" :size="40" color="#FFFFFF" backgroundColor="#58B7FF">待办</mu-avatar>
                                            <mu-avatar v-else slot="leftAvatar" color="#FFFFFF" :size="40" backgroundColor="#13CE66">完成</mu-avatar>
											<span slot="title" class="clearfix" style="white-space: normal">
											    {{task.taskName}}
        								        <el-tag :style="{ margin: '3px 3px 0px 0px'}" v-for="(personName, index3) in task.taskChargePeople" type="grey">{{personName}}</el-tag>
									        </span>
											<span slot="describe" style="line-height: 28px;" class="clearfix">
										        <el-tag :style="{ marginRight: '5px'}"  type="primary">{{endDate(task.taskEndTime)}}</el-tag>
									        </span>
                                            <div class="nested-items" slot="nested">
                                                <div class="comment-card" >
													<p>{{task.taskComment}}</p>
                                                </div>
                                                <div class="rate-block">
                                                    <span>评价:</span>
                                                    <el-rate
                                                            v-model="task.taskRate"
                                                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                                                    </el-rate>
                                                </div>
                                                <div class="edit-block">
                                                    <el-button :plain="true" type="info" size="small" @click.native="onEdit(task)">编辑</el-button>
                                                    <el-button :plain="true" type="danger" size="small" @click.native="onDeleteDialog(task.taskId)">删除</el-button>
                                                </div>
                                            </div>
										</mu-list-item>
									</div>
								</ul>
							</section>
						</div>
                        <div class="task-creator-handler-wrap">
                            <el-button type="primary" @click.native="onAdd(step.stepId)">新任务</el-button>
                        </div>
					</li>
				</ul>
			</div>
		</div>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="阶段名称" >
					<el-input v-model="editForm.taskName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="完成情况">
					<el-radio-group v-model="editForm.taskActive">
						<el-radio class="radio" :label="true">进行中</el-radio>
						<el-radio class="radio" :label="false">已完成</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="负责人">
                    <multiselect v-model="editChargePeople" :options="employees"
                                 :multiple="true" :close-on-select="false" :clear-on-select="false"
                                 :hide-selected="true" placeholder="请选择负责人"
                                 label="name" track-by="name">
                    </multiselect>
				</el-form-item>
				<el-form-item label="起始日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.taskStartTime" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="截止日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.taskEndTime" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.taskComment"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="阶段名称" >
                    <el-input v-model="addForm.taskName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="完成情况">
                    <el-radio-group v-model="addForm.taskActive">
                        <el-radio class="radio" :label="true">进行中</el-radio>
                        <el-radio class="radio" :label="false">已完成</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="负责人">
                    <multiselect v-model="addChargePeople" :options="employees"
                                 :multiple="true" :close-on-select="false" :clear-on-select="false"
                                 :hide-selected="true" placeholder="请选择负责人"
                                 label="name" track-by="name">
                    </multiselect>
                </el-form-item>
                <el-form-item label="起始日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.taskStartTime" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="截止日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.taskEndTime" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addForm.taskComment"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        <!--删除弹框-->
        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>确定要删除么？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onDelete">确 定</el-button>
            </span>
        </el-dialog>

	</div>



</template>



<script>
    import Multiselect from 'vue-multiselect';
    import util from '../../common/js/util'
    import { getEmployeeList, getProjectInfo } from '../../api/api';


	export default {
        components: { Multiselect },
        props: ['collapsed',''],
		data() {
			return {
			    loading: false,
				employees: [],
                steps: [],
                tasks: [],

                active: 0,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入阶段名称', trigger: 'blur' }
                    ],
                    active: [
                        { required: true, message: '请输入项目状态', trigger: 'blur' }
                    ],
                    startTime: [
                        { required: true, message: '请输入项目起始时间', trigger: 'blur' }
                    ],
                    endTime: [
                        { required: true, message: '请输入项目结束时间', trigger: 'blur' }
                    ],

                },
                //编辑界面数据
                editForm: {},
                editTaskId: "",
                editTask: {},
                editChargePeople: [],

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    taskId: "",
                    stepId: "",
                    taskName: "",
                    taskActive: "",
                    taskChargePeople: [],
                    taskStartTime: "",
                    taskEndTime: "",
                    taskComment: "",
                    taskRate: "",
                },
                addChargePeople: [],


                dialogVisible: false,
                deleteTaskId: "",



            }
		},
		methods: {
            editSubmit() {
                this.editLoading=true;
                let names = [];

                for (let i = this.editChargePeople.length; i--;) {
                    names.push(this.editChargePeople[i].name);
                }
                this.editForm.taskChargePeople=names;
                this.editChargePeople=[];

                this.editForm.taskStartTime = (!this.editForm.taskStartTime || this.editForm.taskStartTime == '') ? ''
                    : util.formatDate.format(new Date(this.editForm.taskStartTime), 'yyyy-MM-dd');
                this.editForm.taskEndTime = (!this.editForm.taskEndTime|| this.editForm.taskEndTime == '') ? ''
                    : util.formatDate.format(new Date(this.editForm.taskEndTime), 'yyyy-MM-dd');

                for (let i = this.tasks.length; i--;) {
                    if(this.tasks[i].taskId===this.editTaskId)
                    {

                        let temp=JSON.parse(JSON.stringify(this.editForm))
                        this.tasks.splice(i, 1, temp)
                    }
                }

                //this.editTask=this.editForm;
                //console.log(this.editForm);
                this.editFormVisible=false;
                this.editLoading=false;
			},
            addSubmit() {
                this.addLoading=true;
                let names = [];

                for (let i = this.addChargePeople.length; i--;) {
                    names.push(this.addChargePeople[i].name);
                }
                this.addForm.taskChargePeople=names;
                this.addChargePeople=[];

                this.addForm.taskStartTime = (!this.addForm.taskStartTime || this.editForm.taskStartTime == '') ? ''
                    : util.formatDate.format(new Date(this.addForm.taskStartTime), 'yyyy-MM-dd');
                this.addForm.taskEndTime = (!this.addForm.taskEndTime|| this.editForm.taskEndTime == '') ? ''
                    : util.formatDate.format(new Date(this.addForm.taskEndTime), 'yyyy-MM-dd');

                let temp=JSON.parse(JSON.stringify(this.addForm))
                this.tasks.push(temp);

                for (let i in this.addForm) {
                    this.addForm[i]="";
                }

                this.addFormVisible=false;
                this.addLoading=false;
            },
            dateToStr(d) {
                if(typeof d === "string")
                {
                    return d;
                }
                return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
            },
            onEdit(task) {
                var temp = JSON.parse(JSON.stringify(task));
                this.editForm=temp;
                //this.editForm=task;
			    this.editFormVisible=true;
			    this.editTaskId=task.taskId;
			    //this.editTask=task;
            },
            onAdd(stepId) {
                this.addForm.stepId=stepId;
                this.addFormVisible=true;
            },
            onDelete() {
                let that=this;
                this.tasks=this.tasks.filter(function (item) {
                    if(item.taskId === that.deleteTaskId)
                        return false;
                    return true;
                });
                this.dialogVisible=false;
            },
            onDeleteDialog(taskId) {
                this.deleteTaskId=taskId;
                this.dialogVisible=true;
            },
            endDate: function (str) {
                if(typeof str === "string")
                {
                    if(str==undefined)
                        return null;
                    var d = new Date(str.replace(/-/g, "/"));
                }
			    else
			        var d = str;
                var dn = new Date();
                if(d>dn)
                {
                    return d.getMonth()+1+"月"+d.getDate()+"日 截止";
                }
                else
                {
                    return "已截止"
                }
            },
            getProject: function () {
                let para = {
                    //projectId: this.$route.params.id,
                    projectId: "20",
                };
                this.loading = true;
                getProjectInfo(para).then((res) => {
                    this.steps = res.data.steps;
                    this.tasks = res.data.tasks;
                    this.loading = false;
                    console.log(this.steps);
                    console.log(this.tasks);
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
            taskInId: function (stepId) {
                return this.tasks.filter(task => {
                    if (task.stepId === stepId) return true;
                    return false;
                });
            },
		},
        watch: {


		},
        computed: {

        },
        mounted() {
            this.getEmployee();
            this.getProject();
        }

	}

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
	.board-view {
		position: fixed;
		top: 100px;
		right: 0;
		bottom: 0;
		padding: 0;
		overflow: hidden;
	}
    .board-stage-view {
        position: absolute;
        top: 0;
        height: 50px;
        width: 100%;
    }
	.board-scrum-view {
		position: absolute;
        top: 50px;
		bottom: 10px;
        width: 100%;
	}
	.board-scrum-stages {
		position: relative;
		padding: 10px;
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		height: 100%;
	}
	.scrum-stage {
		position: relative;
		height: 100%;
		width: 300px;
		display: -webkit-inline-flex;
		display: -ms-inline-flexbox;
		display: inline-flex;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-align-items: stretch;
		-ms-flex-align: stretch;
		align-items: stretch;
		margin-right: 10px;
		vertical-align: top;
		background-color: #EEEEEE;
		border-radius: 3px;
	}
    .scrum-stage .scrum-stage-header {
		-webkit-flex: 0 0 auto;
		-ms-flex: 0 0 auto;
		flex: 0 0 auto;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-flex-direction: row;
		-ms-flex-direction: row;
		flex-direction: row;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		padding: 14px 18px;
		font-size: 15px;
		font-weight: bold;
		z-index: 1;
	}
    .scrum-stage .scrum-stage-header .stage-name {
		-webkit-flex: 1 1 auto;
		-ms-flex: 1 1 auto;
		flex: 1 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.scrum-stage .scrum-stage-wrap {
		position: absolute;
        top: 50px;
        bottom: 60px;
		-webkit-flex: 1 1 auto;
		-ms-flex: 1 1 auto;
		flex: 1 1 auto;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
	}
    .scrum-stage .scrum-stage-content {
        -webkit-flex: 1 1 0;
        -ms-flex: 1 1 0px;
        flex: 1 1 0;
        overflow: auto;
        overflow-x: visible;
        -webkit-overflow-scrolling: touch;
    }
    .scrum-stage .scrum-stage-content > ul {
        margin-bottom: 8px;
    }

    .scrum-stage .scrum-stage-tasks {
        padding-left: 0px;
    }

    .scrum-stage .task-card {
        margin: 0 8px 8px;
        padding: 0;
        background-color: white;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .scrum-stage .task-card .comment-card{
        margin: 0 8px 8px;
        padding: 5px 10px;
        background-color: #fff59d;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		white-space: normal;
    }

    .scrum-stage .task-card .rate-block{
        margin: 0 8px 8px;
    }
    .scrum-stage .task-card .edit-block{
        margin: 0 20px 10px;
        float: right;
    }

    .scrum-stage .task-creator-handler-wrap {
        position: absolute;
        bottom: 0;
        height: 60px;
        padding: 10px 15px 15px 15px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        width: 100%;
        background-color: #EEEEEE;
    }


	.bottom {
		margin-top: 13px;
		line-height: 12px;
	}

	.button {
		padding: 0;
		float: right;
	}

	.image {
		width: 100%;
		display: block;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}
	.el-row {

		margin-bottom: 0px;
	&:last-child {
		 margin-bottom: 0;
	 }
	}
	#content {
		padding: 30px;
	}


</style>