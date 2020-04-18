import React, { Component } from 'react';

import { Form, FormControl, Select, Button,ButtonGroup } from 'tinper-bee';
import { actions, connect } from 'mirrorx';
import FormLayout from 'ac-form-layout';
import { generateRules } from '../helper/rulesHelper';
import { dateFormate,getQueryString } from 'utils';
import Btns from 'components/Btns';

import './index.less';

const { FormItem, FormRow } = FormLayout;
const { Option } = Select;

const layout = {
    md: 3,
    sm: 3,
    xs: 3,
}

class DepartmentCard extends Component {
    
    state = {
        principal:this.props.principal,
        editFlag:false,//编辑状态开关
        pageStatu:this.props.status,//页面状态
        show:false,//模态框是否展示
        usingId:null,//当前节点id
        usingVo:null,//当前结点详情
        delShow:false,//删除模态框展示
        delId:null//删除Id
    }
    


    
    /**
     * 启/停用状态变更
     * @param {*} id 选中的当前节点
     * @param {*} vo 选中当前节点的详细信息
     */
    onClickUpdatestatus = (e,id,vo) => {
        e.stopPropagation();
        if(vo.enable===0 || vo.enable===2){
            this.setState({
                show:true,
                usingId:id,
                usingVo:vo
            })
        }else if(vo.enable===1){
            vo.enable=2
            actions.department.setCurrentNode(id);
            actions.department.updatestatus(vo);
        }
    }
    
    /**
     * 取消编辑
     */
    onCancelEdit = () => {
        actions.department.setStatus('browse');
    }
    
    
    
    /**
     * 提交表单
     */
    submit = async () => {
        const { status, currentNode, form,currentSelectedId } = this.props,
              { parentid,parentName,id } = currentNode;
        form.validateFields((err, values) => {
            if(!err){
                const {
                    code,
                    name,
                    applier,
                    enable,
                    depttype,isEnd } = values;
                let data = {
                    code,
                    name,
                    enable,
                    orgtype: 2,
                    depttype:depttype.join(','),
                    displayorder: 999999,
                    sysid: 'diwork',
                    effectivedate: dateFormate(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'),
                    isEnd:isEnd || 1
                };
                if (typeof applier === 'object') {
                    data = { ...data, principal: applier.name }
                } else {
                    data = { ...data, principal: applier }
                }
                if (status === 'edit') {
                    data.parentid = parentid;
                    data.parentName = parentName;
                    data.id = id || '';
                    console.log('edit',data)
                    actions.department.addDepartment(data, true);
                } else if(status=='add') {
                    if(currentSelectedId==='root'){
                       data.parentid = '';
                        data.parentName = '';
                    }else{
                        data.parentid = id || '';
                        data.parentName = currentNode.name;
                    }
                    console.log(data.name,values.name,currentNode.name)
                    console.log('add',data)
                    actions.department.addDepartment(data);
                }
                this.props.form.resetFields();
            }


        });
        this.setState({
            editFlag:false
        });
    }
    
    /**
     * 自定义校验编码
     * @param
     */
    checkFormCode = (rule, value, callback) => {
        callback()
    }
    
    /**
     * 自定义校验名称
     * @param
     */
    checkFormName = (rule, value, callback) => {
        callback()
    }
    
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { currentNode,status } = nextProps;
        const { pageStatu,editFlag,principal } = prevState;
        if (currentNode.principal && (currentNode.principal!= principal)){
            if(!editFlag){
                return {
                    principal:currentNode.principal
                };
            }
        }
        if(status=='add' && pageStatu!='add'){//浏览态或编辑态变为新增态
            return {
                pageStatu:'add'
            };
        }
    }
    
    /**
     * 添加状态
     * @param status 枚举值 add edit browse
     */
    setAdd = status => {
        this.setState({
            pageStatu:status
        })
    }
    
    componentDidMount(){
        this.props.onRef && this.props.onRef(this);
        let serviceCode = getQueryString('serviceCode', window.location.href) || getQueryString('servicecode', window.location.href);
        actions.department.getPower({
            params: {
                servicecode: serviceCode
            },
            context: pom.fe.new.ctx
        })
    }
    
