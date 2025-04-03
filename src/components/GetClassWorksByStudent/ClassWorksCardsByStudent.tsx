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
		memberId: string,
		page: number,
		size: number
	}
}
class ClassWorksCardsByStudent extends React.Component<props, any> {
	constructor(props: props) {
		super(props)
	}

	transformToNomalTime = (date: any, isEndDay: boolean) => {
		if (isEndDay) {
			const endArray = (date.split(/-| |:|T/g, 5)).map((e: string) => Number(e))
			date = new Date(endArray[0], endArray[1] - 1, endArray[2], endArray[3], endArray[4])
		} else date = new Date(date)

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		// 获取星期
		const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const weekday = weekdays[date.getDay()];
		// 获取时区
		const timezone = date.toTimeString().match(/\(([^)]+)\)/)[1];
		const timezoneOffset = date.toTimeString().match(/GMT([+-]\d{4})/)[0];
		// 组合成目标格式
		return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} ${weekday} ${timezoneOffset} (${timezone})`;
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
			e.hasOwnProperty('may_later') ? (
				e.may_later ? (
					<span className='title borders bg-gray top-left'>已截止 | 允许 24h 补交</span>
				) : (
					<span className='title borders bg-black top-left'>已截止 | 不允许补交</span>
				)
			) : (
				<span className='title borders bg-black top-left'>已截止 | 不允许补交</span>
			)
		) : (
			e.hasOwnProperty('may_later') ? (
				e.may_later ? (
					<span className='title borders bg-pule-blue top-left'>进行中 | 允许 24h 补交</span>
				) : (
					<span className='title borders bg-pule-red top-left'>进行中 | 不允许补交</span>
				)
			) : (
				<span className='title borders bg-pule-red top-left'>进行中 | 不允许补交</span>
			)
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
						<Link to={`/showScores/${openId}/${e['_id']}`}>
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
								<div className="title tag">「截止时间」{
									(e.hasOwnProperty("end_day") && e.end_day.length) ? this.transformToNomalTime(e['end_day'], true) :
										(e.hasOwnProperty("daka_end_day") && e.daka_end_day.length) ? this.transformToNomalTime(e['daka_end_day'], false) :
											"未获取到截止时间，请找开发者反馈问题"
								}</div>
								<div className="title sub">「任务内容」{e['text_content']}</div>
							</div>
						</Link>
						<hr />
						<div className="title tag">ID: {e['_id']}</div>
					</div>
				)
			))) : "No data or fetch data error."
		)
	}
}

export default ClassWorksCardsByStudent