import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchConciliadores = async () => {
  const response = await axios.get(`${API_URL}/conciliadores`);
  console.log('fetchConciliadores response:', response.data);
  return response.data;
};

export const fetchMunicipios = async () => {
  const response = await axios.get(`${API_URL}/comarcas`);
  console.log('fetchMunicipios response:', response.data);
  return response.data;
};

export const saveConciliador = async (conciliador) => {
  console.log('Dados enviados para salvar:', conciliador);
  if (conciliador.conciliador_id) {
    const response = await axios.put(`${API_URL}/conciliadores/${conciliador.conciliador_id}`, conciliador);
    console.log('saveConciliador PUT response:', response.data);
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/conciliadores`, conciliador);
    console.log('saveConciliador POST response:', response.data);
    return response.data;
  }
};

export const deleteConciliadorService = async (id) => {
  const response = await axios.delete(`${API_URL}/conciliadores/${id}`);
  console.log('deleteConciliadorService response:', response.data);
  return response.data;
};
