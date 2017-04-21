import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users } from './data/user';
import { Employees, Projects, Steps, Tasks } from './data/project';
let _Users = Users;
let _Employees = Employees;
let _Projects = Projects;
let _Steps = Steps;
let _Tasks = Tasks;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //by shihaoran
      mock.onGet('/api/v1/employeeList').reply(config => {
          let employeeName="";
          if(config.params){
              if( "employeeName" in config.params){
                  let { employeeName } = config.params;
              }
          }
          let employees = _Employees.filter(employee => {
              if (employeeName && employee.name.indexOf(employeeName) == -1) return false;
              return true;
          });
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve([200, {
                      employees: employees,
                  }]);
              }, 1000);
          });
      });

      mock.onGet('/api/v1/projectList').reply(config => {
          let projectName="";
          if(config.params){
              if( "projectName" in config.params){
                  let { projectName } = config.params;
              }
          }
          else {
              let projectName="";
          }
          let projects = _Projects.filter(project => {
              if (projectName && project.name.indexOf(projectName) == -1) return false;
              return true;
          });
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve([200, {
                      projects: projects,
                  }]);
              }, 1000);
          });
      });

      mock.onGet('/api/v1/projectInfo').reply(config => {
          let { projectId } = config.params;
          let steps = _Steps.filter(step => {
              if (step.projectId == projectId ) return true;
              return false;
          });
          let stepIds=[];
          steps.forEach(s =>{
              stepIds.push(s.stepId);
          });
          let tasks = _Tasks.filter(task => {
              if (stepIds.indexOf(task.stepId) !== -1) return true;
              return false;
          });
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve([200, {
                      steps: steps,
                      tasks: tasks,
                  }]);
              }, 1000);
          });
      });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

  }
};