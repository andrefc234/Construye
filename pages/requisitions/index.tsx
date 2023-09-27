import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, IconButton, Button, Spinner,useDisclosure  } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon,DownloadIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import FacturaModal from '@/components/Tools/FacturaModal'
// Define the Requisition type
interface Requisition {
  _id: string;
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
  nombreObra:string;
}

// Component to display requisitions
const RequisitionTable = ({
  requisitions,
  onDelete,
  onUploadPDF,
}: {
  requisitions: Requisition[];
  onDelete: (id: string) => void;
  onUploadPDF: (id: string, file: File) => void;
}) => {
  // In your component or a utility file
const downloadPDF = (data: ArrayBuffer | null, contentType: string, fileName: string) => {
  if (!data) {
    console.error('PDF data is not available.');
    return;
  }

  // Create a Blob from the PDF data
  const blob = new Blob([new Uint8Array(data)], {
    type: contentType || 'application/pdf',
  });

  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create an <a> element to trigger the download
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName || 'document.pdf';

  // Append the <a> element to the DOM and trigger the download
  document.body.appendChild(a);
  a.click();

  // Revoke the Blob URL to release resources
  window.URL.revokeObjectURL(url);
};

  // State to track sorting order
  const [sortedRequisitions, setSortedRequisitions] = useState<Requisition[]>(requisitions);
  const [sortAsc, setSortAsc] = useState(true);
console.log(requisitions)
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

  // File input ref to trigger file selection
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
          <Th>Nombre Obra</Th>
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
            <Th>Cotizacion</Th>
            <Th> Forma Pago</Th>
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
          {requisition.pdf ?<>   <Td>
                  <Button
                    size="sm"
                    leftIcon={<DownloadIcon />} // Use the DownloadIcon
                    onClick={() =>
                      downloadPDF(
                        requisition.pdf.data,
                        requisition.pdf.contentType,
                        requisition.pdf.fileName
                      )
                    }
                  >
                    Download PDF
                  </Button>
                </Td></> :    <Td>
                <Button
                  size="sm"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  Upload PDF
                </Button>
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(event) => handleFileSelect(event, requisition._id)}
                />
              </Td> }
              <Td><Button onClick={onOpen}>
                Crear Pago
                </Button></Td>
                <FacturaModal isOpen={isOpen} onClose={onClose}  materialCantidad={requisition.material[0].Cantidad} materialConcepto={requisition.material[0].Concepto} materialPartida={"test"}/>
            </Tr>
            
          ))}
        </Tbody>
      </Table>
     
    </Box>
  );
};

const Index = () => {
  // ...
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch requisitions from your API
    fetch('https://backendunique.onrender.com/api/v1/requisicion')
      .then((response) => response.json())
      .then((data) => {
        setRequisitions(data.data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Function to delete a requisition by ID
  const deleteRequisition = (id: string) => {
    // Send a DELETE request to the API to delete the requisition
    fetch(`https://backendunique.onrender.com/api/v1/requisicion/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 200) {
          // Remove the deleted requisition from the state
          setRequisitions((prevRequisitions) =>
            prevRequisitions.filter((requisition) => requisition._id !== id)
          );
        } else {
          console.error('Error deleting requisition');
        }
      })
      .catch((error) => console.error('Error deleting requisition:', error));
  };
  // Function to upload a PDF for a requisition by ID
  const uploadPDF = (id: string, file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);

    // Send a POST request to the API to upload the PDF
    fetch(`https://backendunique.onrender.com/api/v1/requisicion/upload/${id}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          // Reload requisitions to update the PDF data
          console.log(0)
        } else {
          console.error('Error uploading PDF');
        }
      })
      .catch((error) => console.error('Error uploading PDF:', error));
  };

  return (
    <div>
      <h1>Requisiciones</h1>
      {loading ? (
        <Spinner />
      ) : (
        <RequisitionTable requisitions={requisitions} onDelete={deleteRequisition} onUploadPDF={uploadPDF} />
      )}
    </div>
  );
};

export default Index;
