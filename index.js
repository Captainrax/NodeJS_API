import { checkIn, checkOut, login, createEmployee, getEmployeeById, getAllEmployeesWithCheckInOut, getLatestCheckIn } from "./sqlhelper.js";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000

app.options('*', cors()) // include before other routes
app.use(cors())

app.use(express.json());

app.all('*',function (_,res,next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.post("/createEmployee", (req, res) => {
	const employee = req.body.employee;

	createEmployee(employee.employeeCode, employee.name, function(callback) {
		if(callback !== null) {
			return res.json({ callback: callback })
		} else {
			return res.status(400).send({
				message: "Error"
			});
		} 
	})
})

app.post("/checkin", (req, res) => {
	const employee = req.body.employee;
	checkIn(employee.employeeID, employee.check_in_time, function(callback) {
		if(callback !== null) {
			return res.json({ checkedIn: 1, tableID: callback })
		} else {
			return res.status(400).send({
				message: "Error"
			});
		} 
	})
})

app.post("/checkout", (req, res) => {
	const employee = req.body.employee;
	checkOut(employee.employeeID, employee.tableID, employee.check_out_time, function(callback) {
		if(callback !== null) {
			return res.json(callback)
		} else {
			return res.status(400).send({
				message: "Error"
			});
		}
	})
})

app.post("/employee", (req, res) => {
	const employee = req.body.employee;
	getEmployeeById(employee.employeeID, function(_, employee) {
		if( employee !== null ) {
			return res.json(employee)
		} else {
			return res.status(400).send({
				message: "Error"
			})
		}
	})
})

app.post("/login", (req, res) => {
	const employee = req.body.employee;
	login(employee.employeeCode, function(employeeID) {
		if( employeeID !== null ) {
			return res.json({ employeeID: employeeID })
		} else {
			return res.status(400).send({
				message: "Error"
			})
		}
	})
})

app.get("/getAllEmployees", (_, res) => {
	getAllEmployeesWithCheckInOut(function(employees) {
		if( employees !== null ) {
			return res.json(employees)
		} else {
			return res.status(400).send({
				message: "Error"
			})
		}
	})
})

app.post("/getLatestCheckIn", (req, res) => {
	const employee = req.body.employee;
	getLatestCheckIn(employee.employeeID, function(tableID) {
		if( tableID !== null ) {
			return res.json({ tableID: tableID })
		} else {
			return res.status(400).send({
				message: "Error"
			})
		}
	})
})

app.listen(port, () => {
	console.log("server started on port "+port);
})