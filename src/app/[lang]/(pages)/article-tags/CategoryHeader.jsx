const CategoryHeader = ({ title, lang }) => {
  return (
    <h1 className="text-black ms-5 mb-4 text-3xl font-bold pb-[14px] pt-[50px] ltr:text-left rtl:text-right">
      {title}
    </h1>
  );
};

export default CategoryHeader;
