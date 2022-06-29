import React, { useState, useEffect } from 'react';
import { Box, Grid } from 'theme-ui';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductPage from './pages/ProductPage';
import HomePage from './pages/HomePage';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';

function App() {
  const [products, setProducts] = useState([]);
  const [shoppingCart, setShoppingCart] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addItemToCart = (itemId) => {
    setShoppingCart((cart) => {
      const newCart = { ...cart };
      if (newCart[itemId]) {
        newCart[itemId] += 1;
      } else {
        newCart[itemId] = 1;
      }
      return newCart;
    });
  };

  const removeItemFromCart = (itemId) => {
    setShoppingCart((cart) => {
      const newCart = { ...cart };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const resetShoppingCart = () => {
    setShoppingCart({});
  };

  useEffect(() => {
    console.log('useEffect: ');
    async function fetchData() {
      const result = await axios.get('http://localhost:3001/store');
      console.log('result: ', result);
      setProducts(result.data.products);
    }
    fetchData();
  }, []);

  return (
    <Grid sx={{
      gridTemplateAreas: "'sidebar content'",
      gridTemplateColumns: 'auto 1fr',
      gap: 0,
      overflow: 'hidden',
    }}
    >
      <Sidebar
        products={products}
        shoppingCart={shoppingCart}
        addItemToCart={addItemToCart}
        removeItemFromCart={removeItemFromCart}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        resetShoppingCart={resetShoppingCart}
      />
      <Box p={3} sx={{ overflow: 'auto' }}>
        <Routes>
          <Route
            path="product/:productId"
            element={(
              <ProductPage
                products={products}
                addItemToCart={addItemToCart}
                removeItemFromCart={removeItemFromCart}
                shoppingCart={shoppingCart}
              />
            )}
          />
          <Route
            path="order-history"
            element={(<OrderHistory />)}
          />
          <Route
            path="order-history/:orderId"
            element={(<OrderDetail />)}
          />
          <Route
            path="/"
            element={(
              <HomePage
                products={products}
                addItemToCart={addItemToCart}
                removeItemFromCart={removeItemFromCart}
                shoppingCart={shoppingCart}
                isSidebarOpen={isSidebarOpen}
              />
            )}
          />
        </Routes>
      </Box>
    </Grid>
  );
}

export default App;
