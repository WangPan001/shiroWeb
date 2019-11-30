<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="用户名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:user:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
		<el-form :inline="true" :size="size">
			<el-form-item>
				<el-button-group>
				<el-tooltip content="刷新" placement="top">
					<el-button icon="fa fa-refresh" @click="findPage(null)"></el-button>
				</el-tooltip>
				<el-tooltip content="列显示" placement="top">
					<el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
				</el-tooltip>
				<el-tooltip content="导出" placement="top">
					<el-button icon="fa fa-file-excel-o"></el-button>
				</el-tooltip>
				</el-button-group>
			</el-form-item>
		</el-form>
		<!--表格显示列界面-->
		<table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" 
			@handleFilterColumns="handleFilterColumns"> 
		</table-column-filter-dialog>
	</div>
	<!--表格内容栏-->
	<kt-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete"
		:data="pageResult" :columns="filterColumns"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="dataForm.password" type="password" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="机构" prop="dept_name">
				<popup-tree-input 
					:data="deptData" 
					:props="deptTreeProps" 
					:prop="dataForm.dept_name" 
					:nodeKey="''+dataForm.dept_id" 
					:currentChangeHandle="deptTreeCurrentChangeHandle">
				</popup-tree-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input placeholder="admin@qq.com" v-model="dataForm.email" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="手机" prop="mobile">
				<el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色" prop="userRoleResponses" v-if="!operation">
				<el-select v-model="dataForm.userRoleResponses" multiple placeholder="请选择"
					 style="width: 100%;">
					<el-option v-for="item in roles" :key="item.id"
						:label="item.remark" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
		TableColumnFilterDialog
	},
	data() {
		return {
			loginName: this.global.loginName,
			size: 'small',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				name: '',
				password: '123456',
				dept_id: 1,
				dept_name: '',
				email: '',
				mobile: '',
				status: 1,
				create_by: '',
				last_update_by: '',
				userRoleResponses: []
			},
			deptData: [],
			deptTreeProps: {
				label: 'name',
				children: 'children'
			},
			roles: []
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if("undefined" != typeof(data) && data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.name = this.filters.name;
			this.$api.user.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data;
				for (var i = 0; i < res.data.list.length; i++) {
					if (res.data.list[i].status == 0) {
						res.data.list[i].status = '禁用'
					}else if (res.data.list[i].status == 1) {
						res.data.list[i].status = '正常'
					}
				}
				this.findUserRoles()
			}).then(data!=null?data.callback:'')
		},
		// 加载用户角色信息
		findUserRoles: function () {
			var param = { pageNum: 1, pageSize: 1000 }
			this.$api.role.findAll(param).then((res) => {
				// 加载角色集合
				this.roles = res.data	
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				name: '',
				password: '',
				dept_id: 1,
				dept_name: '',
				email: '',
				mobile: '',
				status: 1,
				create_by: '',
				last_update_by: '',
				userRoleResponses: []
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			let userRoles = []
			for(let i=0,len=params.row.userRoleResponses.length; i<len; i++) {
				userRoles.push(params.row.userRoleResponses[i].roleId)
			}
			this.dataForm.userRoleResponses = userRoles
		},
		// 编辑
		submitForm: function () {
			this.dataForm.create_by = this.loginName
			this.dataForm.last_update_by = this.loginName
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let userRoles = []
						for(let i=0,len=params.userRoleResponses.length; i<len; i++) {
							let userRole = {
								userId: params.id,
								roleId: params.userRoleResponses[i]
							}
							userRoles.push(userRole)
						}
						params.userRoleRequestList = userRoles
						if (params.status =='禁用') {
							params.status = 1
						}else if(params.status =='正常'){
							params.status = 0
						}
						 
						if (this.operation) {
							this.$api.user.save(params).then((res) => {
								this.editLoading = false
								if(res.code == 0) {
									this.$message({ message: '操作成功', type: 'success' })
									this.dialogVisible = false
									this.$refs['dataForm'].resetFields()
								} else {
									this.$message({message: '操作失败, ' + res.msg, type: 'error'})
								}
								this.findPage(null)
							})
						}else{
							this.$api.user.edit(params).then((res) => {
								this.editLoading = false
								if(res.code == 0) {
									this.$message({ message: '操作成功', type: 'success' })
									this.dialogVisible = false
									this.$refs['dataForm'].resetFields()
								} else {
									this.$message({message: '操作失败, ' + res.msg, type: 'error'})
								}
								this.findPage(null)
							})
						}
						
					})
				}
			})
		},
		// 获取部门列表
		findDeptTree: function () {
			var param = {'parentId':'0'}
			this.$api.dept.findDeptTree(param).then((res) => {
				this.deptData = res.data
			})
		},
		// 菜单树选中
      	deptTreeCurrentChangeHandle (data, node) {
        	this.dataForm.dept_id = data.id
        	this.dataForm.dept_name = data.name
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 处理表格列过滤显示
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"name", label:"用户名", minWidth:120},
				{prop:"dept_name", label:"机构", minWidth:120},
				{prop:"roleName", label:"角色", minWidth:100},
				{prop:"email", label:"邮箱", minWidth:120},
				{prop:"mobile", label:"手机", minWidth:100},
				{prop:"status", label:"状态", minWidth:70},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	}
	},
	mounted() {
		this.findDeptTree()
		this.initColumns()
	}
}
</script>

<style scoped>

</style>