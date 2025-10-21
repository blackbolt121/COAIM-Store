

import ProductCard from "./ProductCard.tsx";
import SkeletonCard from "./SkeletonCard.tsx";
import {Product} from "../store/store.ts";
interface ProductSectionProps {
    productData: Product[];
    title: string;
}
const ProductsSection = ( {productData, title}: ProductSectionProps) => {



    const renderContent = () => {

        if (productData.length == 0) {
            return [0,1,2,3,4].map( x => {
                    //console.log(x);
                    return (<SkeletonCard key={x}/>)
                });
        }

        // Aquí se renderiza TU ProductCard con las props correctas.
        return productData.map((product) => (
            <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
                imageUrl={product.imageUrl}
                sku={product.sku}
            />
        ));
    };

    return (
        <div className="">
            <div className='container mx-auto px-4'>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight text-center mb-2">{title}</h1>
                <div className="w-50 h-1 bg-red-600 mx-auto mb-15"></div>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center">
                    {renderContent()}
                </section>
            </div>
        </div>
    );
};


export default ProductsSection;