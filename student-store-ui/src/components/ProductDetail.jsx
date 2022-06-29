import React from 'react';
import { Box, Image, Text } from 'theme-ui';

export default function ProductDetail({ product }) {
  return (
    <Box>
      <Box as="h3" sx={{ fontSize: 2, mb: 3 }}>{`Category: ${product.category}`}</Box>
      <Text variant="price" as="h3" sx={{ fontSize: 2, mb: 3 }}>{`Price: $${product.price.toFixed(2)}`}</Text>
      <Image src={product.image} sx={{ borderRadius: 3, mb: 3 }} />
    </Box>
  );
}
