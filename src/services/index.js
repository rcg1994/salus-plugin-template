import API from './api';

const fetchCreate = window.salus.service.fetchCreate

// eslint-disable-next-line no-unused-vars
const postParams = {
  method: 'post'
};

export const fetchChargeInvoUpdate = fetchCreate(API.CHARGE_INVO_UPDATE, postParams);