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
            viewByDepartment()
            break;

        case "View Employees by Role":
            viewByRole()
            break;

        case "View Employees by Manager":
            viewByManager()
            break;

        case "Change an Employees Role":
            changeRole()
            break;

        case "Change an Employees Manager":
            changeManager()
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



async function viewByDepartment() {
    const departmentList = await mapping("department")

    let { departmentId } = await inquirer.prompt(
        {
            type: "list",
            message: "choose department",
            choices: departmentList,
            name: "departmentId"
        }
    )
    departmentId = JSON.parse(departmentId)

    let result = await connection.query(
        "SELECT DISTINCT employees.firstname, employees.lastname FROM ((department INNER JOIN role ON role.department_id = ?) INNER JOIN employees ON employees.role_id = role.id)",
        departmentId
    )

    console.table(result)
    initiate()
}

async function viewByRole() {
    const roleList = await mapping("role") 

    let { roleId } = await inquirer.prompt(
        {
            type: "list",
            message: "pick a role",
            choices: roleList,
            name: "roleId"
        }
    )
    roleId = JSON.parse(roleId)
    let response = await connection.query("SELECT firstname, lastname FROM employees WHERE role_id=?", roleId)

    let byRole = await response.map(name => {
        return { name: name.firstname + " " + name.lastname }
    })
    console.table(byRole)
    initiate()
}

async function viewByManager() {
    const managementList = await mapping("manager") 

    let { chosenManager } = await inquirer.prompt(
        {
            type: "list",
            message: "choose manager",
            choices: managementList,
            name: "chosenManager"
        }
    )
    JSON.parse(chosenManager)
    let response = await connection.query("SELECT * FROM employees WHERE employees.manager_id = ?", chosenManager)
    let byManager = await response.map(name => {
        return { name: name.firstname + " " + name.lastname }
    })
    console.table(byManager)
    initiate()
}

async function changeRole() {
    const roleList = await mapping("role") 
    const employeeList = await mapping("employees")

    const { chosenEmployee, newRole } = await inquirer.prompt(
        [
            {
                type: "list",
                message: "choose employee",
                choices: employeeList,
                name: "chosenEmployee"
            },
            {
                type: "list",
                message: "choose new role",
                choices: roleList,
                name: "newRole"
            }
        ])

    await connection.query("UPDATE employees SET ? WHERE ?", [{ role_id: newRole }, { id: chosenEmployee }])
    initiate()
}

async function changeManager() {
    const managementList = await mapping("manager") 
    const employeeList = await mapping("employees")

    const { chosenEmployee, newManager } = await inquirer.prompt(
        [
            {
                type: "list",
                message: "choose employee",
                choices: employeeList,
                name: "chosenEmployee"
            },
            {
                type: "list",
                message: "choose new manager",
                choices: managementList,
                name: "newManager"
            }
        ])
    await connection.query("UPDATE employees SET ? WHERE ?", [{ manager_id: newManager }, { id: chosenEmployee }])
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