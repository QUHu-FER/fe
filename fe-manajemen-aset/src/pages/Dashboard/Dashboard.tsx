import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AssetCard from '../../components/AssetCard';
import { Box, CircularProgress, Typography, Pagination, IconButton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Product {
  name: string;
  id_product: string;
  stock: number;
  image: string;
  added_by: string;
}

// Komponen untuk halaman Peminjaman
const PeminjamanPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const itemsPerPage = 12; // 4x3 grid

  // Listen for search events from Header
  useEffect(() => {
    const handleSearch = (event: CustomEvent<string>) => {
      setSearchValue(event.detail);
    };

    window.addEventListener('searchChange', handleSearch as EventListener);
    return () => {
      window.removeEventListener('searchChange', handleSearch as EventListener);
    };
  }, []);

  const fetchUserRole = async () => {
    const token = sessionStorage.getItem('token');
    const savedRole = sessionStorage.getItem('userRole');
    
    if (!token) return;

    try {
      const response = await fetch('https://manpro-mansetdig.vercel.app/user/get_account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const role = data.role || savedRole || 'user';
        sessionStorage.setItem('userRole', role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const role = sessionStorage.getItem('userRole') || 'user';
      const response = await fetch(`https://manpro-mansetdig.vercel.app/product/list?index=0&role=${role}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        
        if (response.status === 401) {
          sessionStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Sesi anda telah berakhir. Silakan login kembali.');
        }
        
        throw new Error(errorData.message || 'Gagal mengambil data produk');
      }

      const data = await response.json();
      console.log('Product data:', data);
      
      if (data && data.product_list) {
        let filteredProducts = data.product_list;
        
        if (role === 'user') {
          filteredProducts = data.product_list.filter((product: Product) => product.stock > 0);
        }
        
        setProducts(filteredProducts);
      } else {
        throw new Error('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole().then(() => fetchProducts());
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        color: 'error.main'
      }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      width: '100%',
      maxWidth: '1400px',
      mx: 'auto',
      position: 'relative'
    }}>
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Typography 
          sx={{ 
            color: '#fff',
            fontSize: '1.2rem',
            textAlign: 'center',
            mt: 4 
          }}
        >
          Tidak ada produk yang sesuai dengan pencarian "{searchValue}"
        </Typography>
      ) : (
        <>
          <Box sx={{ 
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'repeat(4, 1fr)',
            width: '100%',
            mb: filteredProducts.length > itemsPerPage ? 8 : 0
          }}>
            {currentProducts.map((product) => (
              <Box key={product.id_product}>
                <AssetCard 
                  id={product.id_product}
                  nama={product.name}
                  stok={product.stock}
                  gambar={product.image}
                />
              </Box>
            ))}
          </Box>
          
          {filteredProducts.length > itemsPerPage && (
            <Box sx={{
              position: 'fixed',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000
            }}>
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{
                  bgcolor: 'white',
                  borderRadius: '50px',
                  padding: '8px 16px',
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <IconButton 
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  size="small"
                  sx={{ 
                    color: page === 1 ? 'rgba(0, 0, 0, 0.26)' : '#4E71FF',
                    '&:hover': {
                      bgcolor: 'rgba(78, 113, 255, 0.04)'
                    }
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>

                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  siblingCount={1}
                  boundaryCount={1}
                  hideNextButton
                  hidePrevButton
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      margin: '0 4px',
                      minWidth: '32px',
                      height: '32px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      color: '#4E71FF',
                      '&.Mui-selected': {
                        bgcolor: '#4E71FF',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#3a57d5'
                        }
                      },
                      '&:hover': {
                        bgcolor: 'rgba(78, 113, 255, 0.04)'
                      }
                    }
                  }}
                />

                <IconButton 
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  size="small"
                  sx={{ 
                    color: page === totalPages ? 'rgba(0, 0, 0, 0.26)' : '#4E71FF',
                    '&:hover': {
                      bgcolor: 'rgba(78, 113, 255, 0.04)'
                    }
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = sessionStorage.getItem('token');
      const savedRole = sessionStorage.getItem('userRole');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://manpro-mansetdig.vercel.app/user/get_account', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const role = data.role || savedRole || 'user';
          setUserRole(role);
          sessionStorage.setItem('userRole', role);
        } else {
          setUserRole(savedRole || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(savedRole || 'user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      navigate('peminjaman');
    }
  }, [location.pathname, navigate]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#8bb6e6',
        width: '100vw'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100vw',
      bgcolor: '#8bb6e6',
      overflow: 'hidden'
    }}>
      <Sidebar userRole={userRole} />
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        ml: { xs: 0, md: '280px' },
        width: { xs: '100%', md: 'calc(100% - 280px)' },
        transition: 'all 0.3s ease',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <Header 
          onAssetAdded={() => {
            const peminjamanPage = document.querySelector('[data-testid="peminjaman-page"]');
            if (peminjamanPage) {
              window.dispatchEvent(new CustomEvent('refreshAssets'));
            }
          }}
        />
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          bgcolor: '#8bb6e6',
          display: 'flex',
          justifyContent: 'center',
          pt: 2,
          pb: 4,
          px: 3,
          '& > *': {
            width: '100%',
            maxWidth: '1400px'
          }
        }}>
          <Routes>
            <Route index element={<Navigate to="peminjaman" replace />} />
            <Route path="peminjaman" element={<PeminjamanPage />} />
            <Route path="pengembalian" element={<div>Halaman Pengembalian</div>} />
            <Route path="buat-akun" element={<div>Halaman Buat Akun</div>} />
            <Route path="terima-aset" element={<div>Halaman Terima Aset</div>} />
            <Route path="persetujuan" element={<div>Halaman Persetujuan</div>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 