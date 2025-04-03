import React from "react";
import { Table, Modal, Badge, Card, List, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { request } from "../../assets/main";
import * as XLSX from 'xlsx';
import './index.css';

interface Props {
	data: {
		examId: string;
		openId: string;
		scoreId: string;
	}
}

interface HistoryItem {
	_id: string;
	openid: string;
	time: string;
	phone: string;
}

interface DataType {
	key: React.Key;
	number: number | string;
	name: string;
	readStatus?: string;
	isAverage?: boolean;
	history?: HistoryItem[];
	[key: string]: any;
}

interface State {
	isLoading: boolean;
	examData: any;
	columns: ColumnsType<DataType>;
	datas: DataType[];
	modalVisible: boolean;
	modalHistory: HistoryItem[];
	modalStudentName: string;
}

class UserScores extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			isLoading: true,
			examData: null,
			columns: [],
			datas: [],
			modalVisible: false,
			modalHistory: [],
			modalStudentName: ''
		}
	}

	componentDidMount(): void {
		const { examId, openId, scoreId } = this.props.data;
		request("https://b.welife001.com/getScoreById", {
			"id": scoreId,
			"preview": false
		}, openId, true, (res) => {
			console.log(res.data);
			if (res.data === "Denied!") {
				alert("Denied!");
			} else {
				const scoreData = res.data.score;
				const config: string[] = scoreData.config;
				const details = scoreData.detail;

				const totalColumns: ColumnsType<DataType> = [
					{
						title: '序号',
						width: 60,
						className: 'font-weight-bolder',
						dataIndex: 'number',
						key: 'number',
						fixed: 'left',
						align: 'center',
						sorter: (a: DataType, b: DataType) => {
							if (a.isAverage) return -1;
							if (b.isAverage) return 1;
							return Number(a.number) - Number(b.number);
						}
					},
					{
						title: '姓名',
						width: 110,
						className: 'font-weight-bolder',
						dataIndex: 'name',
						key: 'name',
						fixed: 'left',
						align: 'center',
						sorter: (a: DataType, b: DataType) => {
							if (a.isAverage) return -1;
							if (b.isAverage) return 1;
							return a.name.localeCompare(b.name);
						}
					}
				];

				config.forEach((subject, idx) => {
					totalColumns.push({
						title: subject,
						width: 100,
						dataIndex: `score_${idx}`,
						key: `score_${idx}`,
						align: 'center',
						sorter: (a: DataType, b: DataType) => {
							if (a.isAverage) return -1;
							if (b.isAverage) return 1;
							const aValue = parseFloat(a[`score_${idx}`]);
							const bValue = parseFloat(b[`score_${idx}`]);
							if (!isNaN(aValue) && !isNaN(bValue)) {
								return aValue - bValue;
							}
							return 0;
						}
					});
				});

				totalColumns.push({
					title: '是否已读',
					width: 100,
					dataIndex: 'readStatus',
					key: 'readStatus',
					align: 'center',
					render: (_: any, record: DataType) => {
						if (record.isAverage) return '';
						return (
							<span
								style={{ cursor: record.history && record.history.length > 0 ? 'pointer' : 'default' }}
								onClick={() => { if (record.history && record.history.length > 0) { this.showHistory(record); } }}
							>
								<Badge color={record.read ? 'blue' : 'red'} text={record.read ? '已读' : '未读'} />
							</span>
						);
					}
				});

				const totalDatas: DataType[] = [];
				const sums: number[] = new Array(config.length).fill(0);
				const counts: number[] = new Array(config.length).fill(0);

				details.forEach((item: any, index: number) => {
					const row: DataType = {
						key: index,
						number: index + 1,
						name: item.name,
						read: item.read,
						history: item.history
					};
					item.scores.forEach((score: string, idx: number) => {
						row[`score_${idx}`] = score;
						const scoreNum = parseFloat(score);
						if (!isNaN(scoreNum)) {
							sums[idx] += scoreNum;
							counts[idx]++;
						}
					});
					row.readStatus = item.read ? "已读" : "未读";
					totalDatas.push(row);
				});

				const avgRow: DataType = {
					key: 'average',
					number: '',
					name: '平均值',
					isAverage: true
				};
				config.forEach((subject, idx) => {
					const avg = counts[idx] > 0 ? (sums[idx] / counts[idx]).toFixed(2) : '';
					avgRow[`score_${idx}`] = avg;
				});
				avgRow.readStatus = '';
				totalDatas.unshift(avgRow);

				this.setState({
					isLoading: false,
					examData: res.data,
					columns: totalColumns,
					datas: totalDatas
				});
			}
		}, "application/json");
	}

	showHistory = (record: DataType) => {
		this.setState({
			modalVisible: true,
			modalHistory: record.history || [],
			modalStudentName: record.name
		});
	}

	handleModalCancel = () => {
		this.setState({ modalVisible: false });
	}

	handleExportExcel = () => {
		const { datas, columns, examData } = this.state;
		const headerMapping: { dataIndex: string, header: string }[] = [];
		const usedHeaders: { [header: string]: number } = {};
		columns.forEach((col: any) => {
			if (col.dataIndex) {
				let header = col.title;
				if (usedHeaders[header] !== undefined) {
					usedHeaders[header]++;
					header = `${header} ${usedHeaders[header]}`;
				} else {
					usedHeaders[header] = 0;
				}
				headerMapping.push({ dataIndex: col.dataIndex, header });
			}
		});

		const exportData = datas.map((row: DataType) => {
			const obj: any = {};
			headerMapping.forEach(mapping => {
				obj[mapping.header] = row[mapping.dataIndex];
			});
			return obj;
		});

		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		const cardInfo = examData.notify || {};
		const title = cardInfo.title || examData.score.title || "成绩";
		const fileName = `${title}.xlsx`;
		XLSX.writeFile(workbook, fileName);
	}

	render() {
		const { isLoading, columns, datas, examData, modalVisible, modalHistory, modalStudentName } = this.state;
		if (isLoading) {
			return (
				<div className="cards-container">Loading...</div>
			);
		}
		const cardInfo = examData.notify || {};
		return (
			<div style={{ padding: '0 2rem' }}>
				<Card
					style={{ width: '600px', margin: '0 auto 16px auto' }}
					bordered={false}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div style={{ flex: 1, borderRight: '1px solid #e8e8e8', paddingRight: '16px' }}>
							<h3 style={{ marginBottom: '8px' }}>{cardInfo.title || examData.score.title}</h3>
							<p style={{ margin: 0 }}><strong>班级名称：</strong>{cardInfo.class_name || examData.score.class_name || '未知班级'}</p>
							<p style={{ margin: 0 }}><strong>发布者：</strong>{cardInfo.creator_wx_name || examData.score.creator_name || '未知发布者'}</p>
						</div>
						<div style={{ paddingLeft: '16px' }}>
							<Button type="primary" onClick={this.handleExportExcel}>导出 Excel</Button>
						</div>
					</div>
				</Card>
				<Table
					columns={columns}
					dataSource={datas}
					pagination={{ pageSize: 100, hideOnSinglePage: true }}
					scroll={{ x: "80vw", y: "65vh" }}
					size="small"
					rowClassName={(record: DataType) => record.isAverage ? 'average' : ''}
				/>
				<Modal
					title={`历史记录 - ${modalStudentName}`}
					visible={modalVisible}
					onCancel={this.handleModalCancel}
					footer={null}
				>
					<List
						itemLayout="vertical"
						dataSource={modalHistory}
						renderItem={(item: HistoryItem) => (
							<List.Item key={item._id}>
								<List.Item.Meta
									title={<span>{item.time}</span>}
									description={
										<div>
											<p><strong>手机号：</strong>{item.phone}</p>
											<p><strong>OpenID：</strong>{item.openid}</p>
										</div>
									}
								/>
							</List.Item>
						)}
					/>
				</Modal>
			</div>
		);
	}
}

export default UserScores;
