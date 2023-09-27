import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
interface Obra {
  _id: string;
  obra: string;
  direccion: string;
  contactoF: string;
  nombreCliente: string;
  rfc: string;
  curp: string;
  direccionC: string;
  telefono: string;
  materialesPendientes: {
    _id: string;
    Concepto: string;
    Cantidad: string;
  }[];
}

const MaterialesPendientes: React.FC = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get('https://backendunique.onrender.com/api/v1/obra')
      .then((response) => {
        setObras(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Materiales Pendientes por Obra
      </Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Obra</Th>
              
              <Th>Material Pendiente</Th>
            </Tr>
          </Thead>
          <Tbody>
            {obras.map((obra) => (
              <Tr key={obra._id}>
               
                <Td> <Link href={`/material/${obra._id}`}>{obra.obra}</Link></Td>
                
                <Td>
                  {obra.materialesPendientes.length > 0 ? (
                    <ul>
                      {obra.materialesPendientes.map((material) => (
                        <li key={material._id}>
                          <Text>{material.Concepto}</Text>
                          <Text>Cantidad: {material.Cantidad}</Text>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Text>No hay materiales pendientes</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default MaterialesPendientes;
