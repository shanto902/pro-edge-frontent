import ProductSpecItem from "../common/utils/ProductDetails/ProductSpecItem";

const ProductSpecList = ({ features }) => {
  // If no features are provided, return null or a message
  if (!features || features.length === 0) {
    return (
      <div className="text-base leading-6 max-w-xs text-[#182B55] font-medium space-y-1 p-6">
        <p>No specifications available</p>
      </div>
    );
  }

  return (
    <div className="text-base leading-6 max-w-xs text-[#182B55] font-medium space-y-1 p-6">
      {features.map((feature, index) => (
        <ProductSpecItem 
          key={index} 
          label={feature.feature_name} 
          value={feature.feature_value} 
        />
      ))}
    </div>
  );
};

export default ProductSpecList;
