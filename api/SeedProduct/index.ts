import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { SeedData } from "../data/seed-data";
import { DbContext } from "../data/db-context";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { ENDPOINT, KEY, DATABASE, CONTAINER, PARTITION_KEY} = process.env;

    const client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });

    const database = client.database(DATABASE);
    const container = database.container(CONTAINER);

    let partition_key =JSON.parse(PARTITION_KEY);

    await DbContext.create(client, DATABASE, CONTAINER, partition_key);

    let iterator = container.items.readAll();
    let { resources } = await iterator.fetchAll();

    if (resources.length > 0) {
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: `The database is already seeded with ${resources.length} products.`
      };
    } else {
      
      const products = SeedData.getProducts();

      products.forEach(async function (item) {
        const { resource: createdItem } = await container.items.create(item);
        console.log(item);
      })
  
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: `The database has been seeded with ${products.length} products.`
      };
    }


  } catch (err) {
    context.res = {
      status: 500,
      body: err.message
    };
  }
};

export default httpTrigger;