import React, { Component } from "react"
import { actions } from "mirrorx"
import queryString from 'query-string'
import Btns from 'components/Btns'
import { Loading, FormControl, Select, Icon, Form, InputNumber } from 'tinper-bee'
import FormLayout from 'ac-form-layout'
import AcHeader from "ac-header"
import SplitArea from 'ac-split-area'
import DatePicker from "bee-datepicker";
import "./index.less"
import moment from 'moment';
import MdfRefer from '@yonyou/mdf-refer/lib/index';
import zhCN from "rc-calendar/lib/locale/zh_CN";
import Modal from 'bee-modal';
import headIcon from 'static/images/headerIcon/BasicArchives/2.svg';
const { YearPicker } = DatePicker;
const {Option} = Select
const {FormItem, FormRow} = FormLayout
const layoutOpt = {
  md: 3,
  sm: 6,
  xs: 12
}
let isChanged = false;
cb.rest.AppContext.ignoreuniform = true
cb.rest.AppContext.serviceUrl = `${pom.fe.mdf.ctx}`;

class EditView extends Component {

    state = {
      areaOpen: false,
      submitFlag:true,
    }
    //参照相关
    modelOrg = new cb.models.MdfReferModel({
        cRefType: 'cn_demo_dept',
        displayname: 'name',
        valueField: 'id',
    });
    config = {
        modelconfig: {
            placeholder:"部门",
        }
    }
    modelOrg2 = new cb.models.MdfReferModel({
        cRefType: 'cn_post_level',
        displayname: 'name',
        valueField: 'id',
    });
    config2 = {
        modelconfig: {
          placeholder:"职级",
        }
    }

  componentWillMount() {
    let {btnFlag} = queryString.parse(this.props.location.search).btnFlag
    if (btnFlag == 2) {//详情页,获取所有数据，用于右上角切换单据
      actions.treeTable.loadData({
        pageIndex: 0,
        pageSize: 9999999,
        ...this.props.searchParam
      })
    }
  }

    /**
     * 打开方法
     *
     * @param {*} areaOpen
     */
  openChange = (areaOpen) => {
    this.setState({
      areaOpen
    })
  }

  /**
   * 保存
   */
  save = () => {
    const {submitFlag} = this.state;
    const {currentSelectedId,currentNode} = this.props;
    if(submitFlag){
      this.setState({ submitFlag: false })
      this.props.form.validateFields((err, values) => {
        if (!err) {
            const {dept, postLevel} = values;
            values.year = values.year?moment(values.year).format('YYYY'):'';
            if (dept && dept.id) { // 参照处理
                values.deptName = dept.name;
                values.dept = dept.id;
            } else {
                delete values.dept;
            }

            if (postLevel && postLevel.id) { // 参照处理
                values.levelName = postLevel.name;
                values.postLevel = postLevel.id;
            } else {
                delete values.postLevel;
            }
            let result = values;

            if (queryString.parse(this.props.location.search).btnFlag == 1) {//编辑
                delete this.props.detailObj.ts;
                result = {...this.props.detailObj, ...values};

            }

          //console.log(values)
          actions.treeTable.save([result]);
        } else {
          console.error(err)
        }
      });
      const that = this;   // 为定时器中的setState绑定this
      setTimeout(()=>{       // 设置延迟事件，1秒后将执行
        that.setState({ submitFlag: true })   // 将isClick设置为true
      }, 500);
    }
  }

  /**
   * 取消
   */
 cancel = () => {
    const btnFlag = queryString.parse(this.props.location.search).btnFlag;
    if(isChanged){
        Modal.confirm({
            title: '温馨提示',
            keyword: '警告',
            content: "数据未保存，确定离开 ?",
            onOk: ()=> {
                isChanged=false;
                actions.routing.goBack();
            },
            onCancel:()=> {
                console.log('Cancel');
            },
            confirmType: 'two'
        })

    }else{
      isChanged=false;
      actions.routing.goBack();
    }
  }

  /**
   * 右上角 操作
   */
  changeData = (type) => {
    let tableData = this.props.queryObj.list
    let detailObj = this.props.detailObj
    switch (type) {
      case 'first'://第一页
        actions.treeTable.updateState({
          detailObj: tableData[0]
        })
        break
      case 'previous'://上一页
        actions.treeTable.updateState({
          detailObj: tableData[detailObj.index - 1]
        })
        break
      case 'next'://下一页
        actions.treeTable.updateState({
          detailObj: tableData[detailObj.index + 1]
        })
        break
      case 'last'://最后一页
        actions.treeTable.updateState({
          detailObj: tableData[tableData.length - 1]
        })
        break
    }
  }


