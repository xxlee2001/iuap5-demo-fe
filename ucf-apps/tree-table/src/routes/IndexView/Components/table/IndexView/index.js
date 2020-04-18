import React, { Component } from 'react';
import { actions,connect } from "mirrorx";
import { 
  ButtonGroup, 
  Loading, 
  Label, 
  Select, 
  Menu, 
  Icon } from "tinper-bee";
import AcHeader from "ac-header";
import { Grid, EditGrid } from 'ac-gridcn';
import Btns from 'components/Btns';
import { getQueryString } from 'utils';
import Form from 'bee-form';
import Dropdown from 'bee-dropdown';
import SearchArea from '../SearchPanel';
import PopDialog from 'components/Pop';
import moment from 'moment';
import Modal from 'bee-modal';
import AcTips from 'ac-tips';
import cloneDeep from 'clone-deep';
import headIcon from 'static/images/headerIcon/BasicArchives/3.svg';
import './index.less';
const FormItem = Form.FormItem;
const Option = Select.Option;
const {Item} = Menu;

class App extends Component {
  //初始化数据
  state = {
      currencyName: "", // 已输入的搜索关键字
      status: '', // 是否显示停用
      expanded: true,
      filterable: false,
      showModal: false,
      record: {}, // 存储关联数据信息
      ordField:'',//排序列名称
      ordSort:'',//升序/降序
      searchValue:{}
  }

  selectList = [];//选中的数据

    //列数据
  gridColumn = [
            {
            title: "数据",
            width: 80,
            dataIndex: "k",
            key: "k",
            fixed: "left",
            className: 'data-cls ',
            exportHidden: true, //是否在导出中隐藏此列
            render: (text, record, index) => {
                  //列注释的右键菜单
                  const menu = (
                      <Menu
                          onClick={e => this.onRelevance(record, e.key)}>
                          <Item key='code'>模态弹出</Item>
                          <Item key='year'>链接跳转</Item>
                      </Menu>
                  );
                  return (
                      <div className="table-menu">
                          <Dropdown
                              trigger={['click']}
                              overlay={menu}
                              animation="slide-up"
                          >
                              <Icon type="uf-link" style={{"color": "#004898"}}/>
                          </Dropdown>
                      </div>
                  )
              }
          },
          {
              title: "员工编号",
              dataIndex: "code",
              key: "code",
              width: 150,
              filterType: "text",//输入框类型
              filterDropdown: "show",//显示条件
              filterDropdownType: "string"//字符条件
          },
          {
              title: "员工姓名",
              dataIndex: "name",
              key: "name",
              width: 120,
              filterType: "text",//输入框类型
              filterDropdown: "show",//显示条件
              filterDropdownType: "string"//字符条件
          },
          {
              title: "员工性别",
              dataIndex: "sexEnumValue",
              key: "sexEnumValue",
              width: 120,
          },
          {
              title: "所属部门",
              dataIndex: "deptName",
              key: "deptName",
              renderType: 'input',
              width: 120,
          },
          {
              title: "职级",
              dataIndex: "levelName",
              renderType: 'input',
              key: "levelName",
              width: 120,
          },

          {
              title: "工龄",
              dataIndex: "serviceYears",
              key: "serviceYears",
              width: 130,
              className: 'column-number-right ', // 靠右对齐
          },
          {
              title: "司龄",
              dataIndex: "serviceYearsCompany",
              key: "serviceYearsCompany",
              width: 130,
              className: 'column-number-right ', // 靠右对齐
          },
          {
              title: "年份",
              dataIndex: "year",
              key: "year",
              width: 100,
              filterType: "date",//输入框类型
              filterDropdown: "show",//显示条件
              filterDropdownType: "string",//字符条件
              render: (text, record, index) => {
                  return moment(text).format('YYYY');
              }
          },
          {
              title: "月份",
              dataIndex: "monthEnumValue",
              key: "monthEnumValue",
              width: 120,
          },
          {
              title: "补贴类别",
              dataIndex: "allowanceTypeEnumValue",
              key: "allowanceTypeEnumValue",
              width: 120,
          },
          {
              title: "补贴标准",
              dataIndex: "allowanceStandard",
              key: "allowanceStandard",
              width: 120,
              textAlign:'right',
              className: 'column-number-right ', // 靠右对齐
              render: (text, record, index) => {
                  return Number(text).toLocaleString();
              }
          },
          {
              title: "实际补贴",
              dataIndex: "allowanceActual",
              key: "allowanceActual",
              width: 120,
              textAlign:'right',
              className: 'column-number-right ', // 靠右对齐
              render: (text, record, index) => {
                  return Number(text).toLocaleString();
              }
          },
          {
              title: "是否超标",
              dataIndex: "exdeedsEnumValue",
              key: "exdeedsEnumValue",
              width: 120,
          },
          {
              title: "领取方式",
              dataIndex: "pickTypeEnumValue",
              key: "pickTypeEnumValue",
              width: 120,
          },
          {
              title: "备注",
              dataIndex: "remark",
              key: "remark",
              width: 100,
          },
          {
              title: "创建人",
              dataIndex: "createUserName",
              key: "createUserName",
              width: 100,
          },
          {
              title: "创建时间",
              dataIndex: "createTime",
              key: "createTime",
              width: 150,
              render: (text, record, index) => {
                  return moment(text).format('YYYY-MM-DD HH:mm:ss');
              }
          },
          {
              title: "修改人",
              dataIndex: "lastModifyUserName",
              key: "lastModifyUserName",
              width: 100,
          }, {
              title: "修改时间",
              dataIndex: "lastModified",
              key: "lastModified",
              width: 150,
              render: (text, record, index) => {
                  return moment(text).format('YYYY-MM-DD HH:mm:ss');
              }
          },
      {
          title: "操作",
          dataIndex: "$op$",
          key: "$op$",
          width: 200,
          fixed:'right',
          render:(text, record, index)=> {
              const obj = {
                  update: {//编辑
                      onClick: () => {
                          actions.treeTable.goto({
                              type:'edit',
                              record:record
                          })
                      }
                  },
              }

              return <Btns powerBtns={this.props.powerBtns}
               btns = { obj } type = 'line' /> ;
          }
      }
    ];

