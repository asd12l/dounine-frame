var KeyBoard = (function() {

	function KeyBoard() {
	}
	
	function getModuleName(){
		return "快捷键";
	}
	
	KeyBoard.prototype.Messager_Title = function(){
		return '温馨提示';
	}
	
	KeyBoard.prototype.success_refresh = true;//操作成功后刷新列表
	
	KeyBoard.prototype.Data_Id = function (row){
		return {'keyBoardId':row['keyBoardId']};
	}
	
	KeyBoard.prototype.load = function() {
		$KeyBoard.datagrid.datagrid({
			url : $KeyBoard.loadUrl,
			rownumbers : true,
			pagination : true,
			fitColumns : true,
			singleSelect : true,
			nowrap : true,
			striped : true,
			border : false,
			onClickRow : rowClick,
			collapsible : true,
			columns : [ [ {
				field : 'keyBoardId',
				title : 'ID编号',
				hidden : true,
				width : 100
			}, {
				field : 'name',
				title : '名称',
				sortable:true,
				width : 100
			}, {
				field : 'url',
				title : '地址',
				sortable:true,
				width : 100
			}, {
				field : 'createTimeT',
				title : '创建时间',
				sortable:true,
				hidden:true,
				width : 100
			},{
				field:'picture',
				title:'图片',
				formatter:function(val,row){
					return "<img width='20' height='20' src="+(base+val)+">";
				}
			}, {
				field : 'description',
				title : '描述',
				width : 100
			}] ],
			toolbar : $KeyBoard.datagrid_menu
		});
		
		function rowClick(){
			var row = $KeyBoard.datagrid.datagrid('getSelected');
			if(row){
				$('#skdm-menu-remove').menubutton('enable');
				$('#skdm-menu-edit').menubutton('enable');
			}else{
				$('#skdm-menu-remove').menubutton('disable');
				$('#skdm-menu-edit').menubutton('disable');
			}
		}
	}

	KeyBoard.prototype.del = function() {
		var row = $KeyBoard.datagrid.datagrid('getSelected');
		$.messager.confirm('删除确认', '您确认要删除这条'+getModuleName()+'么?', function(r) {
			if (r) {
				$.messager.progress();
				$.post($KeyBoard.delUrl, $KeyBoard.Data_Id(row), function(data) {
					if (data == "success") {
						msgShow('操作成功', getModuleName()+'删除成功.');
						dataGridReload();
					} else {
						if(dataFilter(data).length>0){
							$.messager.alert('删除错误', data, 'error');
						}
					}
					$.messager.progress('close');
				});
			}
		});
	}

	KeyBoard.prototype.add = function() {
		dialogOpen('添加');
		$.messager.progress('close');
		$KeyBoard.button = true;
		$KeyBoard.form.form('clear');
		$("#keyBoardUserId").val(adminCurrentUserId);
		$("#UpIframe_1_form_id").form('clear');
		$("#dounineImgUp1").attr('src',base+'/resource/admin/css/themes/icons/dounine-icon-picture.png');
		
	}

	KeyBoard.prototype.edit = function() {
		dialogOpen('编辑');
		$.messager.progress('close');
		var row = $KeyBoard.datagrid.datagrid('getSelected');
		$KeyBoard.button = false;
		$KeyBoard.form.form('load', row);
		$("#dounineImgUp1").attr('src',$("#keyBoardUrl").val());
	}

	KeyBoard.prototype.congeal = function() {// 冻结
		$.messager.progress('close');
		$.messager.progress();
		var row = $KeyBoard.datagrid.datagrid('getSelected');
		$.post($KeyBoard.congealUrl,$KeyBoard.Data_Id(row), function(data) {
			$.messager.progress('close');
			if (data == 'success') {
				msgShow('冻结成功', getModuleName()+'冻结成功.');
				dataGridReload();
			} else {
				$.messager.alert('温馨提示', data, 'error');
			}
		});
	}

	KeyBoard.prototype.thaw = function() {// 解冻
		$.messager.progress('close');
		$.messager.progress();
		var row = $KeyBoard.datagrid.datagrid('getSelected');
		$.post($KeyBoard.thawUrl, $KeyBoard.Data_Id(row), function(data) {
			$.messager.progress('close');
			if (data == 'success') {
				msgShow('解冻成功', getModuleName()+'解冻成功.');
				dataGridReload();
			} else {
				$.messager.alert('温馨提示', data, 'error');
			}
		});
	}

	KeyBoard.prototype.search = function() {
		$KeyBoard.datagrid.datagrid('reload', $KeyBoard.searchForm.serializeObject());
	}

	function dialogOpen(title,read) {
		$.messager.progress('close');
		var tex = '';
		if($KeyBoard.success_refresh){
			tex = '<font style="color:#B1B1B1;" class="check_font_for_refresh">操作成功后刷新</font> <input class="check_input_for_refresh" type="checkbox" style="display:none;vertical-align: middle;" disabled="disabled" checked="checked"/>';
		}else{
			tex = '<font style="color:#B1B1B1;" class="check_font_for_refresh">操作成功后不刷新</font> <input class="check_input_for_refresh" type="checkbox" style="display:none;vertical-align: middle;" disabled="disabled"/>';
		}
		var ref_title = {
			plain:true,
			text : tex,
			handler:function(){
				var input1 = $(this).find('input');
				if(input1.attr('checked')){
					$KeyBoard.success_refresh = false;
					input1.removeAttr('checked',false);
					$(this).find('font').text('操作成功后不刷新');
				}else{
					$KeyBoard.success_refresh = true;
					input1.attr('checked',true);
					$(this).find('font').text('操作成功后刷新');
				}
			}
		},save_btn = {
			text : title,
			iconCls : 'icon-d-save',
			handler : $KeyBoard.save
		},close_btn = {
			text : '取消',
			iconCls : 'icon-d-close',
			handler : $KeyBoard.close	
		};
		var buttons = [];
		if(read){
			$.extend(close_btn,{text:'关闭'});//克隆属性
		}else{
			buttons.push(ref_title);
			buttons.push(save_btn);
		}
		buttons.push(close_btn);
		$KeyBoard.dialog.show().dialog({
			title : '&nbsp;'+title+getModuleName(),
			width:500,
			buttons : buttons
		});
	}
	
	function formSubmit(url,successInfo,title) {
		$KeyBoard.form.form('submit', {
			url : url,
			onSubmit : function() {
				var isValid = $(this).form('validate');
				if (isValid) {
					$.messager.progress('close');
				}
				if (isValid) {
					$.messager.progress();
				}
				return $(this).form('validate');
			},
			success : function(data) {
				$.messager.progress('close');
				if (data == 'success') {
					msgShow($KeyBoard.Messager_Title(), getModuleName() + successInfo +'成功.');
					dialogClose($KeyBoard.success_refresh);
					if($KeyBoard.success_refresh){//成功后刷新
						dataGridReload();
					}
				} else {
					dialogOpen(successInfo);
					if(dataFilter(data).length>0){
						$.messager.alert($KeyBoard.Messager_Title(), data, 'error');
					}
				}
			}
		});
	}

	KeyBoard.prototype.save = function() {
		if ($KeyBoard.button) {
			formSubmit($KeyBoard.addUrl,'添加');// 表单添加
		} else {
			formSubmit($KeyBoard.editUrl,'编辑');// 表单编辑
		}
	}

	KeyBoard.prototype.close = function(url) {
		dialogClose();
	}
	
	function dialogClose() {
		$KeyBoard.dialog.dialog('close');
	}
	
	function dataGridReload(){
		$KeyBoard.datagrid.datagrid('reload');
		initButtons();
	}
	
	function initButtons() {
		$('#skdm-menu-remove').menubutton('disable');
		$('#skdm-menu-edit').menubutton('disable');
	}


	return KeyBoard;
})();
