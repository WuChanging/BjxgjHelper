import ClassList from '../../components/ClassList'
import { Link } from 'react-router-dom'
import { versionLogs } from '../../configs'

const Index = () => {
	const signOut = () => {

		localStorage.clear()
		location.reload()
	}

	return (
		<div>
			<div className="blocks blocks-royalblue margin-auto">
				<Link to="/updateLogs">
					<h4>
						<img src="bjxgj.png" alt="bjxgj" />
						「班级小管家 Helper | Version {versionLogs.version}」
					</h4>
				</Link>
			</div>
			<br />
			<button className='button blue right ' onClick={signOut}>登出账号</button>
			<br />
			<ClassList />
		</div>
	)
}

export default Index