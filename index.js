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
  connection.connect(function(err) {
    if (err) throw err;
    initiate() 
  });



async function initiate(){
const answers = await inquirer.prompt([
    {
        type:"list",
        name: "adminFunctions",
        message: "What would you like to do?",
        choices: [
             "Create Employee",
            //"Delete an Employee",
            "View All Employees",
            "Create Department",
            //"Delete a Department",
            "Create Role",
            //"Delete a role",
            "View Employees by Department", 
            "View Employees by Role", 
            "View Employees by Manager",
            "Change an Employees Role" ,
            "Change an Employees Manager",
            "Done" 
        ]
    }

])
choice(answers.adminFunctions)
}

//takes users choice and runs appropriate funcitons
async function choice(data){
    switch(data){
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

        case "Done":
            connection.end()
        break;
    }

}

async function createEmployee(){
    const roleRows = await connection.query("SELECT * FROM  role")

    const roleList = roleRows.map(role =>{ 
        return {name: role.title, value: role.id}
    })

    const managerRows = await connection.query("SELECT * FROM  employees WHERE role_id = 1")

    const managerList = managerRows.map(managers =>{ 
        return {name: managers.firstname + " " + managers.lastname, value: managers.id}
    })


    const {firstName, lastName, roleId, managerId} = await inquirer.prompt(
       [ { 
            type:"input",
            message:"First Name?",
            name:"firstName"
        },
        {
            type:"input",
            message: "Last Name?",
            name: "lastName"
        },
    {
       type:"list",
        message: "What is the employee's Role?",
        choices:roleList, 
        name: "roleId"
    },
    { 
        type:"list",
        message: "Who is thier manager?",
        choices: managerList,
        name: "managerId"
    }
])
   await connection.query("INSERT INTO employees SET ? ", {
       firstname: firstName, lastname:lastName, role_id:roleId, manager_id:managerId})
   initiate()
}

async function createDepartment(){
   const {departmentName} = await inquirer.prompt(
        {
            type: "input",
            message: "Name of the Deparment?",
            name:"departmentName"
        }
    )
    await connection.query("INSERT INTO department SET ? ", {name: departmentName})
    initiate()
}

async function createRole(){
    const departmentRows = await connection.query("SELECT * FROM  department")

    const departmentList = departmentRows.map(department =>{ 
        return {name: department.name, value: department.id}
    })

   const {roleTitle, roleSalary, departmentId} = await inquirer.prompt(
       [ {
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
    {title: roleTitle, salary: roleSalary, department_id: departmentId})
    
    initiate()
}

async function viewEmployees(){
    const employeeRows = await connection.query("SELECT * FROM  employees")
    console.table(employeeRows)
   initiate()

}

async function viewByDepartment(){
    const departmentRows = await connection.query("SELECT * FROM  department")

    const departmentList = departmentRows.map(department =>{ 
        return {name: department.name, value: department.id}
    })

    let {departmentId} = await inquirer.prompt(
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

async function viewByRole(){
    const roleRows = await connection.query("SELECT * FROM  role")

    const roleList = roleRows.map(role =>{ 
        return {name: role.title, value: role.id}
    })
   

    let {roleId} = await inquirer.prompt(
    {
            type: "list",
            message: "pick a role",
            choices: roleList,
            name:"roleId"
        }
    )
    roleId = JSON.parse(roleId)
    let response = await connection.query("SELECT firstname, lastname FROM employees WHERE role_id=?", roleId)
   
    let byRole = await response.map(name =>{ 
     return {name: name.firstname + " " + name.lastname}
    })
    console.table(byRole)
    initiate()
}

async function viewByManager(){
    const managementRows = await connection.query("SELECT * FROM  employees WHERE employees.role_id = 1")
   
    const managementList = managementRows.map(manager =>{ 
        return {name: manager.firstname + " " + manager.lastname, value: manager.id}
    })
    

    let {chosenManager} = await inquirer.prompt(
        {
            type: "list",
            message: "choose manager",
            choices:managementList,
            name: "chosenManager"
        }
    )
    JSON.parse(chosenManager)
    let response = await connection.query("SELECT * FROM employees WHERE employees.manager_id = ?", chosenManager )
    let byManager = await response.map(name =>{ 
        return {name: name.firstname + " " + name.lastname}
       })
       console.table(byManager)
       initiate()
}

async function changeRole(){
    const roleRows = await connection.query("SELECT * FROM  role")

    const roleList = roleRows.map(role =>{ 
        return {name: role.title, value: role.id}
    })
    
    const employeeRows = await connection.query("SELECT * FROM  employees")

    const employeeList = employeeRows.map(employees =>{ 
        return {name: employees.firstname + " " + employees.lastname, value: employees.id}
    })

    const {chosenEmployee, newRole} = await inquirer.prompt(
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

    await connection.query("UPDATE employees SET ? WHERE ?", [{role_id:newRole}, {id:chosenEmployee}])
    initiate()
}

async function changeManager(){
    const managementRows = await connection.query("SELECT * FROM  employees WHERE employees.role_id = 1")
   
    const managementList = managementRows.map(manager =>{ 
        return {name: manager.firstname + " " + manager.lastname, value: manager.id}
    })
    
    const employeeRows = await connection.query("SELECT * FROM  employees")

    const employeeList = employeeRows.map(employees =>{ 
        return {name: employees.firstname + " " + employees.lastname, value: employees.id}
    })

    const {chosenEmployee, newManager} = await inquirer.prompt(
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
    await connection.query("UPDATE employees SET ? WHERE ?", [{manager_id:newManager}, {id:chosenEmployee}])
    initiate()
}


//CRUD
//Create is going to have a second inquirer prompt 
//and an INSERT mysql function

//(READ)View is going to have a second inquirer prompt
//and use that input to select certain parts of the table and then present those parts

//(UPDATE)Change is going to have a second inquirer prompt
//and find an employee by unique id and then change the chosen column as desired

//Delete is going to have a second inquirer prompt
//and use that input to select a row by unique id and then remove that row 