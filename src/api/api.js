import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const getEmployeeList = params => { return axios.get(`${base}/api/v1/employeeList`, { params: params }); };

export const getProjectList = params => { return axios.get(`${base}/api/v1/projectList`, { params: params }); };

export const getProjectListPage = params => { return axios.get(`${base}/api/v1/projectListByPage`, { params: params }); };

export const getProjectInfo = params => { return axios.get(`${base}/api/v1/projectInfo`, { params: params }); };

