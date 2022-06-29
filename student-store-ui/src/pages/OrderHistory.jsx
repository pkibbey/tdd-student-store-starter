import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Grid, Input, Label, Text,
} from 'theme-ui';

function TableHeadings() {
  return (
    <Grid sx={{ gridTemplateColumns: '1fr 1fr 3fr 100px', alignItems: 'flex-end' }}>
      <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Order</Text>
      <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Name</Text>
      <Text variant="table" sx={{ fontSize: 2, fontWeight: 'bold' }}>Email</Text>
      <Text variant="price" sx={{ fontSize: 2 }}>Price w/tax</Text>
    </Grid>
  );
}

function Order({ order }) {
  return (
    <Grid sx={{ gridTemplateColumns: '1fr 1fr 3fr  100px', alignItems: 'center' }}>
      <Link to={`/order-history/${order.id}`} style={{ color: 'royalblue' }}>
        <Text variant="table" sx={{ color: 'primary' }}>{`${order.id?.substr(0, 8)}`}</Text>
      </Link>
      <Text variant="table">{`${order.name}`}</Text>
      <Link to={`/order-history?search=${order.email}`} style={{ color: 'royalblue' }}>
        <Text variant="table" sx={{ color: 'primary' }}>{order.email}</Text>
      </Link>
      <Text variant="price">{`$${order.total?.toFixed(2)}`}</Text>
    </Grid>
  );
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchParams] = useSearchParams();

  const filteredOrders = orders.filter((o) => o.email.includes(searchValue.trim()));

  const handleSearchChange = (event) => {
    const { value } = event.target;
    navigate(value ? `/order-history?search=${value}` : '/order-history', { replace: true });
    setSearchValue(event.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get('http://localhost:3001/store/orders');
      setOrders(result.data.orders);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    if (typeof search === 'string') {
      setSearchValue(searchParams.get('search'));
    }
  }, [searchParams]);

  return (
    <>
      <Grid sx={{ gridTemplateColumns: 'auto auto 1fr auto', mb: 4, gap: 2 }}>
        <Link to="/" style={{ color: 'royalblue' }}>
          <Text as="h1" variant="link" color="primary">Store</Text>
        </Link>
        <Text as="h1" variant="link">/</Text>
        <Text as="h1" variant="link">Order History</Text>
      </Grid>
      <Label htmlFor="search" sx={{ fontSize: 0, mb: 2 }}>Search by email:</Label>
      <Grid mb={4} sx={{ gridTemplateColumns: searchValue ? '1fr auto' : 'auto' }}>
        <Input id="search" value={searchValue} onChange={handleSearchChange} />
        {!!searchValue && <Button onClick={clearSearch} variant="secondary">Clear</Button>}
      </Grid>
      <Grid>
        <TableHeadings />
        {filteredOrders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </Grid>
    </>
  );
}
