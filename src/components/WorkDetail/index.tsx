import React from 'react'

interface props {
	data: {
		openId: string,
		homeworkId: string,
		className: string,
		teacherName: string,
		createTime: string,
		endTime: string,
		isEnd: boolean,
		subject: string,
		workTitle: string,
		workDetail: string,
		mayLater: boolean,
		files: {
			fileContent: 	Array<object>,
			photoContent: Array<string>
			recordContent: Array<any>,
			videoContent: Array<any>
		}
	}
}
class WorkDetail extends React.Component<props,any> {
	constructor(props: props) {
		super(props)
	}
		
	returnToNormalTime = (str: string) => {
		return str.slice(0, 10) + " " + ((Number(str.slice(11, 13)) + 8) % 24) + str.slice(13, -5);
	}
	
	timeBlock = (str: string) => {
		return "<i className='icon calendar-" + str.slice(8, 10) + "'></i>" + str.slice(0, 10) + "<i className='icon time'></i>" + ((Number(str.slice(11, 13)) + 8) % 24) + str.slice(13, -5);
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
	
	render() {
		const { data } = this.props
		console.log("C/WorkDetail/index.ts: ", data);
		
		return (
			<div style={{ display: "flex", maxWidth: "80rem", margin: "auto" }}>
				<div className='blocks blocks-rosybrown width-fit height-fit' style={{ flex: 1 }}>
					<div className='title weak'>
						{data.className}
						<span className={`borders top-right ${data.isEnd ? "bg-gray" : "bg-pule-blue"}`}>{data.isEnd ? "已截止" : "进行中"} | {data.mayLater ? "允许补交" : "不允许补交"}</span>
					</div>
					<div className='title large'><i className="icon edu-hat"></i>{data.workTitle}</div>
					<div className='title fir'>「任务内容」{data.workDetail}</div>
					<div className='title sub'>「截止时间」{data.endTime}</div>
					<div className='title sub'>{`「${data.teacherName}」发布于 ${this.returnToNormalTime(data.createTime)}`}</div>
				</div>
				
				<div className='blocks blocks-royalblue width-fit height-fit' style={{ flex: 1 }}>
					<div className='title weak'>
						{data.className}
						<span className='borders top-left bg-pule-blue'>教师上传文件详情</span>
					</div>
					{data.files.fileContent && data.files.fileContent.length ? (
						<div className='title fir' style={{ lineHeight: "2rem" }}>「教师上传的文件」<br />
							<div className='flex column'>
								{data.files.fileContent.map((e: any, index: number) => (
									this.file_url(e.new_name, e.origin_name, index)
								))}
							</div>
						</div>
					) : ""}
					{data.files.photoContent && data.files.photoContent.length ? (
						<div className='title fir'>「教师上传的图片」<br />
							{data.files.photoContent.map((e: any, index: number) => (
								this.photo_url(e, index)
							))}
						</div>
					) : ""}
					{(!data.files.fileContent || !data.files.fileContent.length) && (!data.files.photoContent || !data.files.photoContent.length) ? (
						"教师未上传图片/文件"
					) : ""}
				</div>
			</div>
		)
	}
}

export default WorkDetail