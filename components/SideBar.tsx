import { Box, Button, Flex, Icon, Text, useColorModeValue, useBreakpointValue,Spinner, FlexProps, Drawer, DrawerContent,useDisclosure,Center, IconButton, CloseButton, BoxProps} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FcSupport, FcHome, FcList, FcCalendar, FcMoneyTransfer, } from 'react-icons/fc';
import { FaFacebookMessenger } from 'react-icons/fa';
import{FiMenu} from 'react-icons/fi'
import { MdChevronLeft, MdChevronRight, MdInsights } from 'react-icons/md';
import { IoMdConstruct } from 'react-icons/io';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import router, { useRouter } from 'next/router';
import LoadingPage from './Tools/LoadingPage'
interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Proyectos', icon: FcHome, link: '/projects' },
  { name: 'Materiales', icon: FcSupport, link: '/material' },
  { name: 'Pagos', icon: FcMoneyTransfer, link: '/payments' },
  { name: 'Requisiciones', icon: FcList, link: '/requisitions' },
 
 
];



interface SidebarProps {
  children: ReactNode;
}

export const SideBar = ({ children }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = async (link: string) => {
    setIsLoading(true);
    await router.push(link);
    setIsLoading(false);
  };
const bgcolor = useColorModeValue('black', 'gray.900')
const rightBorder = useColorModeValue('gray.200', 'gray.700')
  return (
    <Flex>
    
        <>
          <Box
            bg={bgcolor}
            borderRight="1px"
            borderRightColor={rightBorder}
            w={isCollapsed ? '80px' : '280px'}
            position="fixed"
            h="full"
            overflowY="auto"
            zIndex={999}
            transition="width 0.3s"
            css={{
              '&::-webkit-scrollbar': {
                width: '0.25em',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'gray.500',
                borderRadius: '0.25rem',
              },
            }}
          >
            <Button
              onClick={toggleSidebar}
              position="absolute"
              my={5}
              left={isCollapsed ? '20px' : '100px'}
              size="sm"
              variant="outline"
              colorScheme="teal"
            >
              <Icon as={isCollapsed ? MdChevronRight : MdChevronLeft} />
            </Button>
            <Box p="3">
              <SidebarContent
                onClose={onClose}
                isCollapsed={isCollapsed}
                isLoading={isLoading}
                onClick={handleClick}
              />
            </Box>
          </Box>
          <Box ml={{ base: 0, md: isCollapsed ? '100px' : '200px' }} p="6" w="100%" >
          {isLoading ? <><LoadingPage/></>:<>{children}</>}
          </Box>
        </>
      
    </Flex>
  );
};


interface SidebarContentProps {
  onClose: () => void;
  isCollapsed: boolean;
  isLoading: boolean;
  onClick: (link: string) => void;
}

const SidebarContent = ({ onClose, isCollapsed, isLoading, onClick, ...rest }:SidebarContentProps) => {
  const router = useRouter();
  return (
    <Box bg={useColorModeValue('black', 'gray.900')} h="full">
      <Flex h="20" alignItems="center" justifyContent="space-between">
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
         const isActive = router.pathname === link.link;
        return(
        <MenuItem
          key={link.name}
          name={link.name}
          icon={link.icon}
          link={link.link}
          isCollapsed={isCollapsed}
          isLoading={isLoading}
          onClick={onClick}
          isActive={isActive}
        />
      )})}
    </Box>
  );
};


interface MenuItemProps {
  name: string;
  icon: IconType;
  link: string;
  isCollapsed: boolean;
  isLoading: boolean;
  onClick: (link: string) => void;
  isActive:boolean;
}

const MenuItem = ({ name, icon, link, isCollapsed, isLoading, onClick,isActive }: MenuItemProps) => {
  const handleClick = () => {
    onClick(link);
  };
  const bg = isActive ? 'gray.700' : '';

  return (
    <Link href={link}>
      <Flex
        alignItems="center"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        borderRadius="lg"
        p="4"
        my={1}
        bg={bg}
        onClick={handleClick}
        transition="opacity 0.3s"
      >
        {isCollapsed && (
          <>
           
              <Icon fontSize="25" _groupHover={{ color: 'white' }} as={icon} />
         
          </>
        )}
        {!isCollapsed && (
          <>
            
              <>
                <Icon
                  mr="4"
                  fontSize="25"
                  _groupHover={{
                    color: 'white',
                  }}
                  as={icon}
                />
                <Text color={'whiteAlpha.900'} fontWeight="bold" my="auto">
                  {name}
                </Text>
              </>
           
          </>
        )}
      </Flex>
    </Link>
  );
};



interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};
export default SideBar;      