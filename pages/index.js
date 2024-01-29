import path from 'path';
import fs from 'fs/promises'; //installs the file system module from nodejs.
import Link from 'next/link';
//Working with the fs module would fail if we try to do it from the client side because browser-side javascript can't access the file system.
//We can use the file system module inside of getStaticProps

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps(context) {
  console.log('RE-generating...');
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  //process.cwd gives us the current working directory of the code file (the code block it is written in)  when it is executed, which would
  //be the overall project folder not the file we are working in. 'data' is the data folder/directory we are diving into
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData); //converts the json data into a regular javascript object

  if (!data) {
    return {
      redirect: {
        destination: '/no-data',
      },
    };
  }

  if (data.products.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
    // notFound: true,
  };
}

export default HomePage;
