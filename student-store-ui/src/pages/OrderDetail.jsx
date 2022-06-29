import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Grid, Text } from 'theme-ui';

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(`http://localhost:3001/store/orders/${orderId}`);
      setOrder(result.data.order);
    }
    fetchData();
  }, [orderId]);

  return (
    <>
      <Grid sx={{ gridTemplateColumns: 'auto auto auto 1fr', mb: 4, gap: 2 }}>
        <Link to="/" style={{ color: 'royalblue' }}>
          <Text as="h1" variant="link" color="primary">Store</Text>
        </Link>
        <Text as="h1" variant="link">/</Text>
        <Link to="/order-history" style={{ color: 'royalblue' }}>
          <Text as="h1" variant="link" color="primary">Order History</Text>
        </Link>
        <Text as="h1" variant="link">{`/ ${order.id}`}</Text>
      </Grid>
      <Grid sx={{ gap: 2 }}>
        <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Order ID</Text>
        <Text variant="table">{`${order.id?.substr(0, 8)}`}</Text>
        <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Name</Text>
        <Text variant="table">{`${order.name}`}</Text>
        <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Email</Text>
        <Text variant="table">{`${order.email}`}</Text>
        <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Price w/tax</Text>
        <Text variant="price">{`$${order.total?.toFixed(2)}`}</Text>
        <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Receipt</Text>
        {
          // eslint-disable-next-line react/no-array-index-key
          order.receipt?.lines.map((line, index) => <Text key={index} variant="table" sx={{ fontSize: '11px', lineHeight: 1 }}>{line}</Text>)
        }
      </Grid>
    </>
  );
}
