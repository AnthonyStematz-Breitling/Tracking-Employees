//requires necissary npms
const inquirer = require("inquirer");
const consoleTable = require("console.table")
const util = require("util");
var mysql = require("mysql");

//connects to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "MyNewPass",
    database: "work_force_db"
});

//promisifies query off of connection
connection.query = util.promisify(connection.query)
connection.connect(function (err) {
    if (err) throw err;
    initiate()
});

async function initiate() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "adminFunctions",
            message: "What would you like to do?",
            choices: [
                "Create Employee",
                "Delete an Employee",
                "View All Employees",
                "Create Department",
                "Create Role",
                "View Employees by Department",
                "View Employees by Role",
                "View Employees by Manager",
                "Change an Employees Role",
                "Change an Employees Manager",
                "Done"
            ]
        }

    ])
    choice(answers.adminFunctions)
}

//takes users choice and runs appropriate funcitons
async function choice(data) {
    switch (data) {
        case "Create Employee":
            createEmployee()
            break;

        case "Create Role":
            createRole()
            break;

        case "Create Department":
            createDepartment()
            break;

        case "View All Employees":
            viewEmployees()
            break;

        case "View Employees by Department":
            viewBy("department")
            break;

        case "View Employees by Role":
            viewBy("role")
            break;

        case "View Employees by Manager":
            viewBy("manager")
            break;

        case "Change an Employees Role":
            updateEmployee("role")
            break;

        case "Change an Employees Manager":
           updateEmployee("manager")
            break;

        case "Delete an Employee":
            deleteEmployee()
            break;

        case "Done":
            connection.end()
            break;
    }
}
//function that creates a generalized selectAll that can be used in mulitple locations
async function selectAll(query) {
    if(query === "manager"){
        const data = await connection.query("SELECT * FROM  employees WHERE employees.role_id = 1")
        return data
    }
    else{
        const data = await connection.query("SELECT * FROM ??", query)
        return data
    }
}
//function that generilizes mapping and can be used in several places in the code
async function mapping(whatToMap) {
    const data = await selectAll(whatToMap)
    if (whatToMap === "department" || whatToMap === "role") {
        var whatHasBeenMaped = await data.map(item => {
            return { name: item.name, value: item.id }
        })
        return whatHasBeenMaped
    }
    else if (whatToMap === "employees" || whatToMap === "manager")
     var whatHasBeenMaped = await data.map(item => {
            return { name: item.firstname + " " + item.lastname, value: item.id }
        })
    return whatHasBeenMaped
}

async function createEmployee() {
    const roleList = await mapping("role") 
    const managerList = await mapping("manager") 

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt(
        [{
            type: "input",
            message: "First Name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "Last Name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is the employee's Role?",
            choices: roleList,
            name: "roleId"
        },
        {
            type: "list",
            message: "Who is thier manager?",
            choices: managerList,
            name: "managerId"
        }
        ])
    await connection.query("INSERT INTO employees SET ? ", {
        firstname: firstName, lastname: lastName, role_id: roleId, manager_id: managerId
    })
    initiate()
}

async function createDepartment() {
    const { departmentName } = await inquirer.prompt(
        {
            type: "input",
            message: "Name of the Deparment?",
            name: "departmentName"
        }
    )
    await connection.query("INSERT INTO department SET ? ", { name: departmentName })
    initiate()
}

async function createRole() {
    const departmentList = await mapping("department")

    const { roleTitle, roleSalary, departmentId } = await inquirer.prompt(
        [{
            type: "input",
            message: "Role Title?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the salary of this Role?",
            name: "roleSalary"
        },
        {
            type: "list",
            message: "choose a department",
            choices: departmentList,
            name: "departmentId"
        }
            //add some error handling to make sure salary input is a number
        ])
    await connection.query("INSERT INTO role SET ? ",
        { name: roleTitle, salary: roleSalary, department_id: departmentId })

    initiate()
}

async function viewEmployees() {
  const employeeRows = await selectAll("employees")
    console.table(employeeRows)
    initiate()
}

async function viewBy(choice){
    const list = await mapping(choice)
    let { referanceId } = await inquirer.prompt(
        {
            type: "list",
            message: "choose " + choice,
            choices: list,
            name: "referanceId"
        }
    )
    referanceId = JSON.parse(referanceId)
    let query;
    if(choice === "department"){
        query =  "SELECT DISTINCT employees.firstname, employees.lastname FROM ((department INNER JOIN role ON role.department_id = " + referanceId + ") INNER JOIN employees ON employees.role_id = role.id)"
    }
    else{
        query = "SELECT firstname, lastname FROM employees WHERE "  + choice + "_id=" + referanceId 
    }
    let response = await connection.query(query)
    console.table(response)
    initiate()
}

async function updateEmployee(choice){
    const choiceList = await mapping(choice)
    const employeeList = await mapping("employees")
    const { chosenEmployee, newReferanceId } = await inquirer.prompt(
        [
            {
                type: "list",
                message: "choose employee",
                choices: employeeList,
                name: "chosenEmployee"
            },
            {
                type: "list",
                message: "choose new " + choice,
                choices: choiceList,
                name: "newReferanceId"
            }
        ])
        let query = "UPDATE employees SET " + choice + "_id = " + newReferanceId + " WHERE id = " + chosenEmployee
        console.log(query)
        await connection.query(query)
        initiate()
}

async function deleteEmployee() {
    const employeeList = await mapping("employees")
    const { chosenEmployee } = await inquirer.prompt(
        {
            type: "list",
            message: "choose employee to delete",
            choices: employeeList,
            name: "chosenEmployee"
        }
    )
    await connection.query("DELETE FROM employees WHERE employees.id = ?", chosenEmployee)
    initiate()
}

//future development look into creating one or two class functions that could clean up the code

//CRUD
//Create is going to have a second inquirer prompt 
//and an INSERT mysql function

//(READ)View is going to have a second inquirer prompt
//and use that input to select certain parts of the table and then present those parts

//(UPDATE)Change is going to have a second inquirer prompt
//and find an employee by unique id and then change the chosen column as desired

//Delete is going to have a second inquirer prompt
//and use that input to select a row by unique id and then remove that row 