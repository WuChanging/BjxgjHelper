import React from 'react'
import { Link } from 'react-router-dom'
import { request } from '../../assets/main'
import ClassWorksCardsByStudent from './ClassWorksCardsByStudent'

type propsType = {
  data: {
    openId: string,
    memberId: string,
    cid: string,
    page: number,
    size: number
  }
}
class GetClassWorksByStudentComponent extends React.Component<propsType, any> {
  constructor(props: propsType) {
    super(props)
    this.state = {
      isLoading: true,
      homeWorks: [],
      classDetail: []
    }
  }
  componentDidMount() {
    this.getHomeworks()
  }
  prePage = () => {
    this.props.data.page -= 1
    this.getHomeworks();
  }
  nextPage = () => {
    this.props.data.page += 1
    this.getHomeworks();
  }
  getHomeworks = () => {
    this.setState({
      isLoading: true
    })
    const { openId, memberId, cid, page, size } = this.props.data
    request(`https://a.welife001.com/info/getParent?type=-1&page=${page}&size=${size}&date=-1&hasMore=true&members=${memberId}`, {}, openId, false, (res) => {
      if (res.data === "Denied!") {
        alert("Denied!")
      } else {
        console.log(res.data)
        this.setState({
          homeWorks: res.data.data,
          isLoading: false
        })
      
        request('https://b.welife001.com/getMembersByCid2', { 'cid': cid, updateclass: 1 }, openId, true, (res) => {
          if (res.data === "Denied!") {
            alert("Denied!")
          } else {
            console.log('res.data: ', res.data)
            const members = res.data.members || [];
            const teachers = members.filter((m: any) =>
              m.teach_role_str && m.teach_role_str.trim() !== '' && m.type === 2
            );

            const classInfo = {
              // class_name: res.data.imprint_name || '未命名班级',
              teacher_list: teachers,
              teacher_join_count: teachers.length,
              creator_info: members.find((m: any) => m.relatives_role === -4) // 示例查找创建者
            };

            console.log('classInfo:', classInfo);
            this.setState({
              classDetail: [classInfo],
              isLoading: false
            });
          }
        }, 'application/json;charset=UTF-8')
      }
    })
  }
  showClassDetail = () => {
    const detail = document.getElementById('class-detail') as HTMLElement;
    const button = document.getElementById('show-class-detail-button') as HTMLElement;
    if (detail.classList.value.match(/active/g)) {
      detail.classList.remove('active')
      button.innerHTML = '隐藏班级详细信息'
    } else {
      detail.classList.add('active')
      button.innerHTML = '显示班级详细信息'
    }
  }

  render() {
    const { page } = this.props.data
    const { homeWorks, classDetail } = this.state
    return (
      <div>
        <div id="class-detail" className='active flex'>
          {classDetail.map((e: any, index: number) => (
            <div className='blocks blocks-rosybrown margin-auto width-fit' key={index}>
              {e.creator_info && (
                <div>「班级创建者」
                  <Link to={`/getUserClasses/${e.creator_info.wx_openid}`} className='borders bg-blue title'>
                    {e.creator_info.name || e.creator_info.wx_name} | {e.creator_info.wx_openid}
                  </Link>
                </div>
              )}

              <div>「班级教师」共{e.teacher_join_count}位
                {e.teacher_list.map((te: any, index: number) => (
                  <Link 
                    to={`/getUserClasses/${te.wx_openid}`} 
                    className='borders bg-blue title' 
                    key={index}
                  >
                    {te.name}（{te.teach_role_str}） | {te.wx_openid}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="blocks blocks-royalblue margin-auto width-fit aligned">
          <button className="button blue" onClick={this.prePage} disabled={!page}>上一页</button>
          <div className="borders borders-black">第 {page + 1} 页</div>
          <button className="button blue" onClick={this.nextPage}>下一页</button>
          <button id="show-class-detail-button" className="button teal" onClick={this.showClassDetail}>查看班级详细信息</button>
        </div>
        <br />
        {this.state.isLoading ? (
          <div className='cards-container'>Loading...</div>
        ) : (
          <div className="rounded-rectangle">
            <div id="container" className="cards-container">
              <ClassWorksCardsByStudent works={homeWorks} data={this.props.data}/>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default GetClassWorksByStudentComponent