  //启用 1 停用 2
  enabledClick = async (status) => {
    let detailObj = this.props.detailObj
    detailObj.status = status
    // delete detailObj.ts;
    await actions.treeTable.save({
      data: [detailObj],
      callback: () => {
        this.props.form.setFieldsValue({
          status: status
        })
        actions.treeTable.getDetail({id: detailObj.id})
      }
    })
  }

     /**
     * 按钮渲染
     *
     */
  renderBtn = () => {
    let btnflag = queryString.parse(this.props.location.search).btnFlag
    let detailObj = this.props.detailObj
    delete detailObj.ts;
    let disabledObj = {
      disabled: {
        onClick: () => {
          this.enabledClick('2')
        }
      }
    };
    if (detailObj.status == '2') {
      disabledObj = {
        enable: {
          onClick: () => {
            this.enabledClick('1')
          }
        }
      }
    }
    if (btnflag == 2) {//详情
     console.log('此处与A1表格同步')
    } else {//新增、修改
      return (
          <Btns
              powerBtns={ this.props.powerBtns }
              btns={ {
                save: {
                  onClick: this.save
                },
                cancel: {
                  onClick: this.cancel
                }
              } }
          />
      )
    }
  }
    /**
     * 千分位数字转换
     *
     * @param {*} num 数字
     */
  iptNumFunc = num => {
     return Number(num).toLocaleString();
  }

