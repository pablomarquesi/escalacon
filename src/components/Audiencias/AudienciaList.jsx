import React, { useState, useEffect } from 'react';
import { Collapse, List, Tooltip, Button, Calendar, Modal, Space } from 'antd';
import { CalendarOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import HeaderSection from '../common/HeaderSection';

const { Panel } = Collapse;

const AudienciaList = () => {
  const [audiencias, setAudiencias] = useState([]);
  const [juizados, setJuizados] = useState({});
  const [selectedSala, setSelectedSala] = useState('');
  const [selectedJuizado, setSelectedJuizado] = useState('');  // Novo estado para o nome do juizado
  const [selectedDates, setSelectedDates] = useState({});
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [salas, setSalas] = useState([]);
  const [currentSalaIndex, setCurrentSalaIndex] = useState(0);

  useEffect(() => {
    const fetchAudiencias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/audiencias');
        setAudiencias(response.data);
        organizeByJuizado(response.data);
      } catch (error) {
        console.error('Erro ao buscar audiências:', error);
      }
    };

    fetchAudiencias();
  }, []);

  const organizeByJuizado = (data) => {
    const grouped = data.reduce((acc, audiencia) => {
      const juizado = audiencia.nome_juizado;
      const sala = audiencia.nome_sala_virtual;
      const dataAudiencia = audiencia.data_audiencia.split('T')[0];

      if (!acc[juizado]) {
        acc[juizado] = {};
      }
      if (!acc[juizado][sala]) {
        acc[juizado][sala] = [];
      }
      acc[juizado][sala].push({ ...audiencia, dataAudiencia });
      return acc;
    }, {});
    setJuizados(grouped);
  };

  const showCalendarModal = (sala, audiencias, salaList, juizado) => {
    const datesMap = audiencias.reduce((acc, audiencia) => {
      const date = audiencia.data_audiencia.split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += 1;
      return acc;
    }, {});

    setSelectedSala(sala);
    setSelectedJuizado(juizado);  // Define o nome do juizado selecionado
    setSelectedDates(datesMap);
    setSalas(salaList);
    setCurrentSalaIndex(salaList.findIndex((item) => item[0] === sala));
    setCalendarModalVisible(true);
  };

  const handleCalendarModalCancel = () => {
    setCalendarModalVisible(false);
  };

  const dateCellRender = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const count = selectedDates[formattedDate];

    if (count) {
      return (
        <div style={{ textAlign: 'center', backgroundColor: '#1890ff', color: '#fff', borderRadius: '5px', padding: '2px 6px', fontSize: '12px', lineHeight: '1.2' }}>
          {count} audiências
        </div>
      );
    }
    return null;
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredJuizados = Object.keys(juizados).reduce((acc, juizado) => {
    const filteredSalas = Object.entries(juizados[juizado]).filter(([sala]) =>
      sala.toLowerCase().includes(searchText)
    );

    if (filteredSalas.length > 0) {
      acc[juizado] = Object.fromEntries(filteredSalas);
    }

    return acc;
  }, {});

  const handlePrevious = () => {
    const newIndex = currentSalaIndex > 0 ? currentSalaIndex - 1 : salas.length - 1;
    const [newSala, newAudiencias] = salas[newIndex];
    showCalendarModal(newSala, newAudiencias, salas, selectedJuizado);
  };

  const handleNext = () => {
    const newIndex = currentSalaIndex < salas.length - 1 ? currentSalaIndex + 1 : 0;
    const [newSala, newAudiencias] = salas[newIndex];
    showCalendarModal(newSala, newAudiencias, salas, selectedJuizado);
  };

  return (
    <div>
      <HeaderSection
        title="Lista de Audiências"
        onSearch={handleSearch}
        searchText={searchText}
      />
      <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <Collapse accordion>
          {Object.entries(filteredJuizados).map(([juizado, salas]) => (
            <Panel header={`${juizado}`} key={juizado}>
              <List
                itemLayout="horizontal"
                dataSource={Object.entries(salas)}
                renderItem={([sala, audiencias]) => (
                  <List.Item
                    actions={[
                      <Tooltip title="Ver Calendário">
                        <Button
                          type="link"
                          icon={<CalendarOutlined />}
                          onClick={() => showCalendarModal(sala, audiencias, Object.entries(salas), juizado)}  // Passa o nome do juizado
                        />
                      </Tooltip>
                    ]}
                  >
                    <List.Item.Meta
                      title={`${sala}`}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          ))}
        </Collapse>
      </div>
      <Modal
        title={`Calendário de Audiências - ${selectedJuizado} `}  // Título modificado
        visible={calendarModalVisible}
        onCancel={handleCalendarModalCancel}
        footer={null}
        centered
        bodyStyle={{ padding: 0 }}
        width={800}
      >
        <div style={{ padding: '16px' }}>
          <Space style={{ marginBottom: '16px' }}>
            <Button icon={<LeftOutlined />} onClick={handlePrevious} />
            <span>{selectedSala}</span>
            <Button icon={<RightOutlined />} onClick={handleNext} />
          </Space>
          <Calendar 
            dateCellRender={dateCellRender} 
            fullscreen={false} 
            style={{ width: '100%', height: '100%', fontSize: '14px' }} 
            className="custom-calendar"
          />
        </div>
      </Modal>
    </div>
  );
};

export default AudienciaList;