    render() {
        const { form, status, currentNode,currentSelectedId,DepartTypes } = this.props,
            { id,name,code, depttype, enable, effectivedate, expirationdate, principal,parentid,parentName } = currentNode;
        const { getFieldProps,getFieldError } = form;
        const { show,delShow } = this.state;
        let initialValue = {};
        if (status === 'add' || currentSelectedId==='root') {
            Object.assign(initialValue, {
                enable: '0',
                parentid: id || '',
                parentName: name || '',
            })
        } else {
            Object.assign(initialValue, {
                code,
                name,
                depttype,
                enable,
                effectivedate,
                expirationdate,
                parentid: parentid || '',
                parentName: parentName || '',
                principal
            })
        }
        const disabled = status === 'browse';
        return (
            <div className='department-card'>
                <h1 className='department-h1'>部门</h1>
                <FormLayout disabled={disabled}>
                    <FormRow>
                        <FormItem {...layout} label="部门编码" required={ true } errorMsg={getFieldError('code')}>
                            <FormControl
                                disabled={disabled}
                                className='form-input'
                                {...getFieldProps('code', {
                                    validateTrigger: 'onBlur',
                                    initialValue: initialValue.code || '',
                                    rules: generateRules('请输入部门编码', true, this.checkFormCode),
                                })}
                            />
                        </FormItem>
                        <FormItem {...layout} label="部门名称" required={ true } errorMsg={getFieldError('name')}>
                            <FormControl
                                disabled={disabled}
                                className='form-input'
                                {...getFieldProps('name', {
                                    validateTrigger: 'onBlur',
                                    initialValue: initialValue.name || '',
                                    rules: generateRules('请输入部门名称', true, this.checkFormName)
                                })}
                            />
                        </FormItem>
                        <FormItem {...layout} label="上级部门" errorMsg={getFieldError('parentName')}>
                            <FormControl disabled={true}
                                         className='form-input'
                                         {...getFieldProps('parentName', {
                                             validateTrigger: 'onBlur',
                                             initialValue: initialValue.parentName || '',
                                         })}
                            />
                        </FormItem>
                        <FormItem {...layout} label="部门性质" >
                            <Select
                                multiple
                                className='form-input'
                                disabled={disabled}
                                {...getFieldProps('depttype', {
                                    initialValue: initialValue.depttype ? initialValue.depttype.split(','): [],
                                })}
                            >
                                {
                                    DepartTypes.map(item => {
                                        return <Option key={item.key} value={item.key}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                        <FormItem {...layout} label="启用状态">
                            <Select
                                disabled={disabled}
                                className='form-input'
                                {...getFieldProps('enable', {
                                    validateTrigger: 'onBlur',
                                    initialValue: initialValue.enable !== undefined ? initialValue.enable + '' : undefined
                                })}
                            >
                                {<Option key="1" value="0">未启用</Option>}
                                <Option key="2" value="1">已启用</Option>
                                <Option key="3" value="2">已停用</Option>
                            </Select>
                        </FormItem>
                        {
                            status === 'browse' ?
                                <span>
                                    <FormItem {...layout} label="启用时间">
                                        <FormControl
                                            disabled={disabled}
                                            className='form-input'
                                            {...getFieldProps('effectiveTime', {
                                                validateTrigger: 'onBlur',
                                                initialValue: initialValue.effectivedate
                                            })}
                                        />
                                    </FormItem>
                                    {/*<FormItem {...layout} label="停用时间">
                                     <FormControl
                                     disabled={disabled}
                                     className='form-input'
                                     {...getFieldProps('expirationTime', {
                                     validateTrigger: 'onBlur',
                                     initialValue: initialValue.expirationdate
                                     })}
                                     />
                                     </FormItem>*/}
                                </span> : null
                        }
                    </FormRow>
                </FormLayout>
            </div>
        )
    }
}

export default connect(state => state.department)(Form.createForm()(DepartmentCard));
