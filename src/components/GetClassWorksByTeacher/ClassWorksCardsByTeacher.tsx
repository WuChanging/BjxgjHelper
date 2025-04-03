import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'

type worksType = [
	type: Number,
	need_feedback: boolean,
	feedback_type: Number,
	accept_count: Number,
	feedback_count: Number,
	daka_rest: [],
	_id: String,
	stats_list: [],
	create_at: String,
	daka_start_day: String,
	daka_end_day: String,
	daka_latest: String,
	sort_time: String,
	class_name: String,
	cls: String,
	creator_wx_name: String,
	creator_wx_openid: String,
	end_day: String,
	text_content: String,
	title: String,
	is_owner: boolean,
	admin_id: String,
	teacher_name: String,
	delay_publish: boolean,
	is_group: boolean,
	class_number: Number
]
interface props {
	works: worksType,
	data: {
		openId: string,
		classId: Array<string> | undefined,
		page: number,
		size: number
	}
}
class ClassWorksCardsByTeacher extends React.Component<props, any> {
	constructor(props: props) {
		super(props)
	}

	isTimeExpired = (endTime: any, isEndDay: boolean) => {
		if (isEndDay) {
			const endArray = (endTime.split(/-| |:|T/g, 5)).map((e: string) => Number(e))
			endTime = new Date(endArray[0], endArray[1] - 1, endArray[2], endArray[3], endArray[4])
		} else endTime = new Date(endTime)
		if (new Date() > endTime) return true
		else return false
	}
	isExpired = (item: any) => {
		if (item.hasOwnProperty('end_day') && item.end_day.length) {
			return this.isTimeExpired(item.end_day, true)
		} else if (item.hasOwnProperty('daka_end_day') && item.daka_end_day.length) {
			return this.isTimeExpired(item.daka_end_day, false)
		} else return false;
	}
	isExpiredBlock = (e: any) => {
		return this.isExpired(e) ? (
			<span className='title borders bg-gray top-left'>已截止</span>
		) : (
			<span className='title borders bg-pule-blue top-left'>进行中</span>
		)
	}
	filesBlock = (e: any) => {
		return e.file_content ? (
			e.file_content.length ? (
				<span className="title top-right borders bg-pule-blue"><i className='icon clip'></i>{e.file_content.length + '个文件: ' + e.file_content[0].origin_name}</span>
			) : (
				e.photo_content.length ? (
					<span className="title top-right borders bg-pule-blue"><i className='icon picture'></i>{e.photo_content.length + '张图片'}</span>
				) : (
					e.video_contents ? (
						console.log("【若您看到此消息，请将此 作业地址/浏览器地址栏地址 递交给 Developer | Thank You!】此作业可能含有 videos 等媒体文件，代码暂未支持显示此类文件。")
					) : (
						e.record_contents ? (
							console.log("【若您看到此消息，请将此 作业地址/浏览器地址栏地址 递交给 Developer | Thank You!】此作业可能含有 records 等媒体文件，代码暂未支持显示此类文件。")
						) : ""
					)
				)
			)
		) : ""
	}

	render() {
		const { openId } = this.props.data
		const { works } = this.props
		return (
			(works && works.length) ? (works.map((e: any) => (
				e.hasOwnProperty('score') ? (
					<div className="cards doubling" key={e['_id']}>
						<Link to={`/showScores/${openId}/${e['_id']}/${e['score']}`}>
							<div className="title weak">
								Score | {e['creator_wx_name']}
								<span className="right">{e['class_name']}</span>
							</div>
							<div className="title fir"><i className="icon edu-hat"></i>{e['title']}</div>
							<div className="title container">
								<div className="title sub">「作业内容」{e['text_content']}</div>
							</div>
						</Link>
						<hr />
						<div className="title tag">ID: {e['_id']}</div>
					</div>
				) : (
					<div className="cards doubling" key={e['_id']}>
						<Link
							to={`/showWorks/${openId}/${e._id}/${e.cls}/${e.type}`}
							state={{
								className: e.class_name,
								teacherName: e.creator_wx_name,
								createTime: e.create_at,
								endTime: e.end_day,
								isEnd: this.isExpired(e),
								subject: e.subject,
								workTitle: e.title,
								workDetail: e.text_content,
								mayLater: e.may_later,
								files: {
									fileContent: e.file_content,
									photoContent: e.photo_content,
									recordContent: e.record_cotents,
									videoContent: e.video_contents
								}
							}}
						>
							<div className="title weak">
								{e['subject']} | {e['creator_wx_name']}
								<span className="right">{e['class_name']}</span>
								{this.isExpiredBlock(e)}
								{this.filesBlock(e)}
							</div>
							<div className="title fir">
								<i className='icon edu-hat' />
								{e['title']}
							</div>
							<div className="title container">
								<div className="title tag">「截止时间」{e.hasOwnProperty('end_day') && e['end_day'].hasOwnProperty(length) && e['end_day'].length ? e['end_day'] : e['daka_end_day']}</div>
								<div className="title sub">「任务内容」{e['text_content']}</div>
							</div>
						</Link>
						<hr />
						<div className="title tag">ID: {e['_id']}</div>
					</div>
				)
			))) : "No data"
		)
	}
}

export default ClassWorksCardsByTeacher