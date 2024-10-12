import axios from 'axios'

const uploadInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASEURL,
	headers: {
		"Content-Type": "multipart/form-data",
	},

});

const baseInstance = axios.create({
	baseURL: '/api/v1',
	headers: {
		"Content-Type": "application/json",
	},
	validateStatus: function (status) {
		return status >= 200 && status < 300;
	},

});


baseInstance.interceptors.request.use(
	(config) => {
		// if (companySession) {
		// 	config.headers.Authorization = "Bearer " + companySession?.tokens?.accessToken;
		// } else {
		// 	console.error('no session');
		// }
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export { baseInstance, uploadInstance };
