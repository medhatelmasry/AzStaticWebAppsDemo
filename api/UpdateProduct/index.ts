import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { ENDPOINT, KEY, DATABASE, CONTAINER} = process.env;
    const client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
    const database = client.database(DATABASE);
    const container = database.container(CONTAINER);
    
    const product = req.body;
    const { id, brand } = product;

    console.log("product >> " + product.brand.name );
    console.log("id & brand >> " + { id, brand });

    let { resource } = await container.item(id, brand.name).replace(product);

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: resource
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: err.message
    };
  }
};

export default httpTrigger;