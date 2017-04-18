<template>
	<div id="content">
		<el-row :key="">
			<el-col :span="24">
				<el-steps space="30%" :active="active" finish-status="success" center="true" align-center="true">
					<el-step title="销售阶段"></el-step>
					<el-step title="实施阶段"></el-step>
					<el-step title="项目完成"></el-step>
				</el-steps>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="7" v-for="(step, index1) in steps" :offset="index1 > 0 ? 1 : 0">
				<el-card :body-style="{ padding: '0px' }">
					<div style="padding: 14px;">
						<span>{{step.name }}</span>
						<mu-list>
							<div v-for="(substep, index2) in step.substeps">
								<mu-list-item :title="substep.name" >
									<mu-avatar slot="leftAvatar" color="deepOrange300" backgroundColor="purple500">完成</mu-avatar>
									<span slot="describe">
										<el-tag :style="{ marginRight: '5px'}"  type="primary">{{endDate(substep.endTime)}}</el-tag>
        								<el-tag :style="{ marginRight: '5px'}" v-for="(personName, index3) in substep.chargePeople" type="primary">{{personName}}</el-tag>
									</span>
									<i class="el-icon-document" slot="right"></i>
								</mu-list-item>
								<mu-divider inset/>
							</div>
						</mu-list>
					</div>
				</el-card>
			</el-col>
		</el-row>

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
	export default {
		data() {
			return {
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
                ],
                active: 0,

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
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                }
			}
		},
		methods: {
			onSubmit() {
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
        computed: {

        }

	}

</script>

<style>
	.time {
		font-size: 13px;
		color: #999;
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