import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchConciliadores = async () => {
  const response = await axios.get(`${API_URL}/conciliadores`);
  return response.data;
};

export const fetchMunicipios = async () => {
  const response = await axios.get(`${API_URL}/comarcas`);
  return response.data;
};

export const saveConciliador = async (conciliador) => {
  const response = await axios.post(`${API_URL}/conciliadores`, conciliador);
  return response.data;
};

export const deleteConciliadorService = async (id) => {
  const response = await axios.delete(`${API_URL}/conciliadores/${id}`);
  return response.data;
};
