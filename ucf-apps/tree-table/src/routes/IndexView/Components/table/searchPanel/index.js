import React, {Component} from "react";

import {Form, FormControl, Select} from 'tinper-bee';
import SearchPanel, {FormItem} from 'ac-search-cn';
import { actions,connect } from "mirrorx"
import DatePicker from "bee-datepicker";

import {getQueryString} from "utils";

import zhCN from "rc-calendar/lib/locale/zh_CN";
import moment from 'moment';

import './index.less';

const Option = Select.Option;
const {YearPicker} = DatePicker;
const format = "YYYY";

class SearchArea extends Component {

    config = {
        modelconfig: {
            afterValueChange: this.afterValueChange,
            placeholder: '部门',
        }
    }

    componentDidMount() {
        this.props.onRef(this);// 在父组件上绑定子组件方法
    }

    /**
     * 搜索重置
     * 
     */ 
    searchReset = () => {
        this.props.form.resetFields();
        actions.treeTable.loadData({
          pageIndex: 0,
          pageSize: 10,
          currencyName: "", // 已输入的搜索关键字
          status: '',
        });
        this.props.onReset();
    }
    /**
     * 筛选
     * 
     * @param {*} event 原生事件
     */ 
    handleSearch = (e) => {
        const { currentSelectedId } = this.props;
        console.log(currentSelectedId)
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            values.year = values.year?moment(values.year).format('YYYY'):'';
            values.dept = currentSelectedId || '';
            this.props.onSearch(values);
        });
    };

    /**
     * 获取搜索的值
     * 
     */
    getSearchValue = () => {
        let param = {};
        this.props.form.validateFields((err, values) => {
            for (const key in values) {
                if (values[key]) {
                    param[key] = values[key];
                }
            }
        });
        return param;
    }

    /**
     * 获取参照tooltip的展示值
     * 
     * @param {*} value
     */    
    getTooltip = value  => {
        if(value){
            return moment(value).format('YYYY');
        }   
    }


    render() {
        const {getFieldProps, getFieldValue} = this.props.form;
        return (
            <SearchPanel
                search={this.handleSearch}
                reset={this.searchReset}
            >
                <FormItem label='员工编号'>
                    <FormControl
                        {...getFieldProps('code', {
                            initialValue: ''
                        })}
                    />
                </FormItem>

                <FormItem label='员工姓名'>
                    <FormControl
                        {...getFieldProps('name', {
                            initialValue: '',
                        })}
                    />
                </FormItem>

                <FormItem label='年份' tooltip={this.getTooltip(getFieldValue('year'))}>
                    <YearPicker
                        {...getFieldProps('year', {
                            initialValue: ''
                        })}
                        format={format}
                        placeholder="选择年"
                        locale={zhCN}
                    />
                </FormItem>


                <FormItem label="月份">
                    <Select {...getFieldProps('month')}>
                        <Option value="">请选择</Option>
                        <Option value={1}>一月</Option>
                        <Option value={2}>二月</Option>
                        <Option value={3}>三月</Option>
                        <Option value={4}>四月</Option>
                        <Option value={5}>五月</Option>
                        <Option value={6}>六月</Option>
                        <Option value={7}>七月</Option>
                        <Option value={8}>八月</Option>
                        <Option value={9}>九月</Option>
                        <Option value={10}>十月</Option>
                        <Option value={11}>十一月</Option>
                        <Option value={12}>十二月</Option>
                    </Select>
                </FormItem>
                <FormItem label='是否超标'>
                    <Select
                        {...getFieldProps('exdeeds')}
                    >
                        <Option value="">请选择</Option>
                        <Option value={0}>未超标</Option>
                        <Option value={1}>超标</Option>
                    </Select>
                </FormItem>
            </SearchPanel>
        )
    }
}

export default connect(state => state.treeTable)(Form.createForm()(SearchArea));