  render() {
    const {status,form, detailObj,currentSelectedId,queryObj,currentNode} = this.props
    const {getFieldProps, getFieldError} = form
    let btnFlag = queryString.parse(this.props.location.search).btnFlag
    let disabled = btnFlag == 2;
    console.log(currentSelectedId,currentNode.name)
    return (
        <div className="currency-type-edit-wrap">
          <Loading showBackDrop={ true } show={ false } fullScreen={ true }/>
          <AcHeader
              icon={ <img src={ headIcon }/> }
              title={ {0: '新增', 1: '修改', 2: '详情'}[btnFlag] }
              showBack
                backClick={ () => {
                  actions.treeTable.goto({
                    type: 'index'
                  })
                } }>
            {
              this.renderBtn()
            }
          </AcHeader>
          <FormLayout disabled={ disabled }>
            <FormRow>
              <FormItem label="员工编号" { ...layoutOpt } errorMsg={ getFieldError('code') }>
                <FormControl maxLength={ 20 } disabled={true}
                             { ...getFieldProps('code', {
                               validateTrigger: 'onBlur',
                               initialValue: detailObj.code,
                             }) }
                />
              </FormItem>
              <FormItem label="员工姓名" { ...layoutOpt } required={ true } errorMsg={ getFieldError('name') }>
                <FormControl maxLength={ 20 }
                             { ...getFieldProps('name', {
                               validateTrigger: 'onBlur',
                               initialValue: detailObj.name,
                               onChange:(value)=>{
                                    isChanged = true
                               },
                               rules: [{
                                 message: '员工姓名',
                                 required: true
                               }]
                             }) }
                />
              </FormItem>
              <FormItem label="性别" { ...layoutOpt } required={ true } errorMsg={ getFieldError('sex') }>
                  <Select
                      { ...getFieldProps('sex', {
                        validateTrigger: 'onBlur',
                        initialValue: detailObj.sex,
                         onChange:(value)=>{
                              isChanged = true
                         },
                        rules: [{
                           message: '性别',
                           required: true
                         }]
                      }) }
                  >
                    <Option style={{'fontSize':'13px'}} value={1}>男</Option>
                    <Option style={{'fontSize':'13px'}} value={0}>女</Option>
                  </Select>
              </FormItem>
              <FormItem label="部门" { ...layoutOpt } required={ true } errorMsg={ getFieldError('dept') }>
                 <MdfRefer modelName={'refer'} model={this.modelOrg} config={this.config}  style={{'float':'left'}}
                      {...getFieldProps('dept', {
                         initialValue:currentSelectedId ?currentNode.name:(detailObj.deptName || detailObj.dept || ""),
                         onChange:(value)=>{
                              isChanged = true;
                              //this.modelOrg.setValue(value?value[this.modelOrg._get_data('valueField')]:'')
                         },
                        rules: [{
                           message: '部门',
                           required: true
                         }]
                    })}
                    ></MdfRefer>
              </FormItem>
            </FormRow>
            <FormRow>
              <FormItem label="职级" { ...layoutOpt } required={ true } errorMsg={ getFieldError('postLevel') }>
                <MdfRefer modelName={'refer'} model={this.modelOrg2} config={this.config2}  style={{'float':'left'}}
                  {...getFieldProps('postLevel', {
                        initialValue: detailObj.levelName || detailObj.postLevel || "",
                         onChange:(value)=>{
                              isChanged = true;
                              //sthis.modelOrg2.setValue(value?value[this.modelOrg2._get_data('valueField')]:'')
                         },
                    rules: [{
                       message: '职级',
                       required: true
                     }]
                })}
                ></MdfRefer>
              </FormItem>
              <FormItem label="工龄" { ...layoutOpt } required={ true } errorMsg={ getFieldError('serviceYears') }>
                <InputNumber min={0} style={{'float':'left','text-align':'left'}}
                             { ...getFieldProps('serviceYears', {
                               initialValue: detailObj.serviceYears,
                               onChange:(value)=>{
                                    isChanged = true
                               },
                               rules: [{
                                 message: '工龄',
                                 required: true
                               }]
                             }) }
                />
              </FormItem>
              <FormItem label="司龄" { ...layoutOpt } required={ true } errorMsg={ getFieldError('serviceYearsCompany') }>
                <InputNumber min={0} style={{'float':'left','text-align':'left'}}
                             { ...getFieldProps('serviceYearsCompany', {
                               initialValue: detailObj.serviceYearsCompany,
                               onChange:(value)=>{
                                    isChanged = true
                               },
                               rules: [{
                                 message: '司龄',
                                 required: true
                               }]
                             }) }
                />
              </FormItem>
              <FormItem label="年份" { ...layoutOpt } required={ true } errorMsg={ getFieldError('year') }>
                <YearPicker format='YYYY' locale={zhCN}
                             { ...getFieldProps('year', {
                               initialValue: moment(detailObj.year),
                               onChange:(value)=>{
                                    isChanged = true
                               },
                               rules: [{
                                 message: '年份',
                                 required: true
                               }]
                             }) }
                />
              </FormItem>
            </FormRow>
            <FormRow>
               <FormItem label="月份" { ...layoutOpt } required={ true } errorMsg={ getFieldError('month') }>
                <Select
                    { ...getFieldProps('month', {
                      validateTrigger: 'onBlur',
                      onChange:(value)=>{
                            isChanged = true
                       },
                      initialValue: detailObj.month,
                                                     rules: [{
                                 message: '月份',
                                 required: true
                               }]
                    }) }
                >
                  <Option style={{'fontSize':'13px'}} value={1}>一月</Option>
                  <Option style={{'fontSize':'13px'}} value={2}>二月</Option>
                  <Option style={{'fontSize':'13px'}} value={3}>三月</Option>
                  <Option style={{'fontSize':'13px'}} value={4}>四月</Option>
                  <Option style={{'fontSize':'13px'}} value={5}>五月</Option>
                  <Option style={{'fontSize':'13px'}} value={6}>六月</Option>
                  <Option style={{'fontSize':'13px'}} value={7}>七月</Option>
                  <Option style={{'fontSize':'13px'}} value={8}>八月</Option>
                  <Option style={{'fontSize':'13px'}} value={9}>九月</Option>
                  <Option style={{'fontSize':'13px'}} value={10}>十月</Option>
                  <Option style={{'fontSize':'13px'}} value={11}>十一月</Option>
                  <Option style={{'fontSize':'13px'}} value={12}>十二月</Option>
                </Select>
              </FormItem>
                <FormItem label="补贴类别" { ...layoutOpt } required={ true } errorMsg={ getFieldError('allowanceType') }>
                  <Select
                      { ...getFieldProps('allowanceType', {
                        validateTrigger: 'onBlur',
                       onChange:(value)=>{
                            isChanged = true
                       },
                        initialValue: detailObj.allowanceType,
                                                       rules: [{
                                 message: '补贴类别',
                                 required: true
                               }]
                      }) }
                  >
                    <Option style={{'fontSize':'13px'}} value={1}>电脑补助</Option>
                    <Option style={{'fontSize':'13px'}} value={2}>住宿补助</Option>
                    <Option style={{'fontSize':'13px'}} value={3}>交通补助</Option>
                  </Select>
                </FormItem>
                <FormItem label="补贴标准" { ...layoutOpt } required={ true } errorMsg={ getFieldError('allowanceStandard') }>
                  <InputNumber precision={2}  min={0} style={{'float':'left','text-align':'right'}} format={num=>this.iptNumFunc(num)}
                               { ...getFieldProps('allowanceStandard', {
                                 initialValue: detailObj.allowanceStandard,
                                  onChange:(value)=>{
                                        isChanged = true
                                   },
                                 rules: [{
                                   message: '补贴标准',
                                   required: true
                                 }]
                               }) }
                  />
                </FormItem>
                <FormItem label="实际补贴" { ...layoutOpt } required={ true } errorMsg={ getFieldError('allowanceActual') }>
                  <InputNumber precision={2}  min={0} style={{'float':'left','text-align':'right'}} format={num=>this.iptNumFunc(num)}
                               { ...getFieldProps('allowanceActual', {
                                 initialValue: detailObj.allowanceActual,
                                  onChange:(value)=>{
                                        isChanged = true
                                   },
                                 rules: [{
                                   message: '实际补贴',
                                   required: true
                                 }]
                               }) }
                  />
                </FormItem>
            </FormRow>
            <FormRow>
                <FormItem label="是否超标" { ...layoutOpt } required={ true } errorMsg={ getFieldError('exdeeds') }>
                    <Select
                        {...getFieldProps('exdeeds', {
                        validateTrigger: 'onBlur',
                        initialValue: detailObj.exdeeds,
                        onChange:(value)=>{
                              isChanged = true
                         },
                        rules: [{
                           message: '是否超标',
                           required: true
                         }]
                      })}
                    >
                        <Option style={{'fontSize':'13px'}} value={0}>未超标</Option>
                        <Option style={{'fontSize':'13px'}} value={1}>超标</Option>
                    </Select>
                </FormItem>
                <FormItem label="领取方式" { ...layoutOpt } required={ true } errorMsg={ getFieldError('pickType') }>
                  <Select
                      { ...getFieldProps('pickType', {
                        validateTrigger: 'onBlur',
                        initialValue: detailObj.pickType,
                      onChange:(value)=>{
                            isChanged = true
                       },
                         rules: [{
                           message: '领取方式',
                           required: true
                         }]
                      }) }
                  >
                    <Option style={{'fontSize':'13px'}} value={1}>转账</Option>
                    <Option style={{'fontSize':'13px'}} value={2}>现金</Option>
                  </Select>
                </FormItem>
                <FormItem label="备注" { ...layoutOpt } errorMsg={ getFieldError('remark') }>
                  <FormControl maxLength={ 20 }
                               { ...getFieldProps('remark', {
                                 validateTrigger: 'onBlur',
                                 onChange:(value)=>{
                                  isChanged = true
                                  },
                                 initialValue: detailObj.remark,
                               }) }
                  />
                </FormItem>
            </FormRow>
            {
              disabled ?
                  <SplitArea ctn={ this.state.areaOpen ? <span><Icon type='uf-minus'/>审计信息</span> :
                      <span><Icon type='uf-plus'/>审计信息</span> } open={ this.state.areaOpen } openChange={ this.openChange }>
                    <FormRow>
                      <FormItem label="创建人" { ...layoutOpt }  >
                        <FormControl value={ detailObj.createUserName }/>
                      </FormItem>
                      <FormItem label="创建时间" { ...layoutOpt }  >
                        <FormControl value={ detailObj.createTime }/>
                      </FormItem>
                      <FormItem label="最后修改人" { ...layoutOpt }  >
                        <FormControl value={ detailObj.lastModifyUserName}/>
                      </FormItem>
                      <FormItem label="最后修改时间" { ...layoutOpt }  >
                        <FormControl value={ detailObj.lastModified }/>
                      </FormItem>
                    </FormRow>
                  </SplitArea> : ''
            }

          </FormLayout>
        </div>
    )
  }
}

export default Form.createForm()(EditView);
