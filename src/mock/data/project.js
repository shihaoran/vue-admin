import Mock from 'mockjs';

const projectNum=50;
const employeeNum=100;

const Employees = [];

for (let i = 0; i < employeeNum; i++) {
    Employees.push(Mock.mock({
        employeeId: Mock.Random.guid(),
        name: Mock.Random.cname(),
        address: Mock.mock('@county(true)'),
        birth: Mock.Random.date(),
        sex: Mock.Random.integer(0, 1)
    }));
}

const Projects = [];

for (let i = 0; i < projectNum; i++) {
    Projects.push(Mock.mock({
        projectId: i,
        name: Mock.Random.cword(5, 7),
        endTime: Mock.Random.date(),
        status: Mock.Random.integer(0, 2),
        chargePeople: Mock.Random.cname(),
    }));
}

const Steps = [];

for (let i = 0; i < projectNum; i++) {
    let stepNum = Mock.Random.integer(3,6);
    for(let j = 0; j < stepNum; j++){
        Steps.push(Mock.mock({
            stepId: Mock.Random.increment(),
            projectId: i,
            stepIndex: j,
            stepName: Mock.Random.cword(2, 4)+"阶段",
        }));
    }
}

const Tasks = [];

let max=Mock.Random.increment();

for (let i = 0; i < max-1; i++) {
    let taskNum = Mock.Random.integer(3,6);
    for(let j = 0; j < taskNum; j++){
        Tasks.push(Mock.mock({
            taskId: Mock.Random.guid(),
            stepId: i,
            taskName: Mock.Random.cword(5, 7),
            taskActive: Mock.Random.boolean(),
            taskChargePeople: [ Mock.Random.cname() ],
            taskStartTime: Mock.Random.date(),
            taskEndTime: Mock.Random.date(),
            taskComment: Mock.Random.cparagraph( 2, 5 ),
            taskRate: Mock.Random.integer(0, 5),
        }));
    }
}


export { Employees, Projects, Steps , Tasks };
