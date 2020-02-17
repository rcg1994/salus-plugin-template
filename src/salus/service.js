import { fetchCreate } from './libs/fetch'

let urlMap = {
  'development': 'https://dev.isalus.cn/his',
  'production': 'https://link.isalus.cn/his',
  'demo': 'https://demo.isalus.cn/his'
};

const diyUrl = localStorage.getItem('DIY_API');
const prefix = diyUrl || urlMap[process.env.NODE_ENV];

const service = {
  PREFIX: prefix,
  fetchCreate: fetchCreate
}

export default service
