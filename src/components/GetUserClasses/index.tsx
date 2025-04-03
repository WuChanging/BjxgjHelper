import React from "react"
import { request } from "../../assets/main"
import { Link } from 'react-router-dom'

interface props {
	openId: string
}
class UserClasses extends React.Component<props, any> {
	constructor(props: props) {
		super(props)
		this.state = {
			isLoading: true,
			userDetail: null
		}
	}
	
	componentDidMount(): void {
		const { openId } = this.props
		request('https://b.welife001.com/getUser', { 'openid': openId }, openId, true, (res) => {
			if(res.data === "Denied!") {
				alert("Denied!")
			} else {
				console.log("getUser", res)
				this.setState({
					isLoading: false,
					userDetail: res.data.currentUser
				})
			}
		}, 'application/json;charset=UTF-8')
	}
	
	render() {
		if(this.state.isLoading) {
			return (
				<div className='cards-container'>Loading...</div>
			)
		}
		const { userDetail } = this.state
		const userClassIdArray: Array<string> = []
		if (userDetail.hasOwnProperty('teach_class_list') && userDetail.teach_class_list.length) {
			userDetail.teach_class_list.map((item: any) => {
				userClassIdArray.push(item.cid)
			})
		}
		
		return (
			<div>
				<div className="blocks blocks-royalblue margin-auto">
					{(userDetail.hasOwnProperty('child_class_list') && userDetail.child_class_list.length) ? (
						<>
							<div>「用户加入的班级」openId | memberId | cid:</div>
							{userDetail.child_class_list.map((item: any) => (
								<Link to={`/getClassWorksByStudent/${userDetail.openid}/${item.member_id}/${item.cid}`} className="title borders bg-blue text-center" key={item.cid}>
									{userDetail.openid} | {item.member_id} | {item.cid}
								</Link>
							))}
						</>
					) : ""}
					{(userDetail.hasOwnProperty('teach_class_list') && userDetail.teach_class_list.length) ? (
						<div>
							<div>「用户创建/参与的班级」openId | classId:</div>
							{userDetail.teach_class_list.map((item: any) => (
								<Link to={`/getClassWorksByTeacher/${userDetail.openid}/${item.cid}`} className="title borders bg-blue text-center" key={item.cid} state = {userClassIdArray}>
									{userDetail.openid} | {item.cid}
								</Link>
							))}
						</div>
					) : ""}

					{userDetail.hasOwnProperty('app_info') ? (<div>「此用户使用过`班级小管家 APP`」</div>) : ""}
					{userDetail.hasOwnProperty('device_info') ? (
						userDetail.device_info.hasOwnProperty('model') ? (<div>「用户设备」{userDetail.device_info.model}</div>) : ""
					) : ""}
				</div>
			</div>
		)
	}
}

export default UserClasses