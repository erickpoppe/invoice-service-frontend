import { useRouter } from 'next/router';
import ProductItem from '@/components/ProductItem';
import { data } from '@/utils/data';

export default function Category() {
    const router = useRouter();
    const { category } = router.query;
    const { products } = data;

    const filteredProducts = products.filter((product) => product.category === category);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <h2>Products in Category: {category}</h2>
            {filteredProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
            ))}
        </div>
    );
}