  componentDidMount() {
        let serviceCode = getQueryString('serviceCode', window.location.href) || getQueryString('servicecode', window.location.href);
        actions.treeTable.getPower({
          params: {
            servicecode: serviceCode
          },
          context: pom.fe.new.ctx
        });
        this.props.onRef(this);
        this.props.getChildValue(this.selectList,this.grid.exportExcel); 
        this.getData();

  }

  clearChildVal = () => {
    this.selectList = [];
    this.getData();
  }
  //重置过滤器
  reset = () => {
    //部分表单元素无法通过this.props.form.resetFields重置，需要手动重置，如下
    this.setState({
      currencyName: "",
      searchValue:{}
    })
  }

  onChangeExpanded = () => {
    this.setState({expanded: !this.state.expanded})
  }
  
  /**
   * 搜索
   * @param {string} value
   */
  onSearch = values => {
    this.setState({
      searchValue:values
    });
    actions.treeTable.loadData(values);
  }
  
  /**
   * 搜索框 onChang 事件
   * @param {string} value
   */
  onChange = value => {
    this.setState({
      currencyName: value
    })
  }
  
  /**
   * 列表选中行
   */
  
  getSelectedDataFunc = (selectData, record, index,newData) => {
    this.selectList = selectData;
    let {queryObj,getChildValue} = this.props
    let _list = cloneDeep(queryObj.list)
    const allChecked = selectData.length == 0 ? false : true
    if (!record) {
      _list.forEach(item => {
        item._checked = allChecked
      })
    } else {
      _list[index]['_checked'] = record._checked
    }
    queryObj.list = _list
    actions.treeTable.updateState({
      queryObj
    })
    getChildValue(this.selectList,this.grid.exportExcel);   
  }
  
  // 点击分页
  pageIndexChange = (num) => {
   const {searchValue} = this.state;
    this.getData({
      pageIndex: num - 1,
        code:searchValue.code || '',
        name:searchValue.name || '',
        year:searchValue.year || '',
        month:searchValue.month || '',
        exdeeds:searchValue.exdeeds || '',
    })
  }
  
  // 点击改变每页容量
  pageSizeChange = (index, value) => {
      const {ordField,ordSort,searchValue} = this.state;
      let pageSize = value === 'All' ? 1 : parseInt(value);
  console.log(searchValue.exdeeds)

      this.getData({
        pageSize,
        orderField:ordField,
        orderSort:ordSort,
        code:searchValue.code || '',
        name:searchValue.name || '',
        year:searchValue.year || '',
        month:searchValue.month || '',
        exdeeds:searchValue.exdeeds || '',
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.currentSelectedId!==this.props.currentSelectedId){
      this.getData({
        dept:nextProps.currentSelectedId
      })
    }
  }
  
  //获取列表主数据
  getData = param => {
    const { queryObj,currentSelectedId,currencyName } = this.props,
          { pageIndex,pageSize } = queryObj;
    const params = Object.assign({
        dept:currentSelectedId || '',
        pageIndex,
        pageSize,
        currencyName
      }, param);
    actions.treeTable.loadData(params);
  }
  
      /**
     *
     * 关联数据钻取
     * @param {object} record 关联数据行数据
     * @param {string} key menu菜单key值
     */
    onRelevance = (record, key) => {
        let {name} = record;
        if (key === "code") {  // 弹出模态框
            this.setState({record, showModal: true});
        }
        if (key === "year") {  // 跳转新页面
            let {code, name, sexEnumValue, levelName} = record;
            actions.treeTable.goto({
              type: 'detail',
              record
            })
        }
    }

    /**
     * 关闭模态框
     */
    close = () => {
        this.setState({showModal: false});
    }




        /**
     *
     *排序属性设置
     * @param {Array} sortParam 排序参数对象数组
     */
    sortFun = (sortParam) => {
        const ordField = sortParam.length!==0?sortParam[0].field:'';
        const ordSort = sortParam.length!==0?(sortParam[0].order==='ascend'?'ASC':'DESC'):'';
        this.setState({
          ordField,
          ordSort
        })
        this.getData({
          "orderField": ordField,
          "orderSort": ordSort
        });
    }

  
  render() {
    const {showLoading, powerBtns, queryObj,dataNumObj} = this.props,
          {list, pageIndex, pageSize, totalPage, total} = queryObj;
    const {record} = this.state;
    const paginationObj = {
        activePage: pageIndex + 1,//当前页
        total,//总条数
        items: totalPage,
        dataNum: dataNumObj[pageSize],
        freshData: this.pageIndexChange,//刷新数据
        onDataNumSelect: this.pageSizeChange,//选择记录行
        disabled: false//分页条禁用状态
    }
    const sortObj = {  //排序属性设置
        mode: 'multiple',
        backSource: true,
        sortFun: this.sortFun
    }
    const _this = this;
    return (
        <div className='currency-type'>
          <Loading
              fullScreen
              showBackDrop={ true }
              show={ showLoading }
          />
            <SearchArea
                onSearch={this.onSearch}
                onReset={this.reset}
                onRef={ref => this.child = ref}
            />
          <Grid
              exportFileName={'员工津贴'}
              ref={(el) => this.grid = el}
              rowKey={r => r.id ? r.id : r.key}
              columns={ this.gridColumn }
              data={ list }
              getSelectedDataFunc={ this.getSelectedDataFunc }
              multiSelect={ true }
              columnFilterAble={true}//是否显示右侧隐藏行
              showHeaderMenu={true}//是否显示菜单
              dragborder={true}//是否调整列宽
              draggable={true}//是否拖拽
              autoCheckedByClickRows={ false }
              syncHover={false}//是否同步状态
              showFilterMenu={false} //是否显示行过滤菜单
              scroll={{y: 500}}
              paginationObj={paginationObj}//分页数据
              excludeKeys={['id', 'ts', 'lastModified']}
          />
                <PopDialog
                    show={this.state.showModal}
                    title={"模态弹出"}
                    close={this.close}
                    btns={[]}
                >
                    <div style={{'fontSize':'13px','padding':'8px 0'}}>
                        <span>员工编号：</span>
                        <span>{record.code}</span>
                    </div>
                    <div style={{'fontSize':'13px','padding':'8px 0'}}>
                        <span>员工姓名：</span>
                        <span>{record.name}</span>
                    </div>
                    <div style={{'fontSize':'13px','padding':'8px 0'}}>
                        <span>员工性别：</span>
                        <span>{record.sexEnumValue}</span>
                    </div>
                    <div style={{'fontSize':'13px','padding':'8px 0'}}>
                        <span>职级：</span>
                        <span>{record.levelName}</span>
                    </div>
                </PopDialog>
        </div>
    )
  }
}

export default connect(state => state.treeTable)(App);

