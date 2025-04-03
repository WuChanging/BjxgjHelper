import React from "react";
import { request } from '../../assets/main'
import ClassWorksCardsByTeacher from './ClassWorksCardsByTeacher'
import { Select } from 'antd';

type propsType = {
	data: {
		openId: string,
		classId: Array<any>,
		defaultClass: string,
		page: number,
		size: number
	}
}

class GetClassWorksByTeacherComponent extends React.Component<propsType, any> {
	constructor(props: any) {
		super(props)
		this.state = {
			isLoading: true,
			homeWorks: []
		}
	}
	componentDidMount() {
		const { defaultClass } = this.props.data
		this.getHomeworks(defaultClass)
	}
	prePage = (e: any) => {
		this.props.data.page -= 1
		this.getHomeworks((document.getElementsByClassName("classesSelect") as HTMLCollection)[0].textContent);
	}
	nextPage = (e: any) => {
		this.props.data.page += 1
		this.getHomeworks((document.getElementsByClassName("classesSelect") as HTMLCollection)[0].textContent);
	}
	getHomeworks = (e: any) => {
		this.setState({
			isLoading: true
		})
		const { openId, classId, page, size } = this.props.data;
		
		if (e === "All classes") {
			request(`https://b.welife001.com/info/getTeacher?lookAll=true&onlyMe=false&page=${page}&role_detail_id=&size=${size}&teacher_cate=teach_class_list`, {}, openId, false, (res) => {
				if (res.data === "Denied!") {
					alert("Denied!")
				} else {
					console.log("All Class Returned Data", res.data.data);
					this.setState({
						homeWorks: res.data.data,
						isLoading: false
					})
				}
			});
		} else {
			request(`https://b.welife001.com/info/getTeacher?cls=${e}&date=-1&keyword=&lookAll=false&onlyMe=false&page=${page}&role_detail_id=&size=${size}&teacher_cate=teach_class_list&type=-1`, {}, openId, false, (res) => {
				if (res.data === "Denied!") {
					alert("Denied!")
				} else {
					console.log("Specific Class Returned Data", res.data)
					console.log("C/GetClassWorksByTeacher/index.ts: ", res.data.data);
					this.setState({
						homeWorks: res.data.data,
						isLoading: false
					})
				}
			})
		}
	}
	
	changeClass = (e: any) => {
		this.props.data.page = 0
		this.getHomeworks(e)
	}
	
	render() {
		const { classId, page, defaultClass } = this.props.data
		return (
			<div>
				<div className="blocks blocks-royalblue margin-auto width-fit" style={{ display: "flex", alignItems: "center" }}>
					{classId.length === 1 ? (
						<Select
							className="classesSelect"
							style={{ width: "15.5rem", marginRight: "1rem" }}
							defaultValue={defaultClass}
							onChange={this.changeClass}
							options={[
								{ value: classId[0], label: classId[0] }
							]}
						/>
					) : (
						<Select
							className="classesSelect"
							style={{ width: "15rem", marginRight: "1rem" }}
							defaultValue={defaultClass}
							onChange={this.changeClass}
							options={
								classId.map((e: string) => (
									{ value: e, label: e }
								))
							}
						/>
					)}
					<button className="button blue" onClick={this.prePage} disabled={!page}>上一页</button>
					<div className="borders borders-black">第 {page + 1} 页</div>
					<button className="button blue" onClick={this.nextPage}>下一页</button>
				</div>
				<br />
				{this.state.isLoading ? (
					<div className='cards-container'>Loading...</div>
				) : (
					<div>
						<div className="rounded-rectangle">
							<div id="container" className="cards-container">
								<ClassWorksCardsByTeacher works={this.state.homeWorks} data={this.props.data} />
							</div>
						</div>
					</div>
				)}
			</div>
		)
	}
}

export default GetClassWorksByTeacherComponent