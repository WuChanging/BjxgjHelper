import { useLocation, useParams } from "react-router-dom"
import UserWorks from "../../components/UserWorks"
import WorkDetail from "../../components/WorkDetail"

const ShowWorks = () => {
	const { state } = useLocation()
	const { openId, homeworkId, classId, workType } = useParams()
	//console.log("WorkDetail | STATE | ", state)
	
	return (
		<div>
			{state ? (
				<WorkDetail data={state}/>
			) : (
				<>
					<div className="blocks blocks-rosybrown margin-auto">
						「作业内容详细信息」需上级组件的加载数据 | QwQ
					</div>
					<div className="blocks blocks-royalblue margin-auto">
						「教师上传文件信息」需上级组件的加载数据 | QwQ
					</div>
				</>
			)}
			<UserWorks data={{
				openId: openId ? openId : "",
				homeworkId: homeworkId ? homeworkId : "",
				size: 60,
				classId: classId ? classId : "",
				workType: Number(workType)
			}} />
		</div>
	)
}

export default ShowWorks