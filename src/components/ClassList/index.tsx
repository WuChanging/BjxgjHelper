import React from 'react';
import { Link } from "react-router-dom";
//import { classListData } from '../../configs/classListData';

class ClassList extends React.Component<object, {data: null | Array<any>}> {
	constructor(props: object) {
		super(props)
		this.state = {
			data: null
		}
	}
	
	componentDidMount() {
		this.setState({
			data: JSON.parse(localStorage.getItem("classList") || "") //classListData
		});
	}

	render() {
		return (
			<div>
				<div className="rounded-rectangle">
					<div className="cards-container">
						{
							this.state.data ? (this.state.data.map(e => (
								(e.classId && e.classId.length) ? (
									<div className="cards index" key={e.name+e.openId}>
										<Link to={`/getClassWorksByTeacher/${e.openId}/${e.classId[0]}`} state={e.classId} >
											<div className="title weak">教师账号
												<span className="right">班级小管家</span>
											</div>
											<div className="title fir line-couple"><i className="icon edu-hat"></i>{e.name}</div>
											<div className="title container">
												{e.headTeacher ? (
													<div className="title tag">「班主任」{e.headTeacher}</div>
												) : ""}
												{e.introduction ? (
													<div className="title sub">「简介」{e.introduction}</div>
												) : ""}
											</div>
										</Link>
									</div>
								) : (
									<div className="cards index" key={e.name}>
										<Link to={`/getClassWorksByStudent/${e.openId}/${e.memberId}`}>
											<div className="title weak">
												<span className="right">班级小管家</span>
											</div>
											<div className="title fir line-couple"><i className="icon edu-hat"></i>{e.name}</div>
											<div className="title container">
												{e.headTeacher ? (
													<div className="title tag">「班主任」{e.headTeacher}</div>
												) : ""}
												{e.introduction ? (
													<div className="title sub">「简介」{e.introduction}</div>
												) : ""}
											</div>
										</Link>
									</div>)
							))): (<div>Loading...</div>)
						}
					</div>
				</div>
			</div>
		);
	}
}

export default ClassList