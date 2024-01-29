import path from 'path';
import fs from 'fs/promises';

const ProductDetailPage = (props) => {
  const { loadedProduct } = props;

  if (!loadedProduct) return <p>Loading...</p>; //Not needed if we set fallback: 'blocking' and not fallback: true

  return (
    <>
      <h1>{loadedProduct.title}</h1> <p>{loadedProduct.description}</p>
    </>
  );
};

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  //process.cwd gives us the current working directory of the code file (the code block it is written in)  when it is executed, which would
  //be the overall project folder not the file we are working in. 'data' is the data folder/directory we are diving into
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData); //converts the json data into a regular javascript object

  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;

  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);

  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    // paths: [
    //   {
    //     params: {
    //       pid: 'p1',
    //     },
    //   },
    //   // {
    //   //   params: {
    //   //     pid: 'p2',
    //   //   },
    //   // },
    //   // {
    //   //   params: {
    //   //     pid: 'p3',
    //   //   },
    //   // },
    // ],
    // fallback: true,
    // fallback: 'blocking',
    paths: pathsWithParams,
    fallback: true,
  };
}

export default ProductDetailPage;
