import './index.css'
import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface props {
	data: {
		openId: string,
		homeworkId: string,
		size: number,
		classId: string,
		workType: Number
	}
}
class UserWorks extends React.Component<props, any> {
	constructor(props: props) {
		super(props);
		this.state = {
			data: null,
			isLoading: true
		}
	}

	componentDidMount(): void {
		const { data } = this.props
		if (data.workType == 3) {
			axios({
				method: 'post',
				url: 'https://a.welife001.com/applet/notify/check2Qns',
				headers: {
					"Content-type": "application/json",
					"imprint": data.openId
				},
				data: {
					"_id": data.homeworkId,
					"cid": data.classId,
					"cls_ts": Date.now(),
					"teacher_cate": "teach_class_list",
					"trial": false
				}
			}).then((res) => {
				console.log("check2Qns API Returned data: ", res);
				this.setState({
					data: res.data.data.accepts,
					isLoading: false
				})
			}).catch((errors) => {
				console.log(errors)
			})
		} else {
			axios({
				method: 'post',
				url: 'https://a.welife001.com/applet/notify/checkNew2ParentList',
				headers: {
					"Content-type": "application/json",
					"imprint": data.openId
				},
				data: {
					extra: 1,
					"page": 0,
					"size": data.size,
					"_id": data.homeworkId,
					"cid": "",
					"daka_day": "",
					"member_id": "",
					"sortType": "shijiandaoxu",
					"selectType": "quanbu"
				}
			}).then((res) => {
				console.log("checkNew2ParentList API Returned data: ", res);
				this.setState({
					data: res.data.data.accepts,
					isLoading: false
				})
			}).catch((errors) => {
				console.log(errors)
			})
		}
	}

	timeBlock = (str: string) => {
		const date = new Date(str)
		return (
			<div>
				<i className={`icon calendar-${date.getDate()}`}></i>{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
				<i className='icon time'></i>{date.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
			</div>
		)
	}

	photo_url = (str: string, index: number) => {
		return (
			<a target="_blank" href={`http://img.banjixiaoguanjia.com/${str}?x-oss-process=image/resize,m_fill/auto-orient,1/quality,q_100/interlace,1/format,jpg`} key={index}>
				<img style={{ width: "32%", borderRadius: "1rem", marginRight: ".2rem" }} src={`http://img.banjixiaoguanjia.com/${str}?imageMogr2/crop/200x200/gravity/center`} />
			</a>
		)
	}

	file_url = (file_site: string, file_name: string, index: number) => {
		return (
			<a target="_blank" href={`http://file.banjixiaoguanjia.com/${file_site}`} key={index}>
				<div className='file_download_block borders borders-black bg-orange width-fit'>
					<i className="icon download"></i>点此下载文件 | {file_name}
				</div>
			</a>
		)
	}

	is_file_url = (str: string) => {
		return (str.slice(30, 35) == "_file") ? true : false;
	}

	records_url = (item: any, index: number) => {
		return (
			<a target="_blank" href={`http://record.banjixiaoguanjia.com/${item.record}`} key={index}>
				<div className='file_download_block borders borders-black bg-orange width-fit'>
					<i className="icon download"></i>{
						(item.hasOwnProperty("is_draft") && item.is_draft == true) ? "【草稿】" : ""
					}{
						item.hasOwnProperty("duration") ? ("【时长：" + item.duration + "s】") : ""
					}
					点此下载文件 | {item.record.match(/\/(.*)/)[1]}
				</div>
			</a>
		)
	}

	videos_url = (item: any, index: number) => {
		return (
			<a target="_blank" href={`http://video.banjixiaoguanjia.com/${item.video}`} key={index}>
				<div className='file_download_block borders borders-black bg-orange width-fit'>
					<i className="icon download"></i>{
						(item.hasOwnProperty("is_draft") && item.is_draft == true) ? "【草稿】" : ""
					}{
						item.hasOwnProperty("duration") ? ("【时长：" + item.duration) : "s】"
					}
					点此下载文件 | {item.video}
				</div>
			</a>
		)
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div className='cards-container'>Loading...</div>
			)
		}

		const { data } = this.state

		console.log("C/UserWorks/index.ts: ", data);

		return (
			<div>
				<div className="borders borders-black text-center">共获取到 {data.length} 条数据</div>
				<div id="hw-block">
					{data.map((e: any) => (
						<div className="user-blocks" key={e._id}>

							<div style={{ display: "flex", flexWrap: "wrap" }}>
								{ /* 用户 */ }
								<Link to={"/getUserClasses/" + e.wx_openid}>
									<div className="borders bg-blue">
										<i className="icon circle-avatar"></i>{e.name}
									</div>
								</Link>

								{ /* 时间 */ }
								<div className="borders bg-red opacity">{this.timeBlock(e.create_at)}</div>

								{ // 教师评级（优秀、良好、不及格等）
									e.hasOwnProperty("level") && e.level.length ? (
										<div className="borders bg-purple">{e.level}</div>
									) : ""}

								{ // 教师点赞
									e.hasOwnProperty("like") ? (
										e.like.map((item: any, index: number) => (
											<div className='borders bg-purple' key={index}>
												<i className='icon thumb-up'></i>{item.from_name}老师已点赞
											</div>
										))
									) : ""}
							</div>

							{(e.hasOwnProperty("feedback_text") && e.feedback_text.length && e.feedback_text != "undefined") ? (
								<div className="borders bg-blue">「用户作业说明」{e.feedback_text}</div>
							) : ""}

							{(e.hasOwnProperty("reply") && e.reply.length) ? (
								<div className='borders bg-orange width-fit'>
									<div className='text-center'>「评论回复」</div>
									{e.reply.map((item: any, index: number) => (
										<div className="borders borders-black" key={index}>
											{item.from_name + "：" + item.content}
											<div style={{ lineHeight: "1rem", textAlign: "end", fontSize: "x-small" }}>{this.timeBlock(item.create_at)}</div>
										</div>
									))}
								</div>
							) : ""}

							{ // 多作业任务
								e.hasOwnProperty("answer") ? (
									e.answer.subject.map((item: any, index: number) => (
										<div key={item._id}>
											<div>【作业序列号#{item.seq + 1}】</div>
											{item.input.file.map((files: any, index: number) => (
												this.is_file_url(files.id) ? this.file_url(files.id, files.name, index) : this.photo_url(files.id, index)
											))}
											{item.input.hasOwnProperty("content") && item.input.content?.length ? (
												<div>用户输入：{item.input.content}</div>
											) : ""}
											<br />
										</div>
									))
								) : ( //单作业任务
									<>
										{e.hasOwnProperty("feedback_photo") ? ( // 图片
											e.feedback_photo.map((item: any, index: number) => (
												this.photo_url(item, index)
											))
										) : ""}
										{e.hasOwnProperty("feedback_files") ? ( // 文件
											e.feedback_files.map((item: any, index: number) => (
												this.file_url(item.new_name, item.origin_name, index)
											))
										) : ""}
										{e.hasOwnProperty("feedback_records") ? ( // 音频
											e.feedback_records.map((item: any, index: number) => (
												this.records_url(item, index)
											))
										) : ""}
										{e.hasOwnProperty("feedback_videos") ? ( // 视频
											e.feedback_videos.map((item: any, index: number) => (
												this.videos_url(item, index)
											))
										) : ""}
										{e.hasOwnProperty("emends") ? (
											<>
												<br />
												{e.emends.map((item: any, index: number) => (
													<div key={index}>
														<div>【作业更正如下】</div>
														{item.feedback_text}
														{item.feedback_photo.map((pics: any, index: number) => (
															this.photo_url(pics, index)
														))}
													</div>
												))}
											</>
										) : ""}
									</>
								)
							}

						</div>
					))}
				</div>
			</div>
		)
	}
}

export default UserWorks