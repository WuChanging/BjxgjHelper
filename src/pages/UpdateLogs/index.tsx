import React from 'react'
import './index.css'
import { versionLogs } from '../../configs'

const UpdateLogs = () => {
	const showAllLogs = () => {
		(document.getElementById('other-update-logs') as HTMLElement).classList.remove('active');
		(document.getElementById('show-all-logs-button') as HTMLElement).style.display = "none";
	}
	
	return (
		<div>
			<div className="blocks margin-auto">
				<h2 className='text-center'>「bjxgjHelper Release Update Logs」</h2>
				<br />
				<div id="update-logs" className="blocks blocks-royalblue margin-auto" style={{minWidth: "30rem"}}>
					<div className='blocks'>
						<h3>V{versionLogs.logs[0].version} - {versionLogs.logs[0].updateTime}</h3>
						{versionLogs.logs[0].detail.map((e: any, index: number) => (
							<h4 key={index}>{e}</h4>
						))}
					</div>
					<div id="other-update-logs" className='active'>
						{versionLogs.logs.map((item: any, index: number) => (
							index === 0 ? "" : (
								<div className="blocks" key={index}>
									<h3>V{item.version} - {item.updateTime}</h3>
									{item.detail.map((e: any, index: number) => (
										<h4 key={index}>{e}</h4>
									))}
								</div>)
						))}
					</div>
					<br />
					<button id="show-all-logs-button" className='button blue margin-auto' onClick={showAllLogs}>~ Click to show all logs. ~</button>
				</div>
			</div>
		</div>
	)
}

export default UpdateLogs