import React, { useState } from 'react';
import {
  Box, Button, Flex, Grid, Input, Label, Text,
} from 'theme-ui';
import {
  MdArrowBack, MdArrowForward, MdShoppingCart, MdCheck, MdCancel,
} from 'react-icons/md';
import axios from 'axios';
import { findProductById } from '../utils';

function CartItem({
  count, product, addItemToCart, removeItemFromCart,
}) {
  const addToCart = () => addItemToCart(product.id);
  const removeFromCart = () => removeItemFromCart(product.id);
  const totalCost = (count * product.price).toFixed(2);

  return (
    <Grid sx={{
      gridTemplateColumns: '1fr auto auto auto auto',
      gap: 2,
      mb: 2,
      alignItems: 'center',
    }}
    >
      <Text
        sx={{
          fontSize: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
      >
        {product.name}
      </Text>
      <Text sx={{ fontSize: 0 }}>{`x ${count}`}</Text>
      <Text variant="price">{`($${totalCost})`}</Text>
      <Button variant="small" onClick={addToCart}>Add</Button>
      <Button variant="smallSecondary" onClick={removeFromCart}>Remove</Button>
    </Grid>
  );
}

export default function Sidebar({
  products, shoppingCart, addItemToCart, removeItemFromCart,
  isSidebarOpen, setIsSidebarOpen, resetShoppingCart,
}) {
  const [userInfo, setUserInfo] = useState({ name: 'A. Customer', email: 'customer-email@gmail.com' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const totalItemsInCart = Object.values(shoppingCart).reduce((prev, item) => prev + item, 0);
  const hasItemsInCart = !!totalItemsInCart;

  const totalCost = Object.entries(shoppingCart).reduce((prev, item) => {
    const foundProduct = findProductById(products, item[0]);
    const priceOfItem = foundProduct.price * item[1];
    return prev + priceOfItem;
  }, 0);

  const ArrowIcon = isSidebarOpen ? MdArrowBack : MdArrowForward;

  function handleToggle() {
    setIsSidebarOpen((currentState) => !currentState);
  }

  const handleReset = () => {
    resetShoppingCart();
    setPaymentSuccess(false);
  };

  const submitForm = async () => {
    const result = await axios.post('http://localhost:3001/store', { userInfo, cart: shoppingCart });
    if (result.status) {
      setPaymentSuccess(true);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        transition: 'width 0.3s ease',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        width: isSidebarOpen ? 360 : 52,
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'auto',
      }}
    >
      <ArrowIcon color="white" size={20} onClick={() => handleToggle()} />
      <Box sx={{ position: 'relative', mt: 3, width: 16 }}>
        <MdShoppingCart />
        {hasItemsInCart && (
          <Grid sx={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            backgroundColor: 'yellow',
            borderRadius: 10,
            color: '#333',
            fontSize: '10px',
            lineHeight: '12px',
            minWidth: 14,
            fontWeight: 'bold',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1px',
          }}
          >
            {`${totalItemsInCart}`}
          </Grid>
        )}
      </Box>
      {isSidebarOpen && (
        <>
          <Box sx={{
            mt: 4,
            width: '100%',
          }}
          >
            {Object.entries(shoppingCart).map((item) => (
              <CartItem
                key={item[0]}
                count={item[1]}
                product={findProductById(products, item[0])}
                addItemToCart={addItemToCart}
                removeItemFromCart={removeItemFromCart}
              />
            ))}
          </Box>
          <Flex sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
          >
            <Text sx={{ fontSize: 2 }}>Total</Text>
            <Text variant="price" sx={{ fontSize: 2 }}>{`$${totalCost.toFixed(2)}`}</Text>
          </Flex>
        </>
      )}
      {isSidebarOpen && hasItemsInCart && !paymentSuccess && (
        <Box sx={{ width: '100%' }}>
          <Text as="h2" variant="link" mb={3}>Payment Info</Text>
          <Box mb={3}>
            <Label htmlFor="name" mb={2}>Name</Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(event) => setUserInfo((info) => ({
                ...info,
                name: event.target.value,
              }))}
            />
          </Box>
          <Box mb={3}>
            <Label htmlFor="email" mb={2}>Email</Label>
            <Input
              id="email"
              value={userInfo.email}
              onChange={(event) => setUserInfo((info) => ({
                ...info,
                email: event.target.value,
              }))}
            />
          </Box>
          <Button onClick={submitForm} mr={3}>Submit</Button>
          <Button onClick={handleReset} variant="secondary">Clear</Button>
        </Box>
      )}
      {paymentSuccess && (
        <>
          <Grid sx={{
            gridTemplateColumns: '1fr auto', gap: 2, alignItems: 'center', mb: 3,
          }}
          >
            <MdCheck color="green" size={24} />
            <Text sx={{ color: 'green' }}>Payment was successful</Text>
          </Grid>
          <Button onClick={handleReset} variant="secondary">Clear</Button>
        </>
      )}
      {hasItemsInCart && (
        <Flex
          sx={{
            mt: 4, cursor: 'pointer',
          }}
          onClick={handleReset}
          title="Reset shopping cart"
        >
          <MdCancel size={22} />
        </Flex>
      )}
    </Box>
  );
}
