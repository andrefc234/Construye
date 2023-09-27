import { Key, useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface Requisition {
  _id: Key | null | undefined;
  material: {
    Concepto: any;
    Unidad: any;
    Cantidad: any;
  }[];
  aceptado: any;
  fecha: string | number | Date;
}

interface RequisitionTableProps {
  requisitions: Requisition[];
}

const RequisitionTable: React.FC<RequisitionTableProps> = ({ requisitions }) => {
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Concepto</Th>
            <Th>Unidad</Th>
            <Th>Cantidad</Th>
            <Th>Aceptado</Th>
            <Th>Fecha</Th>
          </Tr>
        </Thead>
        <Tbody>
          {requisitions.map((requisition) => (
            <Tr key={requisition._id}>
              <Td>{requisition.material[0].Concepto}</Td>
              <Td>{requisition.material[0].Unidad}</Td>
              <Td>{requisition.material[0].Cantidad}</Td>
              <Td>{requisition.aceptado ? 'Aceptado' : 'No Aceptado'}</Td>
              <Td>{new Date(requisition.fecha).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const DynamicRoutePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string }; // This is the obraId from req.query
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [filteredRequisitions, setFilteredRequisitions] = useState<Requisition[]>([]);

  useEffect(() => {
    if (id) {
      // Fetch all requisitions
      fetch('https://backendunique.onrender.com/api/v1/requisicion')
        .then((response) => response.json())
        .then((data) => {
          setRequisitions(data.data);
          // Filter requisitions based on obraId
          const filtered = data.data.filter((req) => req.obraId === id);
          setFilteredRequisitions(filtered);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [id]);

  return (
    <div>
      <h1>Requisciones</h1>
      <RequisitionTable requisitions={filteredRequisitions} />
    </div>
  );
};

export default DynamicRoutePage;
