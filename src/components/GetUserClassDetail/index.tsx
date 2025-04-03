import React from "react";
import { request } from '../../assets/main'

type props = {
	data: {
		openId: string,
		memberId: string
	}
}
class GetUserClassDetailComponent extends React.Component<props, any> {
	constructor(props: props) {
		super(props)
		this.state = {
			isLoading: true,
			classDetail: null
		}
	}
	
	componentDidMount(): void {
		const { openId, memberId } = this.props.data
		request('https://a.welife001.com/getClassByMemberId', { 'member_ids': memberId }, openId, true, (res) => {
			this.setState({
				isLoading: false,
				classDetail: res.data
			})
			console.log(res.data)
		}, 'application/json')
	}
	
	render() {
		return (
			<div>
				请看控制台 console.log 输出 /huaji
			</div>
		)
	}
}

export default GetUserClassDetailComponent