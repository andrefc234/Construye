import { useEffect, useState ,ChangeEvent, useRef } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, IconButton, Button, Spinner } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon, DownloadIcon, UploadIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';

interface Requisition {
    _id: string;
    nombreObra:string;
    obraId: string;
    material: {
      Concepto: string;
      Unidad: string;
      Cantidad: number;
    }[];
    aceptado: boolean;
    fecha: string;
    pdf: {
      data: ArrayBuffer | null;
      contentType: string;
      fileName: string;
    };
    __v: number;
  }

// Component to display requisitions
const RequisitionTable = ({
    requisitions,
    onDelete,
    onUploadPDF,
    onDownloadPDF,
  }: {
    requisitions: Requisition[];
    onDelete: (id: string) => void;
    onUploadPDF: (id: string, file: File) => void;
    onDownloadPDF: (id: string, fileName: string) => void;
  }) => {
    // State to track sorting order
    const [sortedRequisitions, setSortedRequisitions] = useState<Requisition[]>(requisitions);
    const [sortAsc, setSortAsc] = useState(true);
  
    useEffect(() => {
      // Sort requisitions by date
      const sorted = [...requisitions].sort((a, b) => {
        const dateA = new Date(a.fecha).getTime();
        const dateB = new Date(b.fecha).getTime();
  
        return sortAsc ? dateB - dateA : dateA - dateB;
      });
  
      setSortedRequisitions(sorted);
    }, [requisitions, sortAsc]);
  
    // Function to toggle sorting order
    const toggleSortOrder = () => {
      setSortAsc((prevSortAsc) => !prevSortAsc);
    };
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    // Function to handle file selection
    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>, id: string) => {
      const file = event.target.files?.[0];
      if (file) {
        onUploadPDF(id, file);
      }
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    if (!sortedRequisitions.length) {
      return <Spinner />;
    }
  
    return (
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
            <Th>Obra</Th>
              <Th>Concepto</Th>
              <Th>Unidad</Th>
              <Th>Cantidad</Th>

              <Th>Aceptado</Th>
              <Th>
                Fecha
                <IconButton
                  aria-label={`Sort by date ${sortAsc ? 'ascending' : 'descending'}`}
                  icon={sortAsc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  ml={2}
                  onClick={toggleSortOrder}
                  size="sm"
                  variant="link"
                />
              </Th>
              <Th>Action</Th>
              <Th>Cotización</Th>
               
            </Tr>
          </Thead>
          <Tbody>
            {sortedRequisitions.map((requisition) => (
              <Tr key={requisition._id}>
                  <Td>{requisition.nombreObra}</Td>
                <Td>{requisition.material[0].Concepto}</Td>
                <Td>{requisition.material[0].Unidad}</Td>
                <Td>{requisition.material[0].Cantidad}</Td>
                <Td>{requisition.aceptado ? 'Aceptado' : 'No Aceptado'}</Td>
                <Td>{format(new Date(requisition.fecha), 'yyyy-MM-dd HH:mm')}</Td>
                <Td>
                  <IconButton
                    aria-label="Delete requisition"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => onDelete(requisition._id)}
                  />
                </Td>
                <Td>
                  {requisition.pdf ? (
                    <Button
                      size="sm"
                      leftIcon={<DownloadIcon />}
                      onClick={() => onDownloadPDF(requisition._id, requisition.pdf!.fileName)}
                    >
                      Download
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        leftIcon={<UploadIcon />}
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        Upload
                      </Button>
                      <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(event) => handleFileSelect(event, requisition._id)}
                      />
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
};
export default RequisitionTable;