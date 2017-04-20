<template>
	<div id="content">
		<div class="board-view" :style="{left:collapsed?'60px':'230px'}">
			<div class="board-stage-view">
				<el-steps space="30%" :active="active" finish-status="success" center="true" align-center="true">
					<el-step title="销售阶段"></el-step>
					<el-step title="实施阶段"></el-step>
					<el-step title="项目完成"></el-step>
				</el-steps>
			</div>
			<div class="board-scrum-view">
				<ul class="board-scrum-stages horizontal-scroll ui-sortable sortable">
					<li v-for="(step, index1) in steps" class="scrum-stage">
						<header class="scrum-stage-header">
							<div class="stage-name">
								<span>{{step.name }}</span>
							</div>
						</header>
						<div class="scrum-stage-wrap">
							<section class="scrum-stage-content thin-scroll">
								<ul class="scrum-stage-tasks">
									<div class="task-card" v-for="(substep, index2) in step.substeps">
										<mu-list-item   toggleNested>
											<mu-avatar slot="leftAvatar" color="deepOrange300" backgroundColor="purple500">完成</mu-avatar>
											<span slot="title" class="clearfix">
											    {{substep.name}}
        								        <el-tag :style="{ marginRight: '5px'}" v-for="(personName, index3) in substep.chargePeople" type="grey">{{personName}}</el-tag>
									        </span>
											<span slot="describe" style="line-height: 28px;" class="clearfix">
										        <el-tag :style="{ marginRight: '5px'}"  type="primary">{{endDate(substep.endTime)}}</el-tag>
									        </span>
                                            <div class="nested-items" slot="nested">
                                                <div class="comment-card" >
                                                    <div v-for="o in 4" class="text item">
                                                        {{'列表内容 ' + o }}
                                                    </div>
                                                </div>
                                                <div class="rate-block">
                                                    <span>评价:</span>
                                                    <el-rate
                                                            v-model="value2"
                                                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                                                    </el-rate>
                                                </div>
                                                <div class="edit-block">
                                                    <el-button :plain="true" type="info" size="small" @click.native="editFormVisible = true">编辑</el-button>
                                                    <el-button :plain="true" type="danger" size="small">删除</el-button>
                                                </div>
                                            </div>
										</mu-list-item>
									</div>
								</ul>
							</section>
						</div>
                        <div class="task-creator-handler-wrap">
                            <el-button type="primary" >新任务</el-button>
                        </div>
					</li>
				</ul>
			</div>
		</div>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="阶段名称" >
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="完成情况">
					<el-radio-group v-model="editForm.active">
						<el-radio class="radio" :label="true">进行中</el-radio>
						<el-radio class="radio" :label="false">已完成</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="负责人">
                    <multiselect v-model="editForm.chargePeople" :options="people"
                                 :multiple="true" :close-on-select="false" :clear-on-select="false"
                                 :hide-selected="true" placeholder="请选择负责人"
                                 label="name" track-by="name">
                    </multiselect>
				</el-form-item>
				<el-form-item label="起始日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="截止日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.comment"></el-input>
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
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</div>



</template>



<script>
    import Multiselect from 'vue-multiselect'

	export default {
        components: { Multiselect },
        props: ['collapsed'],
		data() {
			return {
                value: null,
                options: ['list', 'of', 'options'],
				people: [
					{
					    id:'1',
						name:'王新',
					},
					{
					    id:'2',
						name:'张丽',
					},
				],
                steps: [
					{
					    id:'0',
					    name:'项目信息收集',
						substeps:[
							{
							    name:'阶段1',
								active:false,
								chargePeople:[
								    "王二妈",
									"离死亡",
								],
								startTime:"2017-03-20",
								endTime:"2017-05-20",
							},
                            {
                                name:'阶段2',
                                active:true,
                            },
							{
                                name:'阶段3',
                                active:true,
                            },
						],
					},
                    {
                        id:'1',
                        name:'客户筛选',
                        substeps:[
                            {
                                name:'阶段1',
                                active:false,
                            },
                            {
                                name:'阶段2',
                                active:true,
                            },
                            {
                                name:'阶段3',
                                active:true,
                            },
                        ],
                    },
                    {
                        id:'2',
                        name:'客户筛选',
                        substeps:[
                            {
                                name:'阶段1',
                                active:false,
                            },
                            {
                                name:'阶段2',
                                active:true,
                            },
                            {
                                name:'阶段3',
                                active:true,
                            },
                        ],
                    },
                    {
                        id:'3',
                        name:'客户筛选',
                        substeps:[
                            {
                                name:'阶段1',
                                active:false,
                            },
                            {
                                name:'阶段2',
                                active:true,
                            },
                            {
                                name:'阶段3',
                                active:true,
                            },
                        ],
                    },
                ],
                active: 0,

                people: [
                    { name: '王二红', pid: 'JavaScript' },
                    { name: '张鲁斯', pid: 'JavaScript' },
                    { name: '杨一鸣', pid: 'Ruby' },
                    { name: '宁这则', pid: 'Ruby' },
                    { name: '李子轩', pid: 'PHP' },
                    { name: '平行', pid: 'Elixir' }
                ],

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
                editForm: {
                    id: 0,
                    name: "",
                    active: "",
                    chargePeople: [],
                    startTime: "",
                    endTime: "",
                    comment: "",
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },


            }
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
            onEdit() {
                editFormVisible=true;
            },
            onDelete() {
                console.log('submit!');
            },
            endDate: function (str) {
			    if(str==undefined)
			        return null;
                var d = new Date(str.replace(/-/g, "/"));
                var dn = new Date();
                if(d>dn)
                {
                    return d.getMonth()+1+"月"+d.getDate()+"日 截止";
                }
                else
                {
                    return "已截止"
                }
            }
		},
        watch: {


		},
        computed: {
            screenHeight: function () {
                console.log(this.$root.collapsed);
                return window.innerHeight-250+"px";
            },
        },

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
    .board-scrum-view {
        position: relative;
        height: 20%;
    }
	.board-scrum-view {
		position: relative;
		height: 90%;
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
		position: relative;
		height: 100%;
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