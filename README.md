jquery.cityChoice.js
====================

三级联动选择（如：地区/省份/城市 ）的功能


### Initialization

#### Demo

http://wilee.me/demo/cityChoice/demo.html 

#### HTML

	<div id="cityChoiceContainer"></div>

#### JS

	var instance = $('#cityChoiceContainer').cityChoice({
		ele:'',//如果配置了rednerId 则在实例化时就进行渲染，否则需要通过render方法渲染
		cityData: [{...}],
		hasFooter: true,//是否需要底部的确定取消按钮，
		hasLabelText:true//是否需要文字第二级选中数目提示
	});

	instance.render('#cityChoiceContainer');

## 配置

| 配置参数 | 是否必须 | 类型 | 默认 | 说明 |
| - | - | - | - | - |
| ele | 否 | string/ele | '' | 如果配置了rednerId 则在实例化时就进行渲染，否则通过render方法渲染 |
| cityData | 是 | object | [] | 请参考下方城市数据格式 |
| hasFooter | 否 | bool | true | 是否有底部的确定取消按钮 |
| hasLabelText | 否 | bool | true | 是否需要文字第二级选中数目提示 |

** 城市数据格式： **

    [{
        value:1,
        name:'华东',
        content:[{
            value:10,
            name:'江苏',
            content:[...]
        },{
            ...
        }]
    },{
        ...
    }]

## 方法

### 首先实例化cityChoice类


	var cityChoice = require('common:component/cityChoice');

	var instance = new cityChoice(options)


### 配置参数说明

| 方法名 | 示例 | 说明 |
| - | - | - |
| render | <pre>instance.render('#cityChoiceContainer');</pre> | 渲染到 选择器#cityChoiceContainer中 |
| setDefault | <pre>instance.setDefault([[3],[2,1,0],[2,0,0]]);</pre> | 设置默认选择的选择项目，indexData |
| setUseless | <pre>instance.setUseless([73, 75, 81, 1, 2, 3, 4]);</pre> | 设置不允许选择的选项 |
| getFormData | <pre>instance.getFormData()</pre> | 获取所有已选择了的数据项 |
| getSelected | <pre>instance.getSelected()</pre> | 获取已选择了的节点及参数，详细参数说明请看源码 |
| formToIndex | <pre>instance.formToIndex([])</pre> | 将form格式数据转化为index格式数据 return {indexData,selectNames} |

## 事件

### 使用实例

	/*
	 @ 绑定事件名为test的自定义事件
	 @ obj.on('test',function(evt,[opt]){})
	 @ return null
	*/
	instance.on('test',function(evt,option){
	    console.log(option);//返回参数
	    evt.returnValue = false;//阻止默认事件
	})

### 详细配置

| 事件名 | 说明 |
| - | - |
| change | 表单发生改变 |
| sure | 点击底部的确认按钮 |
| cancel | 点击底部的取消按钮 |
