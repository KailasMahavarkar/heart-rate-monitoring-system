import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Swal from "sweetalert2";

function HeartRateData() {
	const [heartRateData, setHeartRateData] = useState([]);
	const [username, setUsername] = useState("");
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		fetchHeartRateData();
	}, []);

	const fetchHeartRateData = async (showPopup = false) => {
		try {
			setIsFetching(true);
			const { data } = await axios.get("http://localhost:5000/all");
			setHeartRateData(
				Object.entries(data).map(([user, data]) => {
					const singleUserData = [];
					const average =
						data.reduce((acc, [heartRate]) => acc + heartRate, 0) / data.length;

					for (let i = 0; i < data.length; i++) {
						let heartRate = data[i][0];
						let time = data[i][1];

						if (heartRate === "{device_pinValue}") {
							singleUserData.push({
								user,
								heartRate: 0,
								average: 0,
								time,
							});
						} else {
							singleUserData.push({
								user,
								heartRate,
								average,
								time,
							});
						}
					}

					return singleUserData;
				})
			);
			setIsFetching(false);

			showPopup &&
				Swal.fire({
					title: "Success!",
					text: "Heart rate data has been fetched!",
					showConfirmButton: false,
					position: "top-right",
					timer: 1000,
				});
		} catch (error) {
			console.error("Error fetching heart rate data:", error);
		}
	};

	const usernameSubmitHandler = async (e) => {
		const user = e.target[0].value;
		try {
			await axios.get(`http://localhost:5000/username?user=${user}`, {
				username: e.target[0].value,
			});
			Swal.fire({
				title: "Success!",
				text: `Username has been set to ${user}!`,
				showConfirmButton: false,
				position: "top-right",
				timer: 1000,
			});
		} catch (error) {
			console.error("Error setting user:", error);
			Swal.fire({
				title: "Error!",
				text: "Error setting username",
				showConfirmButton: false,
				icon: "error",
				timer: 1000,
			});
		}
	};

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					usernameSubmitHandler(e);
				}}
			>
				<h2>Set Username</h2>
				<input
					type="text"
					onChange={(e) => {
						setUsername(e.target.value);
					}}
					value={username}
				/>

				<div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    gap: "1rem",
                    
                }}>
					<button
						style={{
							backgroundColor: "peachpuff",
							color: "black",
						}}
						type="submit"
					>
						Submit
					</button>
					<button
						style={{
							backgroundColor: "pink",
							color: "black",
						}}
						onClick={() => fetchHeartRateData(true)}
					>
						{isFetching ? "Fetching..." : "Fetch Heart Rate Data"}
					</button>
				</div>
			</form>

			<div className="divider"></div>

			<h2>Heart Rate Data</h2>
			<ul>
				<table className="styled-table">
					<thead>
						<tr>
							<th>User</th>
							<th>Last 60 heart-beats</th>
							<th>Average</th>
						</tr>
					</thead>

					<tbody>
						{/* it should in format of  */}
						{/* user | hearbeart (60 in single row) | average */}
						{heartRateData.map((data, index) =>
							data[0].user === "" ? (
								<tr key={index}></tr>
							) : (
								<tr key={index}>
									<td>{data[0].user}</td>
									<td>
										{data.map(({ heartRate }) => (
											<span key={heartRate}>{heartRate} </span>
										))}
									</td>
									<td>{data[0].average}</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</ul>
		</div>
	);
}

function App() {
	return (
		<>
			<div className="card">
				<HeartRateData />
			</div>
		</>
	);
}

export default